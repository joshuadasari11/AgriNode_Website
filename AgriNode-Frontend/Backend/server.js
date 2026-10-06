// ─────────────────────────────────────────────────────────────────────────────
// AgriNode Backend – server.js
// Main entry point for the Express application
// Future MySQL migration: replace JSON file operations in controllers with
// MySQL queries using the 'mysql2' package with the same function signatures.
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// ── Route imports ──
const authRoutes = require('./routes/authRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const agentRoutes = require('./routes/agentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const schemesRoutes = require('./routes/schemesRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const newsRoutes = require('./routes/newsRoutes');
const loanRoutes = require('./routes/loanRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const dataRoutes = require('./routes/dataRoutes');
// ── App init ──
const app = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',   // tighten in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));  // request logger

// ── Serve static frontend from parent directory (optional convenience) ──
app.use(express.static(path.join(__dirname, '..')));

// ─────────────────────────────────────────────────────────────────────────────
// API ROUTES
// ─────────────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/schemes', schemesRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/communications', communicationRoutes);
app.use('/api/data', dataRoutes);
// ── Health check ──
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'AgriNode Backend',
    version: '1.0.0',
    time: new Date().toISOString()
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL ERROR HANDLER
// ─────────────────────────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─────────────────────────────────────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌱 AgriNode Backend running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health\n`);
});

module.exports = app; // exported for testing
