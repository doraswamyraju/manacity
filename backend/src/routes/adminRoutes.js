const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const systemSettingsController = require('../controllers/systemSettingsController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const aggregatorAdminController = require('../controllers/aggregatorAdminController');

// All endpoints secured with auth + admin checks
router.use(auth, admin);

// Metrics & Audit
router.get('/metrics', adminController.getSystemMetrics);

// Users Management
router.get('/users', adminController.getUsers);
router.patch('/users/:userId/role', adminController.updateUserRole);

// Business & Directory Moderation
router.get('/businesses', adminController.getBusinesses);
router.post('/businesses', adminController.createBusinessByAdmin);
router.patch('/businesses/:id/reassign', adminController.reassignBusinessOwner);
router.patch('/businesses/:id/status', adminController.updateBusinessStatus);
router.delete('/businesses/:id', adminController.deleteBusiness);

// Directory Aggregator Super Admin Control Hub
router.get('/aggregator/metrics', aggregatorAdminController.getAggregatorMetrics);
router.get('/aggregator/listings', aggregatorAdminController.getAggregatorListings);
router.patch('/aggregator/listings/:id', aggregatorAdminController.updateListingModeration);
router.get('/aggregator/leads', aggregatorAdminController.getPublicLeads);

// Global Master Catalog Library
router.get('/catalog', adminController.getMasterCatalog);
router.post('/catalog', adminController.createMasterCatalogItem);
router.post('/catalog/:id/duplicate', adminController.duplicateMasterCatalogItem);
router.put('/catalog/:id', adminController.updateMasterCatalogItem);
router.patch('/catalog/:id/status', adminController.updateCatalogStatus);
router.delete('/catalog/:id', adminController.deleteMasterCatalogItem);


// Subscriptions
router.get('/subscriptions', adminController.getSubscriptions);

// URL Structure & SEO Settings (Super Admin Stacked Control)
router.get('/settings/url-structure', systemSettingsController.getUrlSettings);
router.put('/settings/url-structure', systemSettingsController.updateUrlSettings);

module.exports = router;



