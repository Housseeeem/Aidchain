const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { encrypt, decrypt } = require('../utils/encryption');

let files = [];
let fileIdCounter = 1;

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileBuffer = fs.readFileSync(req.file.path);

    // Optionnel : chiffrer les données
    const encryptedData = encrypt(fileBuffer.toString());

    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, req.file.filename);
    fs.writeFileSync(filePath, fileBuffer);

    const file = {
      id: fileIdCounter++,
      filename: req.file.originalname,
      filepath: filePath,
      owner_id: req.user.id,
      file_hash: crypto.createHash('sha256').update(fileBuffer).digest('hex'),
      created_at: new Date()
    };

    files.push(file);
    fs.unlinkSync(req.file.path);

    res.json({
      message: 'File uploaded successfully',
      fileId: file.id,
      filename: file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
};

const getFile = async (req, res) => {
  try {
    const userFiles = files.filter(file => file.owner_id === req.user.id);
    res.json(userFiles);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving files', error: error.message });
  }
};

module.exports = { uploadFile, getFile };
