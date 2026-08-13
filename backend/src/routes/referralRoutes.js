const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public tracking & conversion routes
router.post('/click', referralController.trackClick);
router.post('/conversion', referralController.attributeConversion);

// User authenticated routes
router.get('/code', auth, referralController.getOrCreateReferralCode);
router.get('/stats', auth, referralController.getMyReferralStats);
router.get('/catalog', auth, referralController.getReferralProductsAndServices);
router.post('/payout-profile', auth, referralController.savePayoutProfile);
router.post('/request-payout', auth, referralController.requestPayout);

// Admin authenticated routes
router.get('/admin/overview', auth, admin, referralController.getAdminReferralOverview);
router.put('/admin/config', auth, admin, referralController.updateAdminProgramConfig);
router.get('/admin/commissions', auth, admin, referralController.getAdminCommissions);
router.patch('/admin/commissions/:id/status', auth, admin, referralController.updateCommissionStatus);
router.get('/admin/payouts', auth, admin, referralController.getAdminPayoutRequests);
router.post('/admin/payouts/:id/process', auth, admin, referralController.processAdminPayout);
router.patch('/admin/item-commission', auth, admin, referralController.updateItemCommissionSettings);

module.exports = router;
