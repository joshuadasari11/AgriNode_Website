// AgriNode Backend – Payment Routes (Upgraded)
// POST /api/payments/create
// POST /api/payments/verify
// GET  /api/payments/history
// GET  /api/payments/stats

const express = require('express');
const router  = express.Router();
const { readData, writeData } = require('../utils/fileHelper');
const { verifyToken } = require('../middleware/authMiddleware');

// ── Helpers ──────────────────────────────────────────────────────────────────
function genTxnId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'AGN';
  for (let i = 0; i < 12; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function genUpiRef() {
  return Date.now().toString() + Math.floor(Math.random() * 9000 + 1000);
}

function toDateStr() {
  const d = new Date();
  return d.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
  });
}

// ── POST /api/payments/create ─────────────────────────────────────────────────
// Initiates a payment and returns a pending transaction record + UPI details
router.post('/create', verifyToken, (req, res) => {
  try {
    const { amount, label, method, type, farmer, remarks, upiId } = req.body;

    if (!amount || !method) {
      return res.status(400).json({ success: false, message: 'amount and method are required' });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'amount must be greater than 0' });
    }

    const txnId  = genTxnId();
    const upiRef = genUpiRef();
    const newPayment = {
      id:        txnId,
      upiRef,
      type:      type || 'debit',
      amount:    Number(amount),
      label:     label || remarks || 'Payment',
      date:      toDateStr(),
      dateISO:   new Date().toISOString(),
      method,
      status:    'pending',
      farmer:    farmer || '',
      upiId:     upiId || (method === 'UPI' ? 'agrinode@upi' : ''),
      createdAt: new Date().toISOString()
    };

    const payments = readData('payments');
    payments.unshift(newPayment);
    writeData('payments', payments);

    res.status(201).json({
      success: true,
      message: 'Payment initiated',
      payment: newPayment,
      upiDetails: {
        upiId:  'agrinode@upi',
        name:   'AgriNode Platform',
        amount: Number(amount),
        ref:    upiRef,
        qrData: `upi://pay?pa=agrinode@upi&pn=AgriNode%20Platform&am=${amount}&cu=INR&tn=${encodeURIComponent(label||'Payment')}&tr=${upiRef}`
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/payments/verify ─────────────────────────────────────────────────
// Simulates payment verification. 95% success, 5% failure for realism.
router.post('/verify', verifyToken, (req, res) => {
  try {
    const { txnId, upiRef } = req.body;
    if (!txnId) {
      return res.status(400).json({ success: false, message: 'txnId is required' });
    }

    const payments = readData('payments');
    const idx = payments.findIndex(p => p.id === txnId);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Simulate: 95% success rate
    const isSuccess = Math.random() < 0.95;
    payments[idx].status    = isSuccess ? 'success' : 'failed';
    payments[idx].verifiedAt = new Date().toISOString();
    payments[idx].bankRef   = isSuccess ? ('BNKREF' + genUpiRef().slice(0, 10)) : null;
    writeData('payments', payments);

    if (isSuccess) {
      res.json({
        success:  true,
        status:   'success',
        message:  'Payment verified successfully',
        txnId:    payments[idx].id,
        bankRef:  payments[idx].bankRef,
        amount:   payments[idx].amount,
        method:   payments[idx].method,
        label:    payments[idx].label,
        dateTime: payments[idx].date,
        payment:  payments[idx]
      });
    } else {
      res.json({
        success:  false,
        status:   'failed',
        message:  'Payment verification failed. Please retry or use a different method.',
        txnId:    payments[idx].id,
        payment:  payments[idx]
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/payments/history ─────────────────────────────────────────────────
router.get('/history', verifyToken, (req, res) => {
  try {
    const payments = readData('payments');
    const { farmer, type, status, limit } = req.query;
    let filtered = [...payments];
    if (farmer) filtered = filtered.filter(p => p.farmer && p.farmer.toLowerCase().includes(farmer.toLowerCase()));
    if (type)   filtered = filtered.filter(p => p.type   === type);
    if (status) filtered = filtered.filter(p => p.status === status);
    // Sort newest first
    filtered.sort((a, b) => new Date(b.createdAt || b.dateISO || 0) - new Date(a.createdAt || a.dateISO || 0));
    if (limit)  filtered = filtered.slice(0, Number(limit));
    res.json({ success: true, count: filtered.length, payments: filtered });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/payments/stats ───────────────────────────────────────────────────
router.get('/stats', verifyToken, (req, res) => {
  try {
    const payments = readData('payments');
    const totals = payments.reduce((acc, p) => {
      if (p.status !== 'failed') {
        if (p.type === 'credit') acc.totalIncome  += p.amount;
        else                     acc.totalExpense += p.amount;
        acc.totalTxns++;
      }
      return acc;
    }, { totalIncome: 0, totalExpense: 0, totalTxns: 0 });
    totals.netBalance = totals.totalIncome - totals.totalExpense;
    res.json({ success: true, stats: totals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
