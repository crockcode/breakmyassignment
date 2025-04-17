import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "./mongoose";
import User from "@/models/User";

// Utility function to get the server session
export async function getSession() {
  return await getServerSession({
    secret: process.env.NEXTAUTH_SECRET,
  });
}

// Get the current user from session
export async function getCurrentUser() {
  try {
    const session = await getSession();
    
    if (!session?.user?.email) {
      return null;
    }
    
    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return null;
    }
    
    return {
      id: user._id.toString(),
      email: user.email,
      isPro: user.isPro,
      uploads: user.uploads,
      uploadCount: user.uploads.length,
      createdAt: user.createdAt,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Check if a user has reached their monthly upload limit
export async function hasReachedUploadLimit(userEmail) {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      return true; // If no user found, prevent upload
    }
    
    // Pro users have no limits
    if (user.isPro) {
      return false;
    }
    
    // Calculate uploads in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUploads = user.uploads.filter(upload => 
      new Date(upload.timestamp) > thirtyDaysAgo
    );
    
    // Free tier limit: 3 uploads per month
    return recentUploads.length >= 3;
  } catch (error) {
    console.error("Error checking upload limit:", error);
    return true; // Prevent upload on error
  }
}

// Track a new upload
export async function trackUpload(userEmail, assignmentId, fileName, fileType) {
  try {
    await connectToDatabase();
    
    await User.findOneAndUpdate(
      { email: userEmail },
      { 
        $push: { 
          uploads: {
            assignmentId,
            timestamp: new Date(),
            fileName,
            fileType
          }
        } 
      }
    );
    
    return true;
  } catch (error) {
    console.error("Error tracking upload:", error);
    return false;
  }
}

// Get recent upload count (last 30 days)
export async function getRecentUploadCount(userEmail) {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      return 0;
    }
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUploads = user.uploads.filter(upload => 
      new Date(upload.timestamp) > thirtyDaysAgo
    );
    
    return recentUploads.length;
  } catch (error) {
    console.error("Error getting recent upload count:", error);
    return 0;
  }
} 