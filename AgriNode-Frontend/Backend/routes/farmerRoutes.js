// ─────────────────────────────────────────────────────────────────────────────
// routes/farmerRoutes.js
// Mounts: /api/farmer/*
// All routes require a valid JWT (verifyToken) + farmer role.
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const router  = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  getCrops,
  addCrop,
  listCrop,
  getMyListings,
  submitComplaint,
  applyLoan
} = require('../controllers/farmerController');

// ── All farmer routes require authentication ──
router.use(verifyToken);

// Profile
router.get('/profile',      getProfile);
router.put('/profile',      updateProfile);

// Crops (marketplace is accessible by any authenticated user; additions are farmer-only)
router.get('/crops',        getCrops);
router.post('/crops',       requireRole('farmer'), addCrop);

// Marketplace listing
router.post('/list-crop',   requireRole('farmer'), listCrop);
router.get('/my-listings',  requireRole('farmer'), getMyListings);

// Complaint & Loan
router.post('/complaint',   requireRole('farmer'), submitComplaint);
router.post('/loan',        requireRole('farmer'), applyLoan);

module.exports = router;
