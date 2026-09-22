// Blood group constants
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// User roles
export const USER_ROLES = {
  DONOR: 'DONOR',
  RECIPIENT: 'RECIPIENT',
  ADMIN: 'ADMIN',
};

// Blood request status
export const BLOOD_REQUEST_STATUS = {
  PENDING: 'PENDING',
  MATCHED: 'MATCHED',
  FULFILLED: 'FULFILLED',
  CANCELLED: 'CANCELLED',
};

// Urgency levels
export const URGENCY_LEVELS = {
  NORMAL: 'NORMAL',
  URGENT: 'URGENT',
  CRITICAL: 'CRITICAL',
};

// Donation request status
export const DONATION_REQUEST_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

// Gender options
export const GENDERS = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    PROFILE: '/user/profile',
    AVAILABILITY: '/user/availability',
  },
  DONORS: {
    LIST: '/donors',
    SEARCH: '/donors/search',
    STATS: '/donors/stats',
  },
  REQUESTS: {
    CREATE: '/requests',
    LIST: '/requests',
    MY_REQUESTS: '/requests/user/my-requests',
  },
  DONATION_REQUESTS: {
    CREATE: '/donation-requests',
    LIST: '/donation-requests',
  },
  AI: {
    CHAT: '/ai/chat',
    MATCH_DONORS: '/ai/match-donors',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
  },
};

export default {
  BLOOD_GROUPS,
  USER_ROLES,
  BLOOD_REQUEST_STATUS,
  URGENCY_LEVELS,
  DONATION_REQUEST_STATUS,
  GENDERS,
  API_ENDPOINTS,
};
