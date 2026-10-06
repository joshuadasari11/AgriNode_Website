// ─────────────────────────────────────────────────────────────────────────────
// routes/authRoutes.js
// Mounts: /api/auth/*
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const router  = express.Router();
const {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword
} = require('../controllers/authController');

// ── Public routes (no auth required) ──
router.post('/register',        register);
router.post('/login',           login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp',      verifyOtp);
router.post('/reset-password',  resetPassword);

module.exports = router;
