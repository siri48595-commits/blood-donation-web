import api from './api.js';
import { API_ENDPOINTS } from '../utils/constants.js';

export const getProfile = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.USER.PROFILE);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put(API_ENDPOINTS.USER.PROFILE, profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateAvailability = async (isAvailable) => {
  try {
    const response = await api.put(API_ENDPOINTS.USER.AVAILABILITY, { isAvailable });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default { getProfile, updateProfile, updateAvailability };
