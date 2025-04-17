import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';
import { OpenAI } from 'openai';
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from '@/lib/mongoose';
import Assignment from '@/lib/mongodb/models/Assignment';
import User from '@/models/User';
import { hasReachedUploadLimit, trackUpload } from '@/lib/auth';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Get the user's session
    const session = await getServerSession({
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    // Parse request body
    const { fileUrl, fileName, fileType } = await request.json();
    
    if (!fileUrl) {
      return NextResponse.json({ error: 'File URL is required' }, { status: 400 });
    }
    
    // If user is authenticated, check upload limits
    if (session?.user?.email) {
      const limitReached = await hasReachedUploadLimit(session.user.email);
      
      if (limitReached) {
        return NextResponse.json({ 
          error: 'Monthly upload limit reached', 
          limitReached: true 
        }, { status: 403 });
      }
    }
    
    // Fetch file from Firebase URL
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
    }
    
    const fileBuffer = await fileResponse.arrayBuffer();
    
    // Extract text based on file type
    let extractedText;
    
    if (fileUrl.toLowerCase().endsWith('.pdf') || fileType === 'application/pdf') {
      // Process PDF file
      try {
        const pdfData = await pdfParse(Buffer.from(fileBuffer));
        extractedText = pdfData.text;
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        return NextResponse.json({ error: 'Failed to parse PDF: ' + pdfError.message }, { status: 500 });
      }
    } else if (
      fileUrl.toLowerCase().endsWith('.docx') || 
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      // Process DOCX file
      try {
        const result = await mammoth.extractRawText({
          buffer: Buffer.from(fileBuffer)
        });
        extractedText = result.value;
      } catch (docxError) {
        console.error('DOCX parsing error:', docxError);
        return NextResponse.json({ error: 'Failed to parse DOCX: ' + docxError.message }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: 'Unsupported file format' }, { status: 400 });
    }
    
    // Check if we have text to analyze
    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json({ error: 'No text could be extracted from the file' }, { status: 400 });
    }
    
    // Prepare prompt for OpenAI
    const prompt = `You are an educational assistant analyzing an assignment document. 
    Analyze the following assignment text and provide:
    1. A breakdown of all questions or tasks that need to be completed
    2. A list of key concepts and references mentioned that will be helpful
    3. An estimated time to complete each part (in hours)
    4. A suggested approach for tackling the assignment
    
    Format your response in clear sections with Markdown headings. Keep it concise and student-friendly.
    
    Here is the assignment text:
    ${extractedText.slice(0, 8000)}`; // Limiting text to avoid token limitations
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {"role": "system", "content": "You are a helpful educational assistant that analyzes academic assignments and breaks them down into manageable parts."},
        {"role": "user", "content": prompt}
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });
    
    const analysis = completion.choices[0].message.content;
    
    // Use user email for userId if authenticated, otherwise 'anonymous'
    const userId = session?.user?.email || 'anonymous';
    
    // Save analysis to database
    const assignment = new Assignment({
      fileName,
      fileUrl,
      extractedText: extractedText.slice(0, 10000), // Limiting stored text
      analysis,
      userId,
      createdAt: new Date()
    });
    
    await assignment.save();
    
    // If user is authenticated, track this upload
    if (session?.user?.email) {
      await trackUpload(
        session.user.email,
        assignment._id.toString(),
        fileName,
        fileType
      );
    }
    
    // Return the analysis
    return NextResponse.json({ 
      success: true, 
      analysis,
      assignmentId: assignment._id,
      isAuthenticated: !!session?.user
    });
    
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ error: error.message || 'An error occurred while processing the file' }, { status: 500 });
  }
} 