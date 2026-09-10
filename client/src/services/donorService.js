import api from './api.js';
import { API_ENDPOINTS } from '../utils/constants.js';

/**
 * Get all donors
 */
export const getAllDonors = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(API_ENDPOINTS.DONORS.LIST, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get donor by ID
 */
export const getDonorById = async (id) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.DONORS.LIST}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Search donors with filters
 */
export const searchDonors = async (filters) => {
  try {
    const response = await api.get(API_ENDPOINTS.DONORS.SEARCH, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get donor statistics
 */
export const getDonorStats = async () => {
  try {
    const response = await api.get(`${API_ENDPOINTS.DONORS.LIST}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getAllDonors,
  getDonorById,
  searchDonors,
  getDonorStats,
};
