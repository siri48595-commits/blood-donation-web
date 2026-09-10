import api from './api.js';
import { API_ENDPOINTS } from '../utils/constants.js';

/**
 * Create blood request
 */
export const createBloodRequest = async (requestData) => {
  try {
    const response = await api.post(API_ENDPOINTS.REQUESTS.CREATE, requestData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get all blood requests
 */
export const getAllBloodRequests = async (page = 1, limit = 10, status = null) => {
  try {
    const response = await api.get(API_ENDPOINTS.REQUESTS.LIST, {
      params: { page, limit, status },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get my blood requests
 */
export const getMyBloodRequests = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(API_ENDPOINTS.REQUESTS.MY_REQUESTS, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get blood request by ID
 */
export const getBloodRequestById = async (id) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.REQUESTS.LIST}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update blood request
 */
export const updateBloodRequest = async (id, updateData) => {
  try {
    const response = await api.put(
      `${API_ENDPOINTS.REQUESTS.LIST}/${id}`,
      updateData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete blood request
 */
export const deleteBloodRequest = async (id) => {
  try {
    const response = await api.delete(`${API_ENDPOINTS.REQUESTS.LIST}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create donation request
 */
export const createDonationRequest = async (donationData) => {
  try {
    const response = await api.post(
      API_ENDPOINTS.DONATION_REQUESTS.CREATE,
      donationData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get all donation requests
 */
export const getAllDonationRequests = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(API_ENDPOINTS.DONATION_REQUESTS.LIST, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update donation request
 */
export const updateDonationRequest = async (id, updateData) => {
  try {
    const response = await api.put(
      `${API_ENDPOINTS.DONATION_REQUESTS.LIST}/${id}`,
      updateData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getDonorRequests = async (donorId) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.DONATION_REQUESTS.LIST}/donor/${donorId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getRecipientRequests = async (recipientId) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.DONATION_REQUESTS.LIST}/recipient/${recipientId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  createBloodRequest,
  getAllBloodRequests,
  getMyBloodRequests,
  getBloodRequestById,
  updateBloodRequest,
  deleteBloodRequest,
  createDonationRequest,
  getAllDonationRequests,
  updateDonationRequest,
  getDonorRequests,
  getRecipientRequests,
};
