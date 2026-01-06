// Server entry point
require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/database');
const { testCloudinaryConnection } = require('./config/cloudinary');

const PORT = process.env.PORT || 5000;

// ============================================================================
// SERVER STARTUP
// ============================================================================

const startServer = async () => {
  try {
    console.log('\n🚀 Starting Platinum Helms Backend Server...\n');

    // Test database connection
    console.log('📦 Testing database connection...');
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Failed to connect to database');
    }

    // Test Cloudinary connection
    console.log('☁️  Testing Cloudinary connection...');
    const cloudinaryConnected = await testCloudinaryConnection();
    if (!cloudinaryConnected) {
      console.warn('⚠️  Cloudinary connection failed (image uploads will not work)');
    }

    // Start server
    const server = app.listen(PORT, () => {
      console.log('\n========================================');
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 API Base URL: http://localhost:${PORT}/api/v1`);
      console.log(`💚 Health Check: http://localhost:${PORT}/health`);
      console.log('========================================\n');
    });

    // Graceful shutdown handlers
    process.on('SIGTERM', () => {
      console.log('\n⚠️  SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\n⚠️  SIGINT received. Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('❌ UNHANDLED REJECTION! Shutting down...');
      console.error(err);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
      console.error(err);
      process.exit(1);
    });

  } catch (error) {
    console.error('\n❌ Failed to start server:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Start the server
startServer();
