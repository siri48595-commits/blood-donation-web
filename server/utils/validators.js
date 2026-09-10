/**
 * Email validation
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Password validation
 * @param {string} password - Password to validate
 * @returns {boolean}
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Phone number validation
 * @param {string} phone - Phone to validate
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/[- ]/g, ''));
};

/**
 * Pincode validation
 * @param {string} pincode - Pincode to validate
 * @returns {boolean}
 */
export const isValidPincode = (pincode) => {
  const pincodeRegex = /^\d{5,6}$/;
  return pincodeRegex.test(pincode);
};

/**
 * Blood group validation
 * @param {string} bloodGroup - Blood group to validate
 * @returns {boolean}
 */
export const isValidBloodGroup = (bloodGroup) => {
  const validGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  return validGroups.includes(bloodGroup);
};

/**
 * User role validation
 * @param {string} role - Role to validate
 * @returns {boolean}
 */
export const isValidRole = (role) => {
  const validRoles = ['DONOR', 'RECIPIENT', 'ADMIN'];
  return validRoles.includes(role);
};

/**
 * Validate coordinate
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {boolean}
 */
export const isValidCoordinates = (latitude, longitude) => {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

/**
 * Validate urgency
 * @param {string} urgency - Urgency level
 * @returns {boolean}
 */
export const isValidUrgency = (urgency) => {
  const validUrgencies = ['NORMAL', 'URGENT', 'CRITICAL'];
  return validUrgencies.includes(urgency);
};

/**
 * Validate blood request status
 * @param {string} status - Request status
 * @returns {boolean}
 */
export const isValidBloodRequestStatus = (status) => {
  const validStatuses = ['PENDING', 'MATCHED', 'FULFILLED', 'CANCELLED'];
  return validStatuses.includes(status);
};

/**
 * Validate donation request status
 * @param {string} status - Request status
 * @returns {boolean}
 */
export const isValidDonationRequestStatus = (status) => {
  const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'];
  return validStatuses.includes(status);
};

export default {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidPincode,
  isValidBloodGroup,
  isValidRole,
  isValidCoordinates,
  isValidUrgency,
  isValidBloodRequestStatus,
  isValidDonationRequestStatus,
};
