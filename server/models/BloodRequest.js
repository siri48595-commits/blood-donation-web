import mongoose from 'mongoose';

const bloodRequestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientName: {
      type: String,
      required: [true, 'Please provide patient name'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: [true, 'Please provide blood group'],
    },
    unitsRequired: {
      type: Number,
      required: [true, 'Please provide units required'],
      min: [1, 'Units must be at least 1'],
      max: [20, 'Units cannot exceed 20'],
    },
    hospitalName: {
      type: String,
      required: [true, 'Please provide hospital name'],
    },
    hospitalLocation: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
    },
    state: {
      type: String,
      required: [true, 'Please provide state'],
    },
    pincode: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    urgency: {
      type: String,
      enum: ['NORMAL', 'URGENT', 'CRITICAL'],
      default: 'NORMAL',
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'MATCHED', 'FULFILLED', 'CANCELLED'],
      default: 'PENDING',
    },
    matchedDonors: [{
      donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      matchScore: Number,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    }],
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
bloodRequestSchema.index({ requesterId: 1 });
bloodRequestSchema.index({ bloodGroup: 1 });
bloodRequestSchema.index({ status: 1 });
bloodRequestSchema.index({ urgency: 1 });
bloodRequestSchema.index({ city: 1, state: 1 });
bloodRequestSchema.index({ createdAt: -1 });

export default mongoose.model('BloodRequest', bloodRequestSchema);
