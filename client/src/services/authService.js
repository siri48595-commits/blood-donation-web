import api from './api.js';
import { API_ENDPOINTS } from '../utils/constants.js';

/**
 * Register new user
 */
export const authRegister = async (userData) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Login user
 */
export const authLogin = async (identifier, password) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      identifier,
      password,
    });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const resetPassword = async (token, password, confirmPassword) => {
  try {
    const response = await api.post('/auth/reset-password', {
      token,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const requestPhonePasswordReset = async (phone) => {
  try {
    const response = await api.post('/auth/forgot-password/phone', { phone });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const resetPasswordWithOtp = async (phone, otp, password, confirmPassword) => {
  try {
    const response = await api.post('/auth/reset-password/otp', {
      phone,
      otp,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Logout user
 */
export const authLogout = async () => {
  try {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return { success: true };
  } catch (error) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    throw error.response?.data || error;
  }
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Get auth token
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

export default {
  authRegister,
  authLogin,
  requestPasswordReset,
  resetPassword,
  requestPhonePasswordReset,
  resetPasswordWithOtp,
  authLogout,
  getCurrentUser,
  getAuthToken,
  isAuthenticated,
};
