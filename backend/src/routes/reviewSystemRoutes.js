const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviewSystemController');
const auth = require('../middleware/auth');

// --- CAMPAIGNS (Auth required) ---
router.get('/campaigns', auth, controller.listCampaigns);
router.post('/campaigns', auth, controller.createCampaign);
router.get('/campaigns/:id', auth, controller.getCampaign);
router.put('/campaigns/:id', auth, controller.updateCampaign);
router.delete('/campaigns/:id', auth, controller.deleteCampaign);

// --- REQUESTS (Auth required, status can be public updated via link actions) ---
router.get('/requests', auth, controller.listRequests);
router.post('/requests', auth, controller.createRequest);
router.put('/requests/:id', controller.updateRequestStatus); // Allow updates from redirect clicks without strict auth session

// --- CUSTOMERS (Auth required) ---
router.get('/customers', auth, controller.listCustomers);
router.post('/customers', auth, controller.createCustomer);
router.put('/customers/:id', auth, controller.updateCustomer);
router.delete('/customers/:id', auth, controller.deleteCustomer);

// --- QR CODES ---
router.get('/qrs', auth, controller.listQRs);
router.post('/qrs', auth, controller.createQR);
router.post('/qrs/:uniqueQrId/scan', controller.incrementQRScan); // Public scan counter
router.delete('/qrs/:id', auth, controller.deleteQR);

// --- LANDING PAGES ---
router.get('/landing-page/:locationId', controller.getLandingPage); // Public access
router.post('/landing-page', auth, controller.saveLandingPage);

// --- INBOX (CRM FLOW) ---
router.get('/inbox', auth, controller.listInboxReviews);
router.put('/inbox/:id', auth, controller.updateInboxReviewCRM);
router.post('/inbox', controller.submitPublicReview); // Public submission

// --- ANALYTICS ---
router.get('/analytics', auth, controller.getAnalytics);

module.exports = router;
