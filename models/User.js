import mongoose from 'mongoose';

// Create schema if it doesn't exist yet (handles hot reloading)
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  uploads: [
    {
      assignmentId: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      fileName: String,
      fileType: String,
    }
  ],
  isPro: {
    type: Boolean,
    default: false,
  }
});

// Check if model already exists to prevent overwrite during hot reloading
export default mongoose.models.User || mongoose.model('User', UserSchema); 