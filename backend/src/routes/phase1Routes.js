const express = require('express');
const router = express.Router();
const phase1Controller = require('../controllers/phase1Controller');
const directoryLeadController = require('../controllers/directoryLeadController');

const auth = require('../middleware/auth');

// Google Places Onboarding & central library
router.get('/google-places/autocomplete', phase1Controller.autocompleteGooglePlaces);
router.post('/google-places/import', auth, phase1Controller.importGooglePlaces);
router.get('/library', phase1Controller.getLibraryItems);
router.post('/library/add', phase1Controller.addLibraryItemToBusiness);

// ManaCity Directory & Lead capture
router.get('/directory/:city/all', directoryLeadController.searchDirectoryListings);
router.get('/directory/:city/:slug', directoryLeadController.getDirectoryListing);
router.post('/lead', directoryLeadController.recordLeadOrClick);
router.get('/lead/dashboard/:businessGroupId', directoryLeadController.getBusinessLeads);

// Let's Track Telemetry
router.post('/letstrack/telemetry', directoryLeadController.letsTrackTelemetry);

module.exports = router;
