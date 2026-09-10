import api from './api.js';
import { API_ENDPOINTS } from '../utils/constants.js';

/**
 * Chat with AI
 */
export const chatWithAI = async (message, conversationId = null) => {
  try {
    const response = await api.post(API_ENDPOINTS.AI.CHAT, {
      message,
      conversationId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get AI-matched donors
 */
export const getAIMatchedDonors = async (bloodRequestId) => {
  try {
    const response = await api.post(API_ENDPOINTS.AI.MATCH_DONORS, {
      bloodRequestId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get chat history
 */
export const getChatHistory = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/chat/history', {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Clear chat conversation
 */
export const clearChatConversation = async (conversationId) => {
  try {
    const response = await api.delete(`/chat/history/${conversationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  chatWithAI,
  getAIMatchedDonors,
  getChatHistory,
  clearChatConversation,
};
