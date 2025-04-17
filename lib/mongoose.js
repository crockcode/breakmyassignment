import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4
    };

    console.log('Mongoose: Attempting to connect to MongoDB with URI:', MONGODB_URI);

    
    cached.promise = mongoose.connect(MONGODB_URI, options)
      .then(mongoose => {
        console.log('Mongoose: Connected successfully to MongoDB');
        return mongoose;
      })
      .catch(err => {
        console.error('Mongoose connection error:', err);
        throw err;
      });
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Failed to establish mongoose connection:', error);
    throw error;
  }
} 