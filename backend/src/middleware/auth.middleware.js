// Authentication middleware using JWT
const jwt = require('jsonwebtoken');
const { STATUS } = require('../config/constants');
const { prisma } = require('../config/database');

/**
 * Verify JWT token and attach user to request
 * @middleware
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies?.platinum_auth_token;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists and is active
    const user = await prisma.adminUser.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      return res.status(STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'User no longer exists.',
      });
    }

    if (!user.isActive) {
      return res.status(STATUS.FORBIDDEN).json({
        success: false,
        message: 'Your account has been deactivated. Contact support.',
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid authentication token.',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication token has expired. Please log in again.',
      });
    }

    console.error('Authentication error:', error);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Authentication failed.',
    });
  }
};

/**
 * Check if user has required role
 * @param {string[]} allowedRoles - Array of allowed roles
 * @middleware
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(STATUS.FORBIDDEN).json({
        success: false,
        message: 'You do not have permission to perform this action.',
      });
    }

    next();
  };
};

/**
 * Optional authentication - attaches user if token exists but doesn't fail if missing
 * @middleware
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.platinum_auth_token;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.adminUser.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
        },
      });

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  optionalAuth,
};
