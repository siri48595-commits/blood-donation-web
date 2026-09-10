import User from '../models/User.js';
import BloodRequest from '../models/BloodRequest.js';
import DonationRequest from '../models/DonationRequest.js';

/**
 * Get dashboard statistics
 * GET /api/admin/dashboard
 */
export const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalDonors = await User.countDocuments({
      role: 'DONOR',
      isActive: true,
    });
    const totalRecipients = await User.countDocuments({
      role: 'RECIPIENT',
      isActive: true,
    });
    const availableDonors = await User.countDocuments({
      role: 'DONOR',
      isAvailable: true,
      isActive: true,
    });

    const totalRequests = await BloodRequest.countDocuments();
    const pendingRequests = await BloodRequest.countDocuments({
      status: 'PENDING',
    });
    const fulfilledRequests = await BloodRequest.countDocuments({
      status: 'FULFILLED',
    });
    const urgentRequests = await BloodRequest.countDocuments({
      urgency: { $in: ['URGENT', 'CRITICAL'] },
    });

    const totalDonationRequests = await DonationRequest.countDocuments();
    const acceptedDonations = await DonationRequest.countDocuments({
      status: 'ACCEPTED',
    });
    const completedDonations = await DonationRequest.countDocuments({
      status: 'COMPLETED',
    });

    const bloodGroupStats = await User.aggregate([
      {
        $match: {
          role: 'DONOR',
          isActive: true,
        },
      },
      {
        $group: {
          _id: '$bloodGroup',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved',
      data: {
        users: {
          totalUsers,
          totalDonors,
          totalRecipients,
          availableDonors,
        },
        requests: {
          totalRequests,
          pendingRequests,
          fulfilledRequests,
          urgentRequests,
        },
        donations: {
          totalDonationRequests,
          acceptedDonations,
          completedDonations,
        },
        bloodGroupStats,
      },
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving dashboard statistics',
    });
  }
};

/**
 * Get all users (admin only)
 * GET /api/admin/users
 */
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const role = req.query.role;

    const query = {};
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving users',
    });
  }
};

/**
 * Update user (admin only)
 * PUT /api/admin/users/:id
 */
export const updateUser = async (req, res) => {
  try {
    const { isActive, role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (isActive !== undefined) {
      user.isActive = isActive;
    }

    if (role && ['DONOR', 'RECIPIENT', 'ADMIN'].includes(role)) {
      user.role = role;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating user',
    });
  }
};

/**
 * Delete user (admin only)
 * DELETE /api/admin/users/:id
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Soft delete - mark as inactive instead of removing
    user.isActive = false;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting user',
    });
  }
};

/**
 * Get all blood requests (admin only)
 * GET /api/admin/requests
 */
export const getAllBloodRequests = async (req, res) => {
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
    console.error('Get all blood requests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving blood requests',
    });
  }
};

/**
 * Get all donation requests (admin only)
 * GET /api/admin/donation-requests
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
      .populate('donorId', 'name email phone')
      .populate('recipientId', 'name email phone')
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

export default {
  getDashboard,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllBloodRequests,
  getAllDonationRequests,
};
