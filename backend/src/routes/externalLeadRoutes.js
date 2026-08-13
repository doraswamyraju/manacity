const express = require('express');
const router = express.Router();
const externalLeadController = require('../controllers/externalLeadController');

router.post('/submit', externalLeadController.createExternalLead);
router.get('/status/:leadId', externalLeadController.getLeadStatusAndAlternatives);

module.exports = router;
