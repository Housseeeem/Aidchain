const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const Dataset = require('../models/Dataset');
const DatasetRequest = require('../models/DatasetRequest');
const { authenticate } = require('../middleware/authMiddleware');
const hederaService = require('../services/hederaService');
const { hashFile } = require('../utils/crypto');

const router = express.Router();

// Configure multer for file uploads
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fs.ensureDir(UPLOAD_DIR);
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    // Accept common dataset formats
    const allowedTypes = /csv|json|xlsx|xls|xml|txt|zip/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname || mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type. Only CSV, JSON, XLSX, XML, TXT, and ZIP files are allowed.'));
  }
});

// POST /datasets - Upload a new dataset (protected)
router.post('/', authenticate, upload.single('file'), async (req, res) => {
  try {
    const { datasetName, description, access, price } = req.body;
    const user = req.user;

    if (!datasetName) {
      return res.status(400).json({ error: 'Dataset name is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    // Calculate file size
    const stats = await fs.stat(req.file.path);
    const fileSizeInBytes = stats.size;
    const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);

    const dataset = new Dataset({
      datasetName,
      description: description || '',
      access: access === 'true' || access === true,
      price: parseFloat(price) || 0,
      filePath: req.file.filename,
      sizeFile: `${fileSizeInMB} MB`,
      ownerUsername: user.email,
      downloads: 0,
    });

    await dataset.save();

    // Log to blockchain (non-blocking)
    try {
      const fileHash = await hashFile(req.file.path);
      hederaService.logDatasetUpload(
        dataset._id.toString(),
        dataset.datasetName,
        user.email,
        fileHash
      ).catch(err => console.error('Hedera logging failed:', err));
    } catch (err) {
      console.error('File hashing failed:', err);
    }

    res.status(201).json({
      message: 'Dataset uploaded successfully',
      dataset: {
        id: dataset._id,
        datasetName: dataset.datasetName,
        description: dataset.description,
        access: dataset.access,
        price: dataset.price,
        sizeFile: dataset.sizeFile,
        ownerUsername: dataset.ownerUsername,
      }
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Server error during upload' });
  }
});

// GET /datasets - List all datasets
router.get('/', async (req, res) => {
  try {
    const datasets = await Dataset.find().select('-filePath');
    res.json({ datasets });
  } catch (err) {
    console.error('List datasets error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /datasets/:id - Get dataset details
router.get('/:id', async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id).select('-filePath');
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    res.json({ dataset });
  } catch (err) {
    console.error('Get dataset error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /datasets/:id - Delete a dataset (protected, owner only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    // Check if user is the owner
    if (dataset.ownerUsername !== req.user.email) {
      return res.status(403).json({ error: 'Not authorized to delete this dataset' });
    }

    // Delete the file
    const filePath = path.join(UPLOAD_DIR, dataset.filePath);
    await fs.remove(filePath);

    // Delete dataset and related requests
    await DatasetRequest.deleteMany({ datasetId: dataset._id });
    await Dataset.findByIdAndDelete(req.params.id);

    res.json({ message: 'Dataset deleted successfully' });
  } catch (err) {
    console.error('Delete dataset error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /datasets/:id/download - Download dataset (protected, with access control)
router.get('/:id/download', authenticate, async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    const user = req.user;

    // Check if user is the owner
    if (dataset.ownerUsername === user.email) {
      // Owner can always download
      const filePath = path.join(UPLOAD_DIR, dataset.filePath);
      
      // Increment download count
      dataset.downloads += 1;
      await dataset.save();

      // Log download to blockchain
      hederaService.logDatasetDownload(dataset._id.toString(), user.email)
        .catch(err => console.error('Hedera logging failed:', err));

      return res.download(filePath, dataset.datasetName);
    }

    // Check if dataset is publicly accessible
    if (dataset.access) {
      const filePath = path.join(UPLOAD_DIR, dataset.filePath);
      
      // Increment download count
      dataset.downloads += 1;
      await dataset.save();

      // Log download to blockchain
      hederaService.logDatasetDownload(dataset._id.toString(), user.email)
        .catch(err => console.error('Hedera logging failed:', err));

      return res.download(filePath, dataset.datasetName);
    }

    // Check if user has an approved request
    const approvedRequest = await DatasetRequest.findOne({
      datasetId: dataset._id,
      username: user.email,
      approved: true,
    });

    if (!approvedRequest) {
      return res.status(403).json({ error: 'Access denied. Please request access first.' });
    }

    // User has approved access
    const filePath = path.join(UPLOAD_DIR, dataset.filePath);
    
    // Increment download count
    dataset.downloads += 1;
    await dataset.save();

    // Log download to blockchain
    hederaService.logDatasetDownload(dataset._id.toString(), user.email)
      .catch(err => console.error('Hedera logging failed:', err));

    res.download(filePath, dataset.datasetName);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: 'Server error during download' });
  }
});

// GET /datasets/my/uploads - Get datasets uploaded by current user (protected)
router.get('/my/uploads', authenticate, async (req, res) => {
  try {
    const datasets = await Dataset.find({ ownerUsername: req.user.email }).select('-filePath');
    res.json({ datasets });
  } catch (err) {
    console.error('Get my datasets error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
