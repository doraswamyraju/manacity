const express = require('express');
const router = express.Router();
const websiteController = require('../controllers/websiteController');
const auth = require('../middleware/auth');
const checkSubscriptionLimit = require('../middleware/subscriptionCheck');

// Protected admin builder routes
router.get('/', auth, websiteController.getWebsite);
router.get('/:locationId', auth, websiteController.getWebsite);
router.post('/', auth, websiteController.saveWebsite);
router.post('/publish', auth, websiteController.saveWebsite);
router.post('/sections/save', auth, websiteController.saveWebsiteSections);
router.post('/domain/connect', auth, websiteController.connectCustomDomain);
router.post('/domain/verify-dns', auth, websiteController.verifyCustomDomainDns);
router.post('/domain/disconnect', auth, websiteController.disconnectCustomDomain);

// Public dynamic renderer & SEO files
router.get('/public/:subdomain', websiteController.renderPublicWebsite);
router.get('/public/:subdomain/sitemap.xml', websiteController.getSitemap);
router.get('/public/:subdomain/robots.txt', websiteController.getRobots);
router.get('/public/:subdomain/manifest.json', websiteController.getManifest);

module.exports = router;
