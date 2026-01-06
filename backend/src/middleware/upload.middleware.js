// File upload middleware using Multer
const multer = require('multer');
const path = require('path');
const { UPLOAD, STATUS } = require('../config/constants');
const { AppError } = require('./error.middleware');

// Configure storage (memory storage for direct Cloudinary upload)
const storage = multer.memoryStorage();

// File filter to validate uploaded files
const fileFilter = (req, file, cb) => {
  // Check mime type
  if (UPLOAD.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `Invalid file type. Allowed types: ${UPLOAD.ALLOWED_MIME_TYPES.join(', ')}`,
        STATUS.BAD_REQUEST
      ),
      false
    );
  }
};

// Create multer upload instance
const upload = multer({
  storage,
  limits: {
    fileSize: UPLOAD.MAX_FILE_SIZE,
    files: UPLOAD.MAX_FILES,
  },
  fileFilter,
});

/**
 * Handle multer upload errors
 * @middleware
 */
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(STATUS.BAD_REQUEST).json({
        success: false,
        message: `File too large. Maximum size: ${UPLOAD.MAX_FILE_SIZE / 1048576}MB`,
      });
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(STATUS.BAD_REQUEST).json({
        success: false,
        message: `Too many files. Maximum: ${UPLOAD.MAX_FILES} files`,
      });
    }

    return res.status(STATUS.BAD_REQUEST).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  }

  next(err);
};

/**
 * Validate that files were uploaded
 * @middleware
 */
const validateFilesUploaded = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(STATUS.BAD_REQUEST).json({
      success: false,
      message: 'No files uploaded. Please select at least one image.',
    });
  }

  next();
};

/**
 * Validate single file upload
 * @middleware
 */
const validateSingleFileUploaded = (req, res, next) => {
  if (!req.file) {
    return res.status(STATUS.BAD_REQUEST).json({
      success: false,
      message: 'No file uploaded. Please select an image.',
    });
  }

  next();
};

module.exports = {
  upload,
  handleUploadErrors,
  validateFilesUploaded,
  validateSingleFileUploaded,
};
