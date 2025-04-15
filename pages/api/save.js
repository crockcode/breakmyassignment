import { connectToDatabase } from '@/lib/mongodb';
import Assignment from '@/lib/mongodb/models/Assignment';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse request body
    const { fileUrl, parsedText, aiBreakdown, fileName, modelUsed } = req.body;
    
    if (!fileUrl || !parsedText || !aiBreakdown) {
      return res.status(400).json({ 
        error: 'Required fields missing', 
        missing: {
          fileUrl: !fileUrl,
          parsedText: !parsedText,
          aiBreakdown: !aiBreakdown
        }
      });
    }
    
    // Try to connect to database with timeout
    try {
      // Set a timeout for MongoDB connection
      const connectionPromise = connectToDatabase();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 5000)
      );
      
      await Promise.race([connectionPromise, timeoutPromise]);
      console.log('Successfully connected to MongoDB');
    } catch (dbError) {
      console.error('MongoDB connection error:', dbError);
      // Return success but with a note about storage failure
      // This allows the frontend to show analysis but note storage failed
      return res.status(200).json({ 
        success: true,
        storageFailed: true,
        error: dbError.message,
        analysisData: {
          fileName: fileName || 'Unnamed Assignment',
          analysis: aiBreakdown
        }
      });
    }
    
    // Get user session if available
    let userId = 'anonymous';
    try {
      const session = await getServerSession(req, res, authOptions);
      userId = session?.user?.id || 'anonymous';
    } catch (sessionError) {
      console.warn('Session error, using anonymous user:', sessionError);
    }
    
    // Save to database
    const assignment = new Assignment({
      fileName: fileName || 'Unnamed Assignment',
      fileUrl,
      extractedText: parsedText.slice(0, 10000), // Limiting stored text
      analysis: aiBreakdown,
      aiModel: modelUsed || 'gpt-3.5-turbo', // Store which model was used
      userId,
      createdAt: new Date()
    });
    
    await assignment.save();
    console.log('Assignment saved successfully');
    
    // Return success with the ID for redirection
    return res.status(200).json({ 
      success: true, 
      assignmentId: assignment._id
    });
    
  } catch (error) {
    console.error('Error saving to database:', error);
    // Return the analysis even if saving failed
    return res.status(200).json({ 
      success: true,
      storageFailed: true,
      error: error.message,
      analysisData: req.body ? {
        fileName: req.body.fileName || 'Unnamed Assignment',
        analysis: req.body.aiBreakdown
      } : {}
    });
  }
} 