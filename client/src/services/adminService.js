import api from './api.js';
import { API_ENDPOINTS } from '../utils/constants.js';

export const getAdminDashboard = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.ADMIN.DASHBOARD);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default { getAdminDashboard };
