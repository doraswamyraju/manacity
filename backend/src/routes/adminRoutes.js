const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// All endpoints secured with auth + admin checks
router.use(auth, admin);

// Metrics & Audit
router.get('/metrics', adminController.getSystemMetrics);

// Users Management
router.get('/users', adminController.getUsers);
router.patch('/users/:userId/role', adminController.updateUserRole);

// Business & Directory Moderation
router.get('/businesses', adminController.getBusinesses);
router.patch('/businesses/:id/status', adminController.updateBusinessStatus);
router.delete('/businesses/:id', adminController.deleteBusiness);

// Global Master Catalog Library
router.get('/catalog', adminController.getMasterCatalog);
router.post('/catalog', adminController.createMasterCatalogItem);
router.put('/catalog/:id', adminController.updateMasterCatalogItem);
router.patch('/catalog/:id/status', adminController.updateCatalogStatus);
router.delete('/catalog/:id', adminController.deleteMasterCatalogItem);

// Subscriptions
router.get('/subscriptions', adminController.getSubscriptions);

module.exports = router;

