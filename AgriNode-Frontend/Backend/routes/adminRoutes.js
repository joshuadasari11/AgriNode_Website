// ─────────────────────────────────────────────────────────────────────────────
// routes/adminRoutes.js
// Mounts: /api/admin/*
// All routes require admin role.
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const router  = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getFarmers,
  getAgents,
  approveAgent,
  rejectAgent,
  verifyUser,
  getComplaints,
  resolveComplaint,
  getLoanRequests,
  approveLoan,
  rejectLoan,
  getStats
} = require('../controllers/adminController');

// ── All admin routes require authentication + admin role ──
router.use(verifyToken, requireRole('admin'));

// User management
router.get('/users',                getAllUsers);
router.get('/farmers',              getFarmers);
router.get('/agents',               getAgents);

// Agent approval
router.put('/approve-agent/:id',    approveAgent);
router.put('/reject-agent/:id',     rejectAgent);

// User verification
router.put('/verify-user/:id',      verifyUser);

// Complaint management
router.get('/complaints',           getComplaints);
router.put('/resolve-complaint/:id', resolveComplaint);

// Loan management
router.get('/loan-requests',        getLoanRequests);
router.put('/approve-loan/:id',     approveLoan);
router.put('/reject-loan/:id',      rejectLoan);

// Platform stats
router.get('/stats',                getStats);

module.exports = router;
