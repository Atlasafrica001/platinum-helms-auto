// Admin authentication controller
const { prisma } = require('../config/database');
const { STATUS, JWT } = require('../config/constants');
const {
  comparePassword,
  createTokenResponse,
  sanitizeUser,
} = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/helpers');
const { catchAsync, AppError } = require('../middleware/error.middleware');

/**
 * Admin login
 * @route POST /api/v1/admin/login
 * @access Public
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Find admin user
  const admin = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!admin) {
    throw new AppError('Invalid email or password', STATUS.UNAUTHORIZED);
  }

  // Check if account is active
  if (!admin.isActive) {
    throw new AppError(
      'Your account has been deactivated. Contact support.',
      STATUS.FORBIDDEN
    );
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, admin.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', STATUS.UNAUTHORIZED);
  }

  // Update last login timestamp
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLogin: new Date() },
  });

  // Generate token
  const { token, cookieOptions } = createTokenResponse(admin);

  // Set cookie
  res.cookie(JWT.COOKIE_NAME, token, cookieOptions);

  // Send response
  res.status(STATUS.OK).json(
    successResponse(
      {
        user: sanitizeUser(admin),
        token, // Also send in body for mobile/Postman
      },
      'Login successful'
    )
  );
});

/**
 * Admin logout
 * @route POST /api/v1/admin/logout
 * @access Private
 */
const logout = catchAsync(async (req, res) => {
  // Clear cookie
  res.clearCookie(JWT.COOKIE_NAME);

  res.status(STATUS.OK).json(successResponse(null, 'Logout successful'));
});

/**
 * Get current authenticated admin user
 * @route GET /api/v1/admin/me
 * @access Private
 */
const getCurrentUser = catchAsync(async (req, res) => {
  // User is already attached by auth middleware
  const user = await prisma.adminUser.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true,
      lastLogin: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', STATUS.NOT_FOUND);
  }

  res.status(STATUS.OK).json(successResponse(user, 'User retrieved successfully'));
});

/**
 * Change password
 * @route PUT /api/v1/admin/password
 * @access Private
 */
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await prisma.adminUser.findUnique({
    where: { id: req.user.id },
  });

  // Verify current password
  const isPasswordValid = await comparePassword(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', STATUS.UNAUTHORIZED);
  }

  // Hash new password
  const { hashPassword } = require('../services/auth.service');
  const hashedPassword = await hashPassword(newPassword);

  // Update password
  await prisma.adminUser.update({
    where: { id: req.user.id },
    data: { password: hashedPassword },
  });

  res.status(STATUS.OK).json(
    successResponse(null, 'Password changed successfully')
  );
});

module.exports = {
  login,
  logout,
  getCurrentUser,
  changePassword,
};
