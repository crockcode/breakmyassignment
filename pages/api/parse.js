import fetch from 'node-fetch';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileUrl, fileType } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ error: 'File URL is required' });
    }

    // Fetch file from Firebase URL
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      return res.status(500).json({ error: 'Failed to fetch file' });
    }
    
    const fileBuffer = await fileResponse.arrayBuffer();
    
    // Extract text based on file type
    let parsedText;
    
    if (fileUrl.toLowerCase().endsWith('.pdf') || fileType === 'application/pdf') {
      // Process PDF file
      try {
        const pdfData = await pdfParse(Buffer.from(fileBuffer));
        parsedText = pdfData.text;
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        return res.status(500).json({ error: 'Failed to parse PDF: ' + pdfError.message });
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
        parsedText = result.value;
      } catch (docxError) {
        console.error('DOCX parsing error:', docxError);
        return res.status(500).json({ error: 'Failed to parse DOCX: ' + docxError.message });
      }
    } else {
      return res.status(400).json({ error: 'Unsupported file format' });
    }
    
    // Check if we have text to analyze
    if (!parsedText || parsedText.trim().length === 0) {
      return res.status(400).json({ error: 'No text could be extracted from the file' });
    }
    
    // Return the parsed text
    return res.status(200).json({ 
      success: true, 
      parsedText,
      fileUrl
    });
  } catch (error) {
    console.error('Error parsing file:', error);
    return res.status(500).json({ error: error.message || 'An error occurred while parsing the file' });
  }
} 