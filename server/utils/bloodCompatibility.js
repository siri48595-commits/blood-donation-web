// Blood group compatibility matrix
const bloodCompatibility = {
  'O+': {
    canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O+', 'O-'],
    type: 'Universal Donor (Positive)',
  },
  'O-': {
    canDonateTo: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    canReceiveFrom: ['O-'],
    type: 'Universal Donor (Negative)',
  },
  'A+': {
    canDonateTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    type: 'Positive',
  },
  'A-': {
    canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],
    canReceiveFrom: ['A-', 'O-'],
    type: 'Negative',
  },
  'B+': {
    canDonateTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    type: 'Positive',
  },
  'B-': {
    canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],
    canReceiveFrom: ['B-', 'O-'],
    type: 'Negative',
  },
  'AB+': {
    canDonateTo: ['AB+'],
    canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    type: 'Universal Recipient (Positive)',
  },
  'AB-': {
    canDonateTo: ['AB+', 'AB-'],
    canReceiveFrom: ['A-', 'B-', 'AB-', 'O-'],
    type: 'Universal Recipient (Negative)',
  },
};

/**
 * Check if donor blood group can donate to recipient blood group
 * @param {string} donorBlood - Donor's blood group
 * @param {string} recipientBlood - Recipient's blood group
 * @returns {boolean} - True if compatible
 */
export const isBloodCompatible = (donorBlood, recipientBlood) => {
  if (!bloodCompatibility[donorBlood] || !bloodCompatibility[recipientBlood]) {
    return false;
  }
  return bloodCompatibility[donorBlood].canDonateTo.includes(recipientBlood);
};

/**
 * Get blood compatibility info
 * @param {string} bloodGroup - Blood group
 * @returns {object} - Compatibility information
 */
export const getBloodInfo = (bloodGroup) => {
  return bloodCompatibility[bloodGroup] || null;
};

/**
 * Get all valid blood groups
 * @returns {array} - Array of blood groups
 */
export const getAllBloodGroups = () => {
  return Object.keys(bloodCompatibility);
};

export default bloodCompatibility;
