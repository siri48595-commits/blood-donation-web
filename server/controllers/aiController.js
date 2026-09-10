import {
  sendToGroq,
  generateDonorMatchingExplanation,
  getAIAssistantResponse,
} from '../services/groqService.js';
import { findMatchingDonors, getMatchingStatistics } from '../services/donorMatchingService.js';
import BloodRequest from '../models/BloodRequest.js';
import User from '../models/User.js';

/**
 * Chat with AI assistant
 * POST /api/ai/chat
 */
export const chatWithAI = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message',
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get AI response
    const aiResponse = await getAIAssistantResponse(message, user.role);

    if (!aiResponse.success) {
      return res.status(500).json({
        success: false,
        message: 'Error getting AI response',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'AI response retrieved',
      data: {
        userMessage: message,
        aiResponse: aiResponse.message,
        conversationId: conversationId || new Date().getTime().toString(),
      },
    });
  } catch (error) {
    console.error('Chat with AI error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error communicating with AI',
    });
  }
};

/**
 * Get AI-assisted donor matching
 * POST /api/ai/match-donors
 */
export const matchDonorsWithAI = async (req, res) => {
  try {
    const { bloodRequestId } = req.body;

    if (!bloodRequestId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide blood request ID',
      });
    }

    // Get blood request
    const bloodRequest = await BloodRequest.findById(bloodRequestId);
    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found',
      });
    }

    // Only requester or admin can access
    if (
      req.userId !== bloodRequest.requesterId.toString() &&
      req.user?.role !== 'ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this request',
      });
    }

    // Find matching donors using deterministic algorithm
    const matchedDonors = await findMatchingDonors(bloodRequest, 10);

    if (matchedDonors.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No suitable donors found at this time',
        data: {
          donors: [],
          statistics: {
            totalMatches: 0,
            availableCount: 0,
            averageScore: 0,
          },
          aiExplanation: {
            message: 'No suitable donors found at this time. Please try again later or contact your nearest blood bank.',
            recommendations: [],
            disclaimer: 'For emergency situations, please contact your nearest blood bank or hospital immediately.',
          },
        },
      });
    }

    // Get AI explanation for the matching
    const aiExplanation = await generateDonorMatchingExplanation(
      matchedDonors.map((d) => ({
        name: d.name,
        bloodGroup: d.bloodGroup,
        isAvailable: d.isAvailable,
        city: d.city,
        state: d.state,
        lastDonationDate: d.lastDonationDate,
      })),
      bloodRequest
    );

    // Get statistics
    const statistics = getMatchingStatistics(matchedDonors);

    // Format donor response (hide sensitive info)
    const formattedDonors = matchedDonors.map((donor) => ({
      id: donor._id,
      name: donor.name,
      bloodGroup: donor.bloodGroup,
      city: donor.city,
      state: donor.state,
      area: donor.area,
      isAvailable: donor.isAvailable,
      distance: donor.distance,
      matchScore: donor.matchScore,
      lastDonationDate: donor.lastDonationDate,
    }));

    return res.status(200).json({
      success: true,
      message: 'Donors matched with AI assistance',
      data: {
        donors: formattedDonors,
        statistics,
        aiExplanation,
      },
    });
  } catch (error) {
    console.error('Match donors with AI error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error matching donors',
    });
  }
};

/**
 * Get chat history
 * GET /api/chat/history
 */
export const getChatHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Note: In a production app, you would store chat history in database
    // For now, returning a message indicating feature is available

    return res.status(200).json({
      success: true,
      message: 'Chat history retrieved (feature available on frontend)',
      data: {
        conversations: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0,
        },
      },
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving chat history',
    });
  }
};

/**
 * Clear chat history
 * DELETE /api/chat/history/:conversationId
 */
export const clearChatHistory = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Chat history cleared successfully',
    });
  } catch (error) {
    console.error('Clear chat history error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error clearing chat history',
    });
  }
};

export default {
  chatWithAI,
  matchDonorsWithAI,
  getChatHistory,
  clearChatHistory,
};
