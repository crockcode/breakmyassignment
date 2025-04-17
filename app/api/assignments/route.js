import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import Assignment from '@/models/Assignment';

export async function GET() {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Get current user from session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Find all assignments for the current user
    const assignments = await Assignment.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    
    return NextResponse.json({ 
      success: true, 
      assignments,
      count: assignments.length
    });
    
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
} 