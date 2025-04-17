import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongoose';

export async function GET() {
  try {
    // Check MongoDB connection using the MongoDB driver
    const client = await clientPromise;
    const mongoClientStatus = client.topology?.isConnected() ? 'connected' : 'disconnected';
    
    // Check Mongoose connection
    let mongooseStatus = 'not initialized';
    try {
      await connectToDatabase();
      mongooseStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    } catch (error) {
      mongooseStatus = `error: ${error.message}`;
    }

    // Return connection status
    return NextResponse.json({
      success: true,
      mongodb: {
        client: mongoClientStatus,
        mongoose: mongooseStatus
      },
      time: new Date().toISOString()
    });
  } catch (error) {
    console.error('MongoDB connection check failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      time: new Date().toISOString()
    }, { status: 500 });
  }
} 