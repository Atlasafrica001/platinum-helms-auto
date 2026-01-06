// Stats controller - Dashboard statistics
const { STATUS } = require('../config/constants');
const { successResponse } = require('../utils/helpers');
const { catchAsync } = require('../middleware/error.middleware');
const statsService = require('../services/stats.service');

/**
 * Get dashboard statistics
 * @route GET /api/v1/admin/stats
 * @access Private (Admin)
 */
const getDashboardStats = catchAsync(async (req, res) => {
  const stats = await statsService.getDashboardStats();

  res.status(STATUS.OK).json(
    successResponse(stats, 'Statistics retrieved successfully')
  );
});

/**
 * Get cars by category
 * @route GET /api/v1/admin/stats/cars/category
 * @access Private (Admin)
 */
const getCarsByCategory = catchAsync(async (req, res) => {
  const stats = await statsService.getCarsByCategory();

  res.status(STATUS.OK).json(
    successResponse(stats, 'Category statistics retrieved successfully')
  );
});

/**
 * Get cars by condition
 * @route GET /api/v1/admin/stats/cars/condition
 * @access Private (Admin)
 */
const getCarsByCondition = catchAsync(async (req, res) => {
  const stats = await statsService.getCarsByCondition();

  res.status(STATUS.OK).json(
    successResponse(stats, 'Condition statistics retrieved successfully')
  );
});

/**
 * Get leads by status
 * @route GET /api/v1/admin/stats/leads/status
 * @access Private (Admin)
 */
const getLeadsByStatus = catchAsync(async (req, res) => {
  const stats = await statsService.getLeadsByStatus();

  res.status(STATUS.OK).json(
    successResponse(stats, 'Lead statistics retrieved successfully')
  );
});

/**
 * Get recent activity
 * @route GET /api/v1/admin/stats/activity
 * @access Private (Admin)
 */
const getRecentActivity = catchAsync(async (req, res) => {
  const activity = await statsService.getRecentActivity();

  res.status(STATUS.OK).json(
    successResponse(activity, 'Recent activity retrieved successfully')
  );
});

module.exports = {
  getDashboardStats,
  getCarsByCategory,
  getCarsByCondition,
  getLeadsByStatus,
  getRecentActivity,
};
