import User from '../models/User.js';

/**
 * Role-based authorization middleware
 * @param {array} roles - Allowed roles
 * @returns {function} - Middleware function
 */
export const roleMiddleware = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const normalizedUserRole = typeof user.role === 'string' ? user.role.toUpperCase() : null;
      const normalizedAllowedRoles = roles.map((role) => role.toUpperCase());

      if (!normalizedUserRole) {
        return res.status(403).json({
          success: false,
          message: 'Your account role is not configured. Contact support.',
        });
      }

      if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to access this route',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  };
};

export default roleMiddleware;
