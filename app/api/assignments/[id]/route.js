import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import Assignment from '@/lib/mongodb/models/Assignment';

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid assignment ID' }, { status: 400 });
    }
    
    const assignment = await Assignment.findById(id);
    
    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      assignment: {
        _id: assignment._id,
        fileName: assignment.fileName,
        fileUrl: assignment.fileUrl,
        analysis: assignment.analysis,
        createdAt: assignment.createdAt,
      }
    });
    
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return NextResponse.json({ error: error.message || 'An error occurred while fetching the assignment' }, { status: 500 });
  }
} 