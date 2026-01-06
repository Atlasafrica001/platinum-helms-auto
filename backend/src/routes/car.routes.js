// Car routes
const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const carController = require('../controllers/car.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const {
  handleValidationErrors,
  sanitizeBody,
  validatePagination,
} = require('../middleware/validation.middleware');
const {
  upload,
  handleUploadErrors,
  validateFilesUploaded,
} = require('../middleware/upload.middleware');
const {
  CAR_CATEGORIES,
  CAR_CONDITIONS,
  BODY_TYPES,
  TRANSMISSION_TYPES,
  FUEL_TYPES,
  CAR_STATUS,
} = require('../config/constants');

// ============================================================================
// VALIDATION RULES
// ============================================================================

const idValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid car ID'),
];

const createCarValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Car name is required')
    .isLength({ max: 200 })
    .withMessage('Name must be less than 200 characters'),
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required'),
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Model is required'),
  body('year')
    .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
    .withMessage('Year must be between 1990 and next year'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn(CAR_CATEGORIES)
    .withMessage(`Category must be one of: ${CAR_CATEGORIES.join(', ')}`),
  body('bodyType')
    .isIn(BODY_TYPES)
    .withMessage(`Body type must be one of: ${BODY_TYPES.join(', ')}`),
  body('condition')
    .isIn(CAR_CONDITIONS)
    .withMessage(`Condition must be one of: ${CAR_CONDITIONS.join(', ')}`),
  body('transmission')
    .isIn(TRANSMISSION_TYPES)
    .withMessage(`Transmission must be one of: ${TRANSMISSION_TYPES.join(', ')}`),
  body('fuelType')
    .isIn(FUEL_TYPES)
    .withMessage(`Fuel type must be one of: ${FUEL_TYPES.join(', ')}`),
  body('mileage')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Mileage must be a positive number'),
  body('vin')
    .optional()
    .trim()
    .isLength({ min: 17, max: 17 })
    .withMessage('VIN must be exactly 17 characters'),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
];

const updateCarValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Name must be less than 200 characters'),
  body('year')
    .optional()
    .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
    .withMessage('Year must be between 1990 and next year'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .optional()
    .isIn(CAR_CATEGORIES)
    .withMessage(`Category must be one of: ${CAR_CATEGORIES.join(', ')}`),
  body('bodyType')
    .optional()
    .isIn(BODY_TYPES)
    .withMessage(`Body type must be one of: ${BODY_TYPES.join(', ')}`),
  body('condition')
    .optional()
    .isIn(CAR_CONDITIONS)
    .withMessage(`Condition must be one of: ${CAR_CONDITIONS.join(', ')}`),
  body('transmission')
    .optional()
    .isIn(TRANSMISSION_TYPES)
    .withMessage(`Transmission must be one of: ${TRANSMISSION_TYPES.join(', ')}`),
  body('fuelType')
    .optional()
    .isIn(FUEL_TYPES)
    .withMessage(`Fuel type must be one of: ${FUEL_TYPES.join(', ')}`),
  body('status')
    .optional()
    .isIn(Object.values(CAR_STATUS))
    .withMessage(`Status must be one of: ${Object.values(CAR_STATUS).join(', ')}`),
  body('visibility')
    .optional()
    .isBoolean()
    .withMessage('Visibility must be a boolean'),
  body('mileage')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Mileage must be a positive number'),
];

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

/**
 * @route   GET /api/v1/cars
 * @desc    Get all visible cars with filters
 * @access  Public
 */
router.get(
  '/',
  validatePagination,
  carController.getCars
);

/**
 * @route   GET /api/v1/cars/brands
 * @desc    Get all brands
 * @access  Public
 */
router.get(
  '/brands',
  carController.getBrands
);

/**
 * @route   GET /api/v1/cars/brands/:brand/models
 * @desc    Get models for a brand
 * @access  Public
 */
router.get(
  '/brands/:brand/models',
  carController.getModelsByBrand
);

/**
 * @route   GET /api/v1/cars/price-range
 * @desc    Get min/max price range
 * @access  Public
 */
router.get(
  '/price-range',
  carController.getPriceRange
);

/**
 * @route   GET /api/v1/cars/:id
 * @desc    Get single car by ID
 * @access  Public
 */
router.get(
  '/:id',
  idValidation,
  handleValidationErrors,
  carController.getCarById
);

/**
 * @route   POST /api/v1/cars/:id/view
 * @desc    Increment car view count
 * @access  Public
 */
router.post(
  '/:id/view',
  idValidation,
  handleValidationErrors,
  carController.incrementViews
);

module.exports = router;
