import User from '../models/User.js';
import { isBloodCompatible } from '../utils/bloodCompatibility.js';
import { calculateDistance } from '../utils/distanceService.js';

/**
 * Calculate matching score for a donor
 * @param {object} donor - Donor object
 * @param {object} bloodRequest - Blood request object
 * @returns {number} - Matching score (0-100)
 */
const calculateMatchingScore = (donor, bloodRequest) => {
  let score = 0;

  // 1. Blood group compatibility (30 points)
  if (isBloodCompatible(donor.bloodGroup, bloodRequest.bloodGroup)) {
    score += 30;
  } else {
    return 0; // Not compatible, no match
  }

  // 2. Availability (25 points)
  if (donor.isAvailable) {
    score += 25;
  } else {
    score += 10; // Partial credit if not currently available
  }

  // 3. Location proximity (20 points)
  if (
    donor.latitude &&
    donor.longitude &&
    bloodRequest.latitude &&
    bloodRequest.longitude
  ) {
    const distance = calculateDistance(
      donor.latitude,
      donor.longitude,
      bloodRequest.latitude,
      bloodRequest.longitude
    );

    if (distance <= 5) {
      score += 20;
    } else if (distance <= 15) {
      score += 15;
    } else if (distance <= 30) {
      score += 10;
    } else if (distance <= 50) {
      score += 5;
    }
  } else if (donor.city === bloodRequest.city) {
    // City-level matching if coordinates not available
    score += 15;
  } else if (donor.state === bloodRequest.state) {
    score += 5;
  }

  // 4. Last donation date (15 points)
  if (donor.lastDonationDate) {
    const daysSinceDonation = Math.floor(
      (Date.now() - donor.lastDonationDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Minimum 56 days between donations is ideal
    if (daysSinceDonation >= 56 && daysSinceDonation <= 365) {
      score += 15;
    } else if (daysSinceDonation > 365) {
      score += 12;
    } else if (daysSinceDonation >= 30) {
      score += 5;
    }
  } else {
    // New donor gets some credit
    score += 10;
  }

  // 5. Account activity (10 points)
  if (donor.isActive) {
    score += 10;
  }

  return Math.min(score, 100); // Cap at 100
};

/**
 * Find and rank matching donors for a blood request
 * @param {object} bloodRequest - Blood request object
 * @param {number} limit - Number of results to return
 * @returns {promise} - Array of matched donors with scores
 */
export const findMatchingDonors = async (bloodRequest, limit = 5) => {
  try {
    // Query donors with filters
    const query = {
      role: 'DONOR',
      isActive: true,
      bloodGroup: {
        $in: getDonorBloodGroupsFor(bloodRequest.bloodGroup),
      },
    };

    // Add location filter if city is specified
    if (bloodRequest.city) {
      query.$or = [
        { city: bloodRequest.city },
        { state: bloodRequest.state },
      ];
    }

    const donors = await User.find(query).select(
      'name email phone bloodGroup city state area pincode latitude longitude isAvailable lastDonationDate isActive'
    );

    // Calculate matching scores
    const scoredDonors = donors
      .map((donor) => ({
        ...donor.toObject(),
        matchScore: calculateMatchingScore(donor, bloodRequest),
        distance:
          donor.latitude && donor.longitude && bloodRequest.latitude && bloodRequest.longitude
            ? calculateDistance(
                donor.latitude,
                donor.longitude,
                bloodRequest.latitude,
                bloodRequest.longitude
              )
            : null,
      }))
      .filter((donor) => donor.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    return scoredDonors;
  } catch (error) {
    console.error('Error finding matching donors:', error);
    return [];
  }
};

/**
 * Get compatible blood groups for donation
 * @param {string} recipientBloodGroup - Recipient blood group
 * @returns {array} - Array of compatible donor blood groups
 */
const getDonorBloodGroupsFor = (recipientBloodGroup) => {
  const compatibility = {
    'O+': ['O+', 'O-'],
    'O-': ['O-'],
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
  };

  return compatibility[recipientBloodGroup] || [];
};

/**
 * Calculate matching statistics
 * @param {array} matchedDonors - Array of matched donors
 * @returns {object} - Statistics
 */
export const getMatchingStatistics = (matchedDonors) => {
  if (!Array.isArray(matchedDonors) || matchedDonors.length === 0) {
    return {
      totalMatches: 0,
      availableCount: 0,
      averageScore: 0,
      highScoreCount: 0,
    };
  }

  const availableCount = matchedDonors.filter((d) => d.isAvailable).length;
  const averageScore =
    matchedDonors.reduce((sum, d) => sum + d.matchScore, 0) / matchedDonors.length;
  const highScoreCount = matchedDonors.filter((d) => d.matchScore >= 70).length;

  return {
    totalMatches: matchedDonors.length,
    availableCount,
    averageScore: Math.round(averageScore),
    highScoreCount,
  };
};

export default {
  findMatchingDonors,
  getMatchingStatistics,
};
