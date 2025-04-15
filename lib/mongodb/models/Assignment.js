import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  extractedText: {
    type: String,
    required: true,
  },
  analysis: {
    type: String,
    required: true,
  },
  aiModel: {
    type: String,
    default: 'gpt-3.5-turbo',
  },
  userId: {
    type: String,
    default: 'anonymous',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if model exists to prevent overwriting during hot reloads
const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);

export default Assignment; 