/**
 * Middleware to check if user has an active session
 */
export const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: 'Authentication required. Please log in.',
  });
};

/**
 * Middleware for Role-Based Access Control (RBAC)
 * e.g. authorizeRoles('admin'), authorizeRoles('staff', 'admin')
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    if (!roles.includes(req.session.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access denied for role [${req.session.user.role}]. Required: [${roles.join(', ')}]`,
      });
    }

    next();
  };
};
