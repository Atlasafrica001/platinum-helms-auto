// Validation middleware using express-validator
const { validationResult } = require('express-validator');
const { STATUS } = require('../config/constants');

/**
 * Handle validation errors from express-validator
 * @middleware
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
    }));

    return res.status(STATUS.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  next();
};

/**
 * Sanitize request body by removing undefined and null values
 * @middleware
 */
const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      if (req.body[key] === undefined || req.body[key] === null || req.body[key] === '') {
        delete req.body[key];
      }
      
      // Trim strings
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }

  next();
};

/**
 * Validate pagination parameters
 * @middleware
 */
const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;
  const { PAGINATION } = require('../config/constants');

  // Parse and validate page
  req.pagination = {
    page: parseInt(page) || PAGINATION.DEFAULT_PAGE,
    limit: parseInt(limit) || PAGINATION.DEFAULT_LIMIT,
  };

  // Ensure valid ranges
  if (req.pagination.page < 1) {
    req.pagination.page = 1;
  }

  if (req.pagination.limit < 1) {
    req.pagination.limit = PAGINATION.DEFAULT_LIMIT;
  }

  if (req.pagination.limit > PAGINATION.MAX_LIMIT) {
    req.pagination.limit = PAGINATION.MAX_LIMIT;
  }

  // Calculate skip
  req.pagination.skip = (req.pagination.page - 1) * req.pagination.limit;

  next();
};

/**
 * Whitelist allowed fields in request body
 * @param {string[]} allowedFields - Array of allowed field names
 * @middleware
 */
const whitelistFields = (allowedFields) => {
  return (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
      const sanitized = {};
      
      allowedFields.forEach(field => {
        if (req.body.hasOwnProperty(field)) {
          sanitized[field] = req.body[field];
        }
      });

      req.body = sanitized;
    }

    next();
  };
};

module.exports = {
  handleValidationErrors,
  sanitizeBody,
  validatePagination,
  whitelistFields,
};
