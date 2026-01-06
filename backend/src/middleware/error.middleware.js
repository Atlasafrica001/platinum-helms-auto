// Global error handling middleware
const { STATUS } = require('../config/constants');

/**
 * Custom error class for application errors
 */
class AppError extends Error {
  constructor(message, statusCode = STATUS.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle Prisma errors
 */
const handlePrismaError = (error) => {
  // P2002: Unique constraint violation
  if (error.code === 'P2002') {
    const field = error.meta?.target?.[0] || 'field';
    return new AppError(
      `A record with this ${field} already exists.`,
      STATUS.CONFLICT
    );
  }

  // P2025: Record not found
  if (error.code === 'P2025') {
    return new AppError('Record not found.', STATUS.NOT_FOUND);
  }

  // P2003: Foreign key constraint failed
  if (error.code === 'P2003') {
    return new AppError(
      'Referenced record does not exist.',
      STATUS.BAD_REQUEST
    );
  }

  // Generic Prisma error
  return new AppError('Database operation failed.', STATUS.INTERNAL_SERVER_ERROR);
};

/**
 * Development error response (detailed)
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: err.message,
    stack: err.stack,
    details: err,
  });
};

/**
 * Production error response (minimal)
 */
const sendErrorProd = (err, res) => {
  // Operational errors: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else {
    // Programming or unknown errors: don't leak details
    console.error('ERROR 💥', err);
    
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

/**
 * Global error handling middleware
 * @middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || STATUS.INTERNAL_SERVER_ERROR;

  // Handle specific error types
  if (err.name === 'PrismaClientKnownRequestError') {
    err = handlePrismaError(err);
  }

  if (err.name === 'ValidationError') {
    err = new AppError(err.message, STATUS.BAD_REQUEST);
  }

  if (err.name === 'JsonWebTokenError') {
    err = new AppError('Invalid token.', STATUS.UNAUTHORIZED);
  }

  if (err.name === 'TokenExpiredError') {
    err = new AppError('Token expired.', STATUS.UNAUTHORIZED);
  }

  // Send error response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};

/**
 * Handle 404 not found errors
 * @middleware
 */
const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Cannot ${req.method} ${req.originalUrl}`,
    STATUS.NOT_FOUND
  );
  next(error);
};

/**
 * Async error wrapper to catch errors in async route handlers
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  AppError,
  errorHandler,
  notFoundHandler,
  catchAsync,
};
