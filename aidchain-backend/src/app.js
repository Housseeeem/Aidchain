// src/app.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs-extra');
const connectDB = require('./config/db');
const hederaService = require('./services/hederaService');

const authRoutes = require('./routes/auth');
const datasetRoutes = require('./routes/datasets');
const requestRoutes = require('./routes/requests');

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');

async function main() {
  // Connect to MongoDB
  await connectDB();
  
  // Ensure upload directory exists
  await fs.ensureDir(UPLOAD_DIR);

  // Initialize Hedera service (non-blocking)
  hederaService.initialize().catch(err => {
    console.warn('Hedera initialization failed, continuing without blockchain features:', err.message);
  });

  const app = express();
  
  // Middleware
  app.use(express.json());
  app.use(morgan('dev'));

  // CORS (optional - enable if frontend is on different origin)
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Serve uploaded files (static)
  app.use('/uploads', express.static(path.resolve(UPLOAD_DIR)));

  // Health check route
  app.get('/', (req, res) => {
    res.json({ 
      status: 'AidChain API running',
      version: '1.0.0',
      uploadsDir: UPLOAD_DIR,
      hederaEnabled: !!hederaService.client,
    });
  });

  // API Routes
  app.use('/auth', authRoutes);
  app.use('/datasets', datasetRoutes);
  app.use('/requests', requestRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  });

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
    console.log(`📁 Upload directory: ${UPLOAD_DIR}`);
    console.log(`🔗 MongoDB connected`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing Hedera connection...');
    hederaService.close();
    process.exit(0);
  });
}

main().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
