import BloodRequest from '../models/BloodRequest.js';
import User from '../models/User.js';
import { isValidUrgency, isValidBloodGroup } from '../utils/validators.js';
import { findMatchingDonors } from '../services/donorMatchingService.js';

/**
 * Create blood request
 * POST /api/requests
 */
export const createRequest = async (req, res) => {
  try {
    const {
      patientName,
      bloodGroup,
      unitsRequired,
      hospitalName,
      hospitalLocation,
      city,
      state,
      pincode,
      latitude,
      longitude,
      urgency,
      description,
    } = req.body;

    // Validation
    if (
      !patientName ||
      !bloodGroup ||
      !unitsRequired ||
      !hospitalName ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    if (!isValidBloodGroup(bloodGroup)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blood group',
      });
    }

    if (unitsRequired < 1 || unitsRequired > 20) {
      return res.status(400).json({
        success: false,
        message: 'Units must be between 1 and 20',
      });
    }

    if (urgency && !isValidUrgency(urgency)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid urgency level',
      });
    }

    // Create blood request
    const bloodRequest = new BloodRequest({
      requesterId: req.userId,
      patientName,
      bloodGroup,
      unitsRequired,
      hospitalName,
      hospitalLocation,
      city,
      state,
      pincode,
      latitude: latitude || null,
      longitude: longitude || null,
      urgency: urgency || 'NORMAL',
      description: description || '',
      status: 'PENDING',
    });

    await bloodRequest.save();

    // Find matching donors asynchronously (don't wait)
    findMatchingDonors(bloodRequest, 10)
      .then((matchedDonors) => {
        if (matchedDonors && matchedDonors.length > 0) {
          bloodRequest.matchedDonors = matchedDonors.map((d) => ({
            donorId: d._id,
            matchScore: d.matchScore,
          }));
          bloodRequest.status = 'MATCHED';
          bloodRequest.save().catch((err) => console.error('Error updating matched donors:', err));
        }
      })
      .catch((err) => console.error('Error finding matching donors:', err));

    return res.status(201).json({
      success: true,
      message: 'Blood request created successfully',
      data: bloodRequest,
    });
  } catch (error) {
    console.error('Create request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating blood request',
    });
  }
};

/**
 * Get all blood requests
 * GET /api/requests
 */
export const getAllRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const query = {};
    if (status) {
      query.status = status;
    }

    const requests = await BloodRequest.find(query)
      .populate('requesterId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await BloodRequest.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: 'Blood requests retrieved successfully',
      data: requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get all requests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving blood requests',
    });
  }
};

/**
 * Get request by ID
 * GET /api/requests/:id
 */
export const getRequestById = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate('requesterId', 'name email phone')
      .populate('matchedDonors.donorId', 'name email phone bloodGroup city');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Blood request retrieved successfully',
      data: request,
    });
  } catch (error) {
    console.error('Get request by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving blood request',
    });
  }
};

/**
 * Update blood request
 * PUT /api/requests/:id
 */
export const updateRequest = async (req, res) => {
  try {
    const { status, urgency, description } = req.body;

    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found',
      });
    }

    // Only requester or admin can update
    if (
      req.userId !== request.requesterId.toString() &&
      req.user?.role !== 'ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request',
      });
    }

    if (status && !['PENDING', 'MATCHED', 'FULFILLED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    if (urgency && !isValidUrgency(urgency)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid urgency level',
      });
    }

    if (status) request.status = status;
    if (urgency) request.urgency = urgency;
    if (description !== undefined) request.description = description;

    await request.save();

    return res.status(200).json({
      success: true,
      message: 'Blood request updated successfully',
      data: request,
    });
  } catch (error) {
    console.error('Update request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating blood request',
    });
  }
};

/**
 * Delete blood request
 * DELETE /api/requests/:id
 */
export const deleteRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found',
      });
    }

    // Only requester or admin can delete
    if (
      req.userId !== request.requesterId.toString() &&
      req.user?.role !== 'ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this request',
      });
    }

    await BloodRequest.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Blood request deleted successfully',
    });
  } catch (error) {
    console.error('Delete request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting blood request',
    });
  }
};

/**
 * Get requests by user
 * GET /api/requests/user/my-requests
 */
export const getMyRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const requests = await BloodRequest.find({ requesterId: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await BloodRequest.countDocuments({ requesterId: req.userId });

    return res.status(200).json({
      success: true,
      message: 'Your requests retrieved successfully',
      data: requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get my requests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving your requests',
    });
  }
};

export default {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  getMyRequests,
};
