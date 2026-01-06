// API Routes Index
// This file aggregates all API routes
const express = require('express');
const router = express.Router();

// ============================================================================
// IMPORT ROUTE MODULES
// ============================================================================

const carRoutes = require('./car.routes');
const leadRoutes = require('./lead.routes');
const adminRoutes = require('./admin.routes');
const adminCarRoutes = require('./admin.car.routes');
const adminLeadRoutes = require('./admin.lead.routes');
const statsRoutes = require('./stats.routes');

// ============================================================================
// MOUNT ROUTES
// ============================================================================

// Welcome route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Platinum Helms Autos API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      cars: {
        public: '/api/v1/cars',
        admin: '/api/v1/admin/cars',
      },
      leads: {
        submit: '/api/v1/leads',
        admin: '/api/v1/admin/leads',
      },
      admin: {
        auth: '/api/v1/admin',
        stats: '/api/v1/admin/stats',
      },
    },
    documentation: 'https://github.com/platinum-helms/api-docs',
  });
});

// Public routes
router.use('/cars', carRoutes);
router.use('/leads', leadRoutes);

// Admin auth routes
router.use('/admin', adminRoutes);

// Admin resource routes
router.use('/admin/cars', adminCarRoutes);
router.use('/admin/leads', adminLeadRoutes);
router.use('/admin/stats', statsRoutes);

module.exports = router;
