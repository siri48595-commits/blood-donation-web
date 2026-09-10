import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    conversationId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Message content required'],
    },
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
chatSchema.index({ userId: 1, conversationId: 1 });
chatSchema.index({ conversationId: 1 });
chatSchema.index({ timestamp: -1 });

export default mongoose.model('Chat', chatSchema);
