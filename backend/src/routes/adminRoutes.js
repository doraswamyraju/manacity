const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Mount secured admin panels metrics
router.get('/metrics', auth, admin, adminController.getSystemMetrics);

module.exports = router;
