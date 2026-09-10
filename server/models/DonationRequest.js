import mongoose from 'mongoose';

const donationRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodRequest',
      required: true,
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bloodRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodRequest',
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
    message: {
      type: String,
      maxlength: [300, 'Message cannot exceed 300 characters'],
    },
    donorMessage: {
      type: String,
      maxlength: [300, 'Donor message cannot exceed 300 characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
donationRequestSchema.index({ donorId: 1 });
donationRequestSchema.index({ recipientId: 1 });
donationRequestSchema.index({ requestId: 1 });
donationRequestSchema.index({ status: 1 });
donationRequestSchema.index({ createdAt: -1 });

export default mongoose.model('DonationRequest', donationRequestSchema);
