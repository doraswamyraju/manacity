const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');

// Protected routes
router.get('/', auth, subscriptionController.getSubscriptionStatus);
router.post('/checkout', auth, subscriptionController.createCheckoutSession);

// Public / webhook handler callback
router.get('/mock-checkout-success', subscriptionController.mockCheckoutSuccess);

module.exports = router;
