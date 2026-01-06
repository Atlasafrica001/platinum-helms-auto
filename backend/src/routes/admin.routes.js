// Admin authentication routes
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controllers/admin.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const {
  handleValidationErrors,
  sanitizeBody,
} = require('../middleware/validation.middleware');
const { validatePasswordStrength } = require('../services/auth.service');

// ============================================================================
// VALIDATION RULES
// ============================================================================

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const changePasswordValidation = [
  body('currentPassword')
    .trim()
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .custom((value) => {
      const validation = validatePasswordStrength(value);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
      return true;
    }),
  body('confirmPassword')
    .trim()
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match');
      }
      return true;
    }),
];

// ============================================================================
// ROUTES
// ============================================================================

/**
 * @route   POST /api/v1/admin/login
 * @desc    Admin login
 * @access  Public
 */
router.post(
  '/login',
  sanitizeBody,
  loginValidation,
  handleValidationErrors,
  adminController.login
);

/**
 * @route   POST /api/v1/admin/logout
 * @desc    Admin logout
 * @access  Private
 */
router.post('/logout', authenticateToken, adminController.logout);

/**
 * @route   GET /api/v1/admin/me
 * @desc    Get current admin user
 * @access  Private
 */
router.get('/me', authenticateToken, adminController.getCurrentUser);

/**
 * @route   PUT /api/v1/admin/password
 * @desc    Change password
 * @access  Private
 */
router.put(
  '/password',
  authenticateToken,
  sanitizeBody,
  changePasswordValidation,
  handleValidationErrors,
  adminController.changePassword
);

module.exports = router;
