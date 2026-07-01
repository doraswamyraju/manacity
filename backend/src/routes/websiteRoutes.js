const express = require('express');
const router = express.Router();
const websiteController = require('../controllers/websiteController');
const auth = require('../middleware/auth');
const checkSubscriptionLimit = require('../middleware/subscriptionCheck');

// Protected admin builder routes
router.get('/:locationId', auth, websiteController.getWebsite);
router.post('/', auth, checkSubscriptionLimit('website'), websiteController.saveWebsite);

// Public dynamic renderer (Nginx reverse proxies this to subdomain hosting)
router.get('/public/:subdomain', websiteController.renderPublicWebsite);

module.exports = router;
