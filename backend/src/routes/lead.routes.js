// Lead routes
const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const leadController = require('../controllers/lead.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const {
  handleValidationErrors,
  sanitizeBody,
  validatePagination,
} = require('../middleware/validation.middleware');
const {
  EMPLOYMENT_STATUS,
  IMPORT_COUNTRIES,
  BUDGET_RANGES,
  DELIVERY_TIMELINES,
  IMPORTATION_TYPES,
  LEAD_STATUS,
  CONTACT_STATUS,
} = require('../config/constants');

// ============================================================================
// VALIDATION RULES
// ============================================================================

const financingLeadValidation = [
  // Personal Information
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  
  // Employment Information
  body('employmentStatus')
    .isIn(EMPLOYMENT_STATUS)
    .withMessage(`Employment status must be one of: ${EMPLOYMENT_STATUS.join(', ')}`),
  
  // Financial Information
  body('annualIncome').optional().trim(),
  body('monthlyIncome').optional().trim(),
  
  // Authorization
  body('authorizeCredit')
    .isBoolean()
    .withMessage('Credit authorization must be true or false'),
  body('agreeToTerms')
    .isBoolean()
    .withMessage('Terms agreement must be true or false')
    .custom((value) => {
      if (!value) {
        throw new Error('You must agree to the terms and conditions');
      }
      return true;
    }),
  
  // Optional: Selected car
  body('selectedCarId').optional().isInt({ min: 1 }).withMessage('Invalid car ID'),
];

const importationLeadValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('desiredCar').trim().notEmpty().withMessage('Desired car is required'),
  body('preferredCountry')
    .isIn(IMPORT_COUNTRIES)
    .withMessage(`Country must be one of: ${IMPORT_COUNTRIES.join(', ')}`),
  body('budgetRange')
    .isIn(BUDGET_RANGES)
    .withMessage(`Budget range must be one of: ${BUDGET_RANGES.join(', ')}`),
  body('deliveryTimeline')
    .isIn(DELIVERY_TIMELINES)
    .withMessage(`Timeline must be one of: ${DELIVERY_TIMELINES.join(', ')}`),
  body('importationType')
    .isIn(IMPORTATION_TYPES)
    .withMessage(`Import type must be one of: ${IMPORTATION_TYPES.join(', ')}`),
];

const contactMessageValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
    .isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  body('phone').optional().trim(),
];

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
      const validStatuses = req.params.type === 'contact' 
        ? Object.values(CONTACT_STATUS)
        : Object.values(LEAD_STATUS);
      
      if (!validStatuses.includes(value)) {
        throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
      }
      return true;
    }),
];

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

/**
 * @route   POST /api/v1/leads/financing
 * @desc    Submit financing application
 * @access  Public
 */
router.post(
  '/financing',
  sanitizeBody,
  financingLeadValidation,
  handleValidationErrors,
  leadController.submitFinancingLead
);

/**
 * @route   POST /api/v1/leads/importation
 * @desc    Submit importation request
 * @access  Public
 */
router.post(
  '/importation',
  sanitizeBody,
  importationLeadValidation,
  handleValidationErrors,
  leadController.submitImportationLead
);

/**
 * @route   POST /api/v1/leads/contact
 * @desc    Submit contact message
 * @access  Public
 */
router.post(
  '/contact',
  sanitizeBody,
  contactMessageValidation,
  handleValidationErrors,
  leadController.submitContactMessage
);

module.exports = router;
