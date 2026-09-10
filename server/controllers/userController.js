import User from '../models/User.js';
import { isValidBloodGroup } from '../utils/validators.js';

/**
 * Get user profile
 * GET /api/user/profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving profile',
    });
  }
};

/**
 * Update user profile
 * PUT /api/user/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      bloodGroup,
      dateOfBirth,
      gender,
      city,
      state,
      area,
      pincode,
      latitude,
      longitude,
      profileImage,
    } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (bloodGroup) {
      if (!isValidBloodGroup(bloodGroup)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid blood group',
        });
      }
      user.bloodGroup = bloodGroup;
    }
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;
    if (city) user.city = city;
    if (state) user.state = state;
    if (area) user.area = area;
    if (pincode) user.pincode = pincode;
    if (latitude !== undefined) user.latitude = latitude;
    if (longitude !== undefined) user.longitude = longitude;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating profile',
    });
  }
};

/**
 * Update donor availability
 * PUT /api/user/availability
 */
export const updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid availability status',
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role !== 'DONOR') {
      return res.status(403).json({
        success: false,
        message: 'Only donors can update availability',
      });
    }

    user.isAvailable = isAvailable;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Availability updated successfully',
      data: {
        isAvailable: user.isAvailable,
      },
    });
  } catch (error) {
    console.error('Update availability error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating availability',
    });
  }
};

/**
 * Update last donation date
 * PUT /api/user/last-donation
 */
export const updateLastDonationDate = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role !== 'DONOR') {
      return res.status(403).json({
        success: false,
        message: 'Only donors can update donation date',
      });
    }

    user.lastDonationDate = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Last donation date updated successfully',
      data: {
        lastDonationDate: user.lastDonationDate,
      },
    });
  } catch (error) {
    console.error('Update last donation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating donation date',
    });
  }
};

export default {
  getProfile,
  updateProfile,
  updateAvailability,
  updateLastDonationDate,
};
