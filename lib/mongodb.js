import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
// Add DNS resolution options and timeout settings
const options = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4  // Use IPv4, skip trying IPv6
};

let client;
let clientPromise;

// Add error handling for MongoDB connection
const connectWithRetry = async () => {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    const client = new MongoClient(uri, options);
    return await client.connect();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Log information that could help diagnose the issue
    console.log('MongoDB URI format check (obscured):', 
      process.env.MONGODB_URI.replace(/(mongodb(\+srv)?:\/\/)[^:]+:[^@]+@/, '$1****:****@'));
    throw error;
  }
};

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = connectWithRetry();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = connectWithRetry();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise; 