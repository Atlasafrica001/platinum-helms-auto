// Utility helper functions

/**
 * Format success response
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {object} meta - Additional metadata (pagination, etc.)
 * @returns {object} Formatted response
 */
const successResponse = (data, message = 'Success', meta = null) => {
  const response = {
    success: true,
    message,
    data,
  };

  if (meta) {
    response.meta = meta;
  }

  return response;
};

/**
 * Format error response
 * @param {string} message - Error message
 * @param {*} errors - Error details
 * @returns {object} Formatted error response
 */
const errorResponse = (message = 'Error occurred', errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return response;
};

/**
 * Calculate pagination metadata
 * @param {number} total - Total number of records
 * @param {number} page - Current page
 * @param {number} limit - Records per page
 * @returns {object} Pagination metadata
 */
const getPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Build Prisma filter object from query parameters
 * @param {object} filters - Filter parameters
 * @returns {object} Prisma where clause
 */
const buildCarFilters = (filters) => {
  const where = {};

  // Text search (name, brand, model)
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { brand: { contains: filters.search, mode: 'insensitive' } },
      { model: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  // Brand filter
  if (filters.brand && filters.brand !== 'all') {
    where.brand = filters.brand;
  }

  // Model filter
  if (filters.model && filters.model !== 'all') {
    where.model = filters.model;
  }

  // Category filter
  if (filters.category && filters.category !== 'all') {
    where.category = filters.category;
  }

  // Year filter
  if (filters.year && filters.year !== 'all') {
    where.year = parseInt(filters.year);
  }

  // Condition filter
  if (filters.condition && filters.condition !== 'all') {
    where.condition = filters.condition;
  }

  // Transmission filter
  if (filters.transmission && filters.transmission !== 'all') {
    where.transmission = filters.transmission;
  }

  // Fuel type filter
  if (filters.fuelType && filters.fuelType !== 'all') {
    where.fuelType = filters.fuelType;
  }

  // Body type filter
  if (filters.bodyType && filters.bodyType !== 'all') {
    where.bodyType = filters.bodyType;
  }

  // Price range filter
  if (filters.minPrice || filters.maxPrice) {
    where.price = {};
    if (filters.minPrice) {
      where.price.gte = parseFloat(filters.minPrice);
    }
    if (filters.maxPrice) {
      where.price.lte = parseFloat(filters.maxPrice);
    }
  }

  // Mileage range filter
  if (filters.minMileage !== undefined || filters.maxMileage !== undefined) {
    where.mileage = {};
    if (filters.minMileage !== undefined) {
      where.mileage.gte = parseInt(filters.minMileage);
    }
    if (filters.maxMileage !== undefined) {
      where.mileage.lte = parseInt(filters.maxMileage);
    }
  }

  // Status filter (for admin)
  if (filters.status && filters.status !== 'all') {
    where.status = filters.status;
  }

  // Visibility filter (public listings only by default)
  if (filters.visibility !== undefined) {
    where.visibility = filters.visibility === 'true' || filters.visibility === true;
  } else if (!filters.includeHidden) {
    // Default: only show visible cars
    where.visibility = true;
    where.status = 'available';
  }

  return where;
};

/**
 * Build Prisma orderBy from sort parameter
 * @param {string} sortBy - Sort option
 * @returns {object} Prisma orderBy clause
 */
const buildCarSort = (sortBy) => {
  const { SORT_OPTIONS } = require('../config/constants');

  switch (sortBy) {
    case SORT_OPTIONS.PRICE_LOW:
      return { price: 'asc' };
    case SORT_OPTIONS.PRICE_HIGH:
      return { price: 'desc' };
    case SORT_OPTIONS.YEAR_NEW:
      return { year: 'desc' };
    case SORT_OPTIONS.YEAR_OLD:
      return { year: 'asc' };
    case SORT_OPTIONS.POPULAR:
      return { views: 'desc' };
    case SORT_OPTIONS.RECENT:
    default:
      return { createdAt: 'desc' };
  }
};

/**
 * Format car object for API response
 * @param {object} car - Car object from database
 * @returns {object} Formatted car object
 */
const formatCarResponse = (car) => {
  // Get primary image or first image
  const primaryImage = car.images?.find(img => img.isPrimary) || car.images?.[0];

  return {
    ...car,
    image: primaryImage?.url || null, // Single image for listing cards
    images: car.images || [], // Full image array for detail view
    price: parseFloat(car.price), // Convert Decimal to number
  };
};

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} Valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Nigerian phone number format
 * @param {string} phone - Phone number
 * @returns {boolean} Valid phone number
 */
const isValidNigerianPhone = (phone) => {
  // Accepts: +234XXXXXXXXXX or 0XXXXXXXXXX
  const phoneRegex = /^(\+234|0)[7-9][0-1]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Sleep utility for rate limiting or delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generate random string
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
const generateRandomString = (length = 32) => {
  return require('crypto').randomBytes(length).toString('hex');
};

/**
 * Truncate string to max length
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
const truncate = (str, maxLength = 100) => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

module.exports = {
  successResponse,
  errorResponse,
  getPaginationMeta,
  buildCarFilters,
  buildCarSort,
  formatCarResponse,
  isValidEmail,
  isValidNigerianPhone,
  sleep,
  generateRandomString,
  truncate,
};
