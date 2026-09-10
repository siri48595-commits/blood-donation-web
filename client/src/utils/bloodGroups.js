// Blood group compatibility information
export const bloodGroupInfo = {
  'O+': {
    canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O+', 'O-'],
    description: 'Universal Donor (Positive)',
  },
  'O-': {
    canDonateTo: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    canReceiveFrom: ['O-'],
    description: 'Universal Donor (Negative)',
  },
  'A+': {
    canDonateTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    description: 'Positive',
  },
  'A-': {
    canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],
    canReceiveFrom: ['A-', 'O-'],
    description: 'Negative',
  },
  'B+': {
    canDonateTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    description: 'Positive',
  },
  'B-': {
    canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],
    canReceiveFrom: ['B-', 'O-'],
    description: 'Negative',
  },
  'AB+': {
    canDonateTo: ['AB+'],
    canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    description: 'Universal Recipient (Positive)',
  },
  'AB-': {
    canDonateTo: ['AB+', 'AB-'],
    canReceiveFrom: ['A-', 'B-', 'AB-', 'O-'],
    description: 'Universal Recipient (Negative)',
  },
};

/**
 * Check if blood group is compatible
 * @param {string} donorBlood - Donor blood group
 * @param {string} recipientBlood - Recipient blood group
 * @returns {boolean}
 */
export const isCompatible = (donorBlood, recipientBlood) => {
  return (
    bloodGroupInfo[donorBlood] &&
    bloodGroupInfo[donorBlood].canDonateTo.includes(recipientBlood)
  );
};

export default { bloodGroupInfo, isCompatible };
