const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadFile, getFile, getFileById, downloadFile } = require('../controllers/fileController');

/**
 * @route   POST /files/upload
 * @desc    Upload a new file (will be anonymized by AI service)
 * @access  Private (requires authentication)
 */
router.post('/upload', auth, upload.single('file'), uploadFile);

/**
 * @route   GET /files
 * @desc    Get all files uploaded by the authenticated user
 * @access  Private (requires authentication)
 */
router.get('/', auth, getFile);

/**
 * @route   GET /files/:id
 * @desc    Get specific file metadata by ID
 * @access  Private (requires authentication)
 */
router.get('/:id', auth, getFileById);

/**
 * @route   GET /files/:id/download
 * @desc    Download file (if user has access permission)
 * @access  Private (requires authentication)
 */
router.get('/:id/download', auth, downloadFile);

module.exports = router;
