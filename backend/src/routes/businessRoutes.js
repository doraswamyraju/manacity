const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const auth = require('../middleware/auth');

const checkSubscriptionLimit = require('../middleware/subscriptionCheck');

// Protected locations endpoints
router.get('/', auth, businessController.getLocations);
router.get('/onboarding-state', auth, businessController.getOnboardingState);
router.post('/save-step', auth, businessController.saveOnboardingStep);
router.post('/complete-onboarding', auth, businessController.completeOnboarding);
router.post('/', auth, checkSubscriptionLimit('location'), businessController.createLocation);
router.put('/:id', auth, businessController.updateLocation);
router.delete('/:id', auth, businessController.deleteLocation);
router.post('/media', auth, businessController.uploadMedia);

module.exports = router;
