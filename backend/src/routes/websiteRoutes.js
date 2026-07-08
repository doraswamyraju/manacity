const express = require('express');
const router = express.Router();
const websiteController = require('../controllers/websiteController');
const auth = require('../middleware/auth');
const checkSubscriptionLimit = require('../middleware/subscriptionCheck');

// Protected admin builder routes
router.get('/', auth, websiteController.getWebsite);
router.post('/save', auth, websiteController.saveWebsite);
router.post('/sections/save', auth, websiteController.saveWebsiteSections);

// Public dynamic renderer & SEO files
router.get('/public/:subdomain', websiteController.renderPublicWebsite);
router.get('/public/:subdomain/sitemap.xml', websiteController.getSitemap);
router.get('/public/:subdomain/robots.txt', websiteController.getRobots);
router.get('/public/:subdomain/manifest.json', websiteController.getManifest);

module.exports = router;
