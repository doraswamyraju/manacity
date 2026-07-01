const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// Protected dashboard routes
router.get('/:locationId', auth, reviewController.getReviews);
router.post('/reply/:reviewId', auth, reviewController.replyToReview);

// Public review submission route
router.post('/submit', reviewController.submitReview);

module.exports = router;
