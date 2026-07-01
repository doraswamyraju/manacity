const express = require('express');
const router = express.Router();
const crmController = require('../controllers/crmController');
const auth = require('../middleware/auth');

// Protected CRM routes
router.get('/:locationId', auth, crmController.getCustomers);
router.put('/:customerId', auth, crmController.updateCustomerPipeline);

// Public lead capture route (e.g. from customizer generated pages)
router.post('/submit', crmController.captureLead);

module.exports = router;
