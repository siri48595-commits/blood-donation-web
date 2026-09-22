import User from '../models/User.js';
import { isWithinRadius } from '../utils/distanceService.js';

const toPrivacySafeDonor = (donor) => {
  const data = donor.toObject ? donor.toObject() : donor;
  delete data.password;
  delete data.passwordResetToken;
  delete data.passwordResetExpires;
  delete data.passwordResetOtp;
  delete data.passwordResetOtpExpires;
  delete data.passwordResetOtpAttempts;
  delete data.passwordResetOtpChannel;
  return {
    ...data,
    latitude: Number.isFinite(data.latitude) ? Number(data.latitude.toFixed(3)) : null,
    longitude: Number.isFinite(data.longitude) ? Number(data.longitude.toFixed(3)) : null,
  };
};

/**
 * Get all donors
 * GET /api/donors
 */
export const getAllDonors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const donors = await User.find({
      role: 'DONOR',
      isActive: true,
    })
      .select('-password -passwordResetToken -passwordResetExpires -passwordResetOtp -passwordResetOtpExpires -passwordResetOtpAttempts -passwordResetOtpChannel')
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({
      role: 'DONOR',
      isActive: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Donors retrieved successfully',
      data: donors.map(toPrivacySafeDonor),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get all donors error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving donors',
    });
  }
};

/**
 * Get donor by ID
 * GET /api/donors/:id
 */
export const getDonorById = async (req, res) => {
  try {
    const donor = await User.findById(req.params.id).select('-password -passwordResetToken -passwordResetExpires -passwordResetOtp -passwordResetOtpExpires -passwordResetOtpAttempts -passwordResetOtpChannel');

    if (!donor || donor.role !== 'DONOR') {
      return res.status(404).json({
        success: false,
        message: 'Donor not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Donor retrieved successfully',
      data: toPrivacySafeDonor(donor),
    });
  } catch (error) {
    console.error('Get donor by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving donor',
    });
  }
};

/**
 * Search donors with filters
 * GET /api/donors/search
 */
export const searchDonors = async (req, res) => {
  try {
    const {
      bloodGroup,
      city,
      state,
      area,
      pincode,
      available,
      radius,
      latitude,
      longitude,
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const pageLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const skip = (pageNumber - 1) * pageLimit;

    // Build query
    const query = {
      role: 'DONOR',
      isActive: true,
    };

    if (bloodGroup) {
      query.bloodGroup = bloodGroup;
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (state) {
      query.state = { $regex: state, $options: 'i' };
    }

    if (area) {
      query.area = { $regex: area, $options: 'i' };
    }

    if (pincode) {
      query.pincode = pincode;
    }

    if (available === 'true' || available === true || available === '1') {
      query.isAvailable = true;
    } else if (available === 'false' || available === false || available === '0') {
      query.isAvailable = false;
    }

    // Fetch the filtered set before pagination so radius filtering does not
    // discard valid records from a page before distance is evaluated.
    let donors = await User.find(query).select('-password -passwordResetToken -passwordResetExpires -passwordResetOtp -passwordResetOtpExpires -passwordResetOtpAttempts -passwordResetOtpChannel');

    // Filter by radius if coordinates provided
    if (latitude && longitude && radius) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      const rad = parseFloat(radius);

      if (Number.isFinite(lat) && Number.isFinite(lon) && Number.isFinite(rad)) {
        donors = donors.filter((donor) => {
          // Keep city/area-matched donors without coordinates visible. They
          // cannot be placed on the map, but are still valid search results.
          if (!donor.latitude || !donor.longitude) return true;
          return isWithinRadius(donor.latitude, donor.longitude, lat, lon, rad);
        });
      }
    }

    const total = donors.length;
    donors = donors.slice(skip, skip + pageLimit);

    return res.status(200).json({
      success: true,
      message: 'Donors found successfully',
      data: donors.map(toPrivacySafeDonor),
      pagination: {
        page: pageNumber,
        limit: pageLimit,
        total,
        pages: Math.ceil(total / pageLimit),
      },
    });
  } catch (error) {
    console.error('Search donors error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error searching donors',
    });
  }
};

/**
 * Get donor statistics
 * GET /api/donors/stats
 */
export const getDonorStats = async (req, res) => {
  try {
    const totalDonors = await User.countDocuments({
      role: 'DONOR',
      isActive: true,
    });

    const availableDonors = await User.countDocuments({
      role: 'DONOR',
      isAvailable: true,
      isActive: true,
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
      message: 'Donor statistics retrieved',
      data: {
        totalDonors,
        availableDonors,
        unavailableDonors: totalDonors - availableDonors,
        byBloodGroup: bloodGroupStats,
      },
    });
  } catch (error) {
    console.error('Get donor stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving statistics',
    });
  }
};

export default {
  getAllDonors,
  getDonorById,
  searchDonors,
  getDonorStats,
};
