// Admin lead routes
const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const leadController = require('../controllers/lead.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const {
  handleValidationErrors,
  sanitizeBody,
  validatePagination,
} = require('../middleware/validation.middleware');
const { LEAD_STATUS, CONTACT_STATUS } = require('../config/constants');

// ============================================================================
// VALIDATION RULES
// ============================================================================

const leadTypeValidation = [
  param('type')
    .isIn(['financing', 'importation', 'contact'])
    .withMessage('Type must be financing, importation, or contact'),
];

const statusUpdateValidation = [
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .custom((value, { req }) => {
      const validStatuses =
        req.params.type === 'contact'
          ? Object.values(CONTACT_STATUS)
          : Object.values(LEAD_STATUS);

      if (!validStatuses.includes(value)) {
        throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
      }
      return true;
    }),
];

// ============================================================================
// ADMIN LEAD ROUTES (All protected)
// ============================================================================

/**
 * @route   GET /api/v1/admin/leads
 * @desc    Get all leads
 * @query   type: financing | importation | contact | all
 * @query   status: pending | contacted | closed | etc
 * @query   search: search term
 * @access  Private (Admin)
 */
router.get('/', authenticateToken, validatePagination, leadController.getLeads);

/**
 * @route   GET /api/v1/admin/leads/:type/:id
 * @desc    Get single lead by ID
 * @access  Private (Admin)
 */
router.get(
  '/:type/:id',
  authenticateToken,
  leadTypeValidation,
  param('id').isInt({ min: 1 }).withMessage('Invalid lead ID'),
  handleValidationErrors,
  leadController.getLeadById
);

/**
 * @route   PATCH /api/v1/admin/leads/:type/:id
 * @desc    Update lead status
 * @access  Private (Admin)
 */
router.patch(
  '/:type/:id',
  authenticateToken,
  sanitizeBody,
  leadTypeValidation,
  param('id').isInt({ min: 1 }).withMessage('Invalid lead ID'),
  statusUpdateValidation,
  handleValidationErrors,
  leadController.updateLeadStatus
);

/**
 * @route   DELETE /api/v1/admin/leads/:type/:id
 * @desc    Delete lead
 * @access  Private (Admin)
 */
router.delete(
  '/:type/:id',
  authenticateToken,
  leadTypeValidation,
  param('id').isInt({ min: 1 }).withMessage('Invalid lead ID'),
  handleValidationErrors,
  leadController.deleteLead
);

module.exports = router;
