const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const claimController = require('../controllers/claimController');
const auth = require('../middleware/auth');

// Configure upload destination for claim documents
const uploadDir = path.join(__dirname, '../../uploads/claim-documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `claim-doc-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Public / Check endpoint
router.get('/check-exists', claimController.checkBusinessExists);

// Submit claim request (with file upload, optional auth)
router.post('/submit', (req, res, next) => {
  // Optional auth middleware execution
  if (req.headers.authorization) {
    return auth(req, res, () => {
      upload.single('documentFile')(req, res, next);
    });
  }
  upload.single('documentFile')(req, res, next);
}, claimController.submitClaimRequest);

// Admin claim routes
router.get('/admin/list', auth, claimController.getClaimRequests);
router.post('/admin/verify/:claimId', auth, claimController.verifyClaimRequest);

module.exports = router;
