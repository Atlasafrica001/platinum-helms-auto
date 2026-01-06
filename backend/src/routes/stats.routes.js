// Stats routes - Dashboard statistics
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All stats routes require authentication

/**
 * @route   GET /api/v1/admin/stats
 * @desc    Get dashboard statistics
 * @access  Private (Admin)
 */
router.get('/', authenticateToken, statsController.getDashboardStats);

/**
 * @route   GET /api/v1/admin/stats/cars/category
 * @desc    Get car statistics by category
 * @access  Private (Admin)
 */
router.get('/cars/category', authenticateToken, statsController.getCarsByCategory);

/**
 * @route   GET /api/v1/admin/stats/cars/condition
 * @desc    Get car statistics by condition
 * @access  Private (Admin)
 */
router.get('/cars/condition', authenticateToken, statsController.getCarsByCondition);

/**
 * @route   GET /api/v1/admin/stats/leads/status
 * @desc    Get lead statistics by status
 * @access  Private (Admin)
 */
router.get('/leads/status', authenticateToken, statsController.getLeadsByStatus);

/**
 * @route   GET /api/v1/admin/stats/activity
 * @desc    Get recent activity (last 30 days)
 * @access  Private (Admin)
 */
router.get('/activity', authenticateToken, statsController.getRecentActivity);

module.exports = router;
