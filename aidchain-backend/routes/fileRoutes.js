const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadFile, getFile } = require('../controllers/fileController');

router.post('/upload', auth, upload.single('file'), uploadFile);
router.get('/', auth, getFile);

module.exports = router;
