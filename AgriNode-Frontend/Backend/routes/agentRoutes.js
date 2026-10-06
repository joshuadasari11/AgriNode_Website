// ─────────────────────────────────────────────────────────────────────────────
// routes/agentRoutes.js
// Mounts: /api/agent/*
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const router  = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const {
  getFarmers,
  addFarmer,
  getCrops,
  sendBroadcast,
  getReports
} = require('../controllers/agentController');

router.use(verifyToken, requireRole('agent', 'admin'));

router.get('/farmers',    getFarmers);
router.post('/farmers',   addFarmer);
router.get('/crops',      getCrops);
router.post('/broadcast', sendBroadcast);
router.get('/reports',    getReports);

module.exports = router;
