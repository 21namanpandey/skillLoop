/**
 * Helper function to consistently get ID from objects
 * Handles both _id and id fields
 */
export const getId = (obj) => {
  if (!obj) return null;
  if (typeof obj === 'string') return obj;
  return obj._id || obj.id || null;
};

/**
 * Compare two IDs consistently (string comparison)
 */
export const compareIds = (id1, id2) => {
  if (!id1 || !id2) return false;
  return String(id1) === String(id2);
};

/**
 * Normalize user object with consistent ID
 */
export const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    id: user._id || user.id
  };
};

/**
 * Safe array includes check for IDs
 */
export const includesId = (array, id) => {
  if (!array || !id) return false;
  return array.some(item => compareIds(getId(item), id));
};

/**
 * Filter array by ID
 */
export const filterById = (array, id) => {
  if (!array) return [];
  return array.filter(item => compareIds(getId(item), id));
};