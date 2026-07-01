const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

// Protected routes
router.get('/:locationId', auth, taskController.getLocationTasks);

module.exports = router;
