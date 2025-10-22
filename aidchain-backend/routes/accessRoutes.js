const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requestAccess, approveAccess } = require('../controllers/accessController');

router.post('/request', auth, requestAccess);
router.post('/approve', auth, approveAccess);

module.exports = router;
