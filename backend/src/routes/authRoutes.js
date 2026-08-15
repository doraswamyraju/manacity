const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Auth endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleAuth);
router.post('/apple', authController.appleAuth);
router.get('/me', auth, authController.getMe);

router.post('/update-phone', auth, authController.updatePhone);
router.post('/delete-account', authController.deleteAccount);

module.exports = router;
