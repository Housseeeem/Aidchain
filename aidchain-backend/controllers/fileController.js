const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');
const FormData = require('form-data');
const { File } = require('../collections');
const { encrypt, decrypt } = require('../utils/encryption');

/**
 * Upload file with AI anonymization
 * @route POST /files/upload
 * @access Private
 */
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Save original file temporarily
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const tempFilePath = path.join(uploadsDir, `temp_${req.file.filename}`);
    fs.writeFileSync(tempFilePath, fileBuffer);

    // Create initial file record in MongoDB
    const fileRecord = new File({
      filename: `encrypted_${req.file.filename}`,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedBy: req.user.id,
      encryptedPath: '', // Will be updated after encryption
      fileHash: fileHash,
      anonymizationStatus: 'processing'
    });

    await fileRecord.save();

    // Call AI anonymization service if enabled
    let anonymizedFilePath = tempFilePath;
    let anonymizationMetrics = null;

    if (process.env.AI_SERVICE_URL) {
      try {
        console.log('🤖 Sending file to AI anonymization service...');
        
        const formData = new FormData();
        formData.append('file', fs.createReadStream(tempFilePath));
        formData.append('anonymization_type', 'full');
        formData.append('privacy_level', 'high');
        formData.append('file_type', path.extname(req.file.originalname).substring(1));

        const aiResponse = await axios.post(
          `${process.env.AI_SERVICE_URL}/api/anonymize`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              'Authorization': `Bearer ${process.env.AI_SERVICE_API_KEY || ''}`
            },
            timeout: 60000 // 60 second timeout
          }
        );

        console.log('✅ AI anonymization completed successfully');

        // Save anonymized file
        anonymizedFilePath = path.join(uploadsDir, `anonymized_${req.file.filename}`);
        fs.writeFileSync(
          anonymizedFilePath,
          Buffer.from(aiResponse.data.anonymized_content, 'base64')
        );

        // Update anonymization metrics
        anonymizationMetrics = {
          entitiesRedacted: aiResponse.data.entities_redacted || [],
          kValue: aiResponse.data.privacy_metrics?.k_value,
          epsilonValue: aiResponse.data.privacy_metrics?.epsilon
        };

        fileRecord.isAnonymized = true;
        fileRecord.anonymizationStatus = 'completed';
        fileRecord.metadata.anonymizationMetrics = anonymizationMetrics;

      } catch (aiError) {
        console.warn('⚠️ AI anonymization failed, proceeding with original file:', aiError.message);
        fileRecord.anonymizationStatus = 'failed';
        // Continue with original file
      }
    } else {
      console.log('ℹ️ AI service not configured, skipping anonymization');
      fileRecord.anonymizationStatus = 'completed';
      fileRecord.isAnonymized = false;
    }

    // Encrypt the file (anonymized or original)
    const fileContent = fs.readFileSync(anonymizedFilePath);
    const encryptedData = encrypt(fileContent.toString('base64'));
    
    const encryptedFilePath = path.join(uploadsDir, `encrypted_${req.file.filename}`);
    fs.writeFileSync(encryptedFilePath, encryptedData);

    // Update file record with encrypted path
    fileRecord.encryptedPath = encryptedFilePath;
    await fileRecord.save();

    // Clean up temporary files
    fs.unlinkSync(req.file.path);
    fs.unlinkSync(tempFilePath);
    if (anonymizedFilePath !== tempFilePath && fs.existsSync(anonymizedFilePath)) {
      fs.unlinkSync(anonymizedFilePath);
    }

    // TODO: Register file hash on Hedera HCS
    // const hederaReceipt = await registerFileOnHedera(fileHash, fileRecord._id);
    // fileRecord.hederaHash = hederaReceipt.topicSequenceNumber;
    // fileRecord.hederaTimestamp = hederaReceipt.consensusTimestamp;
    // await fileRecord.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      fileId: fileRecord._id,
      filename: fileRecord.originalName,
      isAnonymized: fileRecord.isAnonymized,
      anonymizationStatus: fileRecord.anonymizationStatus,
      size: fileRecord.size,
      fileHash: fileHash,
      anonymizationMetrics: anonymizationMetrics
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    
    // Clean up file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      error: 'Error uploading file', 
      details: error.message 
    });
  }
};

/**
 * Get all files for authenticated user
 * @route GET /files
 * @access Private
 */
const getFile = async (req, res) => {
  try {
    const userFiles = await File.find({ uploadedBy: req.user.id })
      .select('-encryptedPath')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      count: userFiles.length,
      files: userFiles
    });

  } catch (error) {
    console.error('❌ Error retrieving files:', error);
    res.status(500).json({ 
      error: 'Error retrieving files', 
      details: error.message 
    });
  }
};

/**
 * Get file by ID
 * @route GET /files/:id
 * @access Private
 */
const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id)
      .select('-encryptedPath')
      .populate('uploadedBy', 'username')
      .lean();

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if user owns the file or has access permission
    // TODO: Implement access control check with AccessRequest collection
    if (file.uploadedBy._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(file);

  } catch (error) {
    console.error('❌ Error retrieving file:', error);
    res.status(500).json({ 
      error: 'Error retrieving file', 
      details: error.message 
    });
  }
};

/**
 * Download file
 * @route GET /files/:id/download
 * @access Private
 */
const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if user owns the file or has access permission
    // TODO: Implement access control check with AccessRequest collection
    if (file.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Read and decrypt file
    const encryptedData = fs.readFileSync(file.encryptedPath, 'utf-8');
    const decryptedBase64 = decrypt(encryptedData);
    const decryptedBuffer = Buffer.from(decryptedBase64, 'base64');

    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.send(decryptedBuffer);

  } catch (error) {
    console.error('❌ Error downloading file:', error);
    res.status(500).json({ 
      error: 'Error downloading file', 
      details: error.message 
    });
  }
};

module.exports = { 
  uploadFile, 
  getFile, 
  getFileById, 
  downloadFile 
};
