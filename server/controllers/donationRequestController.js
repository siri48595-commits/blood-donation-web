import DonationRequest from '../models/DonationRequest.js';
import BloodRequest from '../models/BloodRequest.js';
import User from '../models/User.js';
import { isValidDonationRequestStatus } from '../utils/validators.js';

const roundCoordinates = (entity) => {
  if (!entity) return entity;
  if (Number.isFinite(entity.latitude)) entity.latitude = Number(entity.latitude.toFixed(3));
  if (Number.isFinite(entity.longitude)) entity.longitude = Number(entity.longitude.toFixed(3));
  return entity;
};

const privacySafeRequest = (request) => {
  const data = request.toObject ? request.toObject() : request;
  roundCoordinates(data.donorId);
  roundCoordinates(data.recipientId);
  roundCoordinates(data.bloodRequestId);
  return data;
};

/**
 * Send donation request
 * POST /api/donation-requests
 */
export const sendDonationRequest = async (req, res) => {
  try {
    const { donorId, bloodRequestId, message } = req.body;

    if (!donorId || !bloodRequestId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide donor ID and blood request ID',
      });
    }

    // Check if donor exists
    const donor = await User.findById(donorId);
    if (!donor || donor.role !== 'DONOR') {
      return res.status(404).json({
        success: false,
        message: 'Donor not found',
      });
    }

    // Check if blood request exists
    const bloodRequest = await BloodRequest.findById(bloodRequestId);
    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found',
      });
    }

    // Check if donation request already exists
    const existingRequest = await DonationRequest.findOne({
      donorId,
      bloodRequestId,
      status: { $in: ['PENDING', 'ACCEPTED'] },
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Donation request already exists for this donor and request',
      });
    }

    // Create donation request
    const donationRequest = new DonationRequest({
      requestId: bloodRequestId,
      donorId,
      recipientId: bloodRequest.requesterId,
      bloodRequestId,
      message: message || '',
      status: 'PENDING',
    });

    await donationRequest.save();

    return res.status(201).json({
      success: true,
      message: 'Donation request sent successfully',
      data: donationRequest,
    });
  } catch (error) {
    console.error('Send donation request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error sending donation request',
    });
  }
};

/**
 * Get all donation requests
 * GET /api/donation-requests
 */
export const getAllDonationRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const query = {};
    if (status) {
      query.status = status;
    }

    const requests = await DonationRequest.find(query)
      .populate('donorId', 'name email phone bloodGroup')
      .populate('recipientId', 'name email phone')
      .populate('bloodRequestId', 'patientName bloodGroup urgency')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await DonationRequest.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: 'Donation requests retrieved successfully',
      data: requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get all donation requests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving donation requests',
    });
  }
};

/**
 * Get donation request by ID
 * GET /api/donation-requests/:id
 */
export const getDonationRequestById = async (req, res) => {
  try {
    const request = await DonationRequest.findById(req.params.id)
      .populate('donorId', 'name email phone bloodGroup city')
      .populate('recipientId', 'name email phone')
      .populate('bloodRequestId', 'patientName bloodGroup urgency');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Donation request not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Donation request retrieved successfully',
      data: privacySafeRequest(request),
    });
  } catch (error) {
    console.error('Get donation request by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving donation request',
    });
  }
};

/**
 * Update donation request status
 * PUT /api/donation-requests/:id
 */
export const updateDonationRequest = async (req, res) => {
  try {
    const { status, donorMessage } = req.body;

    const request = await DonationRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Donation request not found',
      });
    }

    // Only donor or recipient can update
    if (
      req.userId !== request.donorId.toString() &&
      req.userId !== request.recipientId.toString() &&
      req.user?.role !== 'ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request',
      });
    }

    if (status && !isValidDonationRequestStatus(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    if (status) request.status = status;
    if (donorMessage !== undefined) request.donorMessage = donorMessage;

    await request.save();

    return res.status(200).json({
      success: true,
      message: 'Donation request updated successfully',
      data: request,
    });
  } catch (error) {
    console.error('Update donation request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating donation request',
    });
  }
};

/**
 * Get requests for donor
 * GET /api/donation-requests/donor/:donorId
 */
export const getDonorRequests = async (req, res) => {
  try {
    if (req.userId !== req.params.donorId) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these donor requests' });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const requests = await DonationRequest.find({ donorId: req.params.donorId })
      .populate('recipientId', 'name email phone city state latitude longitude')
      .populate('bloodRequestId', 'patientName bloodGroup urgency hospitalName hospitalLocation city state latitude longitude')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await DonationRequest.countDocuments({ donorId: req.params.donorId });

    return res.status(200).json({
      success: true,
      message: 'Donor requests retrieved successfully',
      data: requests.map(privacySafeRequest),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get donor requests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving donor requests',
    });
  }
};

/**
 * Get requests for recipient
 * GET /api/donation-requests/recipient/:recipientId
 */
export const getRecipientRequests = async (req, res) => {
  try {
    if (req.userId !== req.params.recipientId) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these recipient requests' });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const requests = await DonationRequest.find({ recipientId: req.params.recipientId })
      .populate('donorId', 'name email phone bloodGroup city state latitude longitude')
      .populate('bloodRequestId', 'patientName bloodGroup urgency hospitalName hospitalLocation city state latitude longitude')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await DonationRequest.countDocuments({
      recipientId: req.params.recipientId,
    });

    return res.status(200).json({
      success: true,
      message: 'Recipient requests retrieved successfully',
      data: requests.map(privacySafeRequest),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get recipient requests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving recipient requests',
    });
  }
};

export default {
  sendDonationRequest,
  getAllDonationRequests,
  getDonationRequestById,
  updateDonationRequest,
  getDonorRequests,
  getRecipientRequests,
};
