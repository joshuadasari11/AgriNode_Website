// AgriNode Backend – Marketplace Routes
const express = require('express');
const router  = express.Router();
const { readData, writeData } = require('../utils/fileHelper');
const { verifyToken } = require('../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');

// GET /api/marketplace/listings
router.get('/listings', verifyToken, (req, res) => {
  try {
    const { crop, available, village } = req.query;
    // Listings are stored in crops.json; fall back to embedded data if missing
    let listings;
    try {
      listings = readData('marketplace');
    } catch {
      listings = [];
    }
    if (crop)      listings = listings.filter(l => l.cropName && l.cropName.toLowerCase().includes(crop.toLowerCase()));
    if (available !== undefined) listings = listings.filter(l => String(l.available) === available);
    if (village)   listings = listings.filter(l => l.village && l.village.toLowerCase().includes(village.toLowerCase()));
    listings.sort((a, b) => new Date(b.listedAt || 0) - new Date(a.listedAt || 0));
    res.json({ success: true, count: listings.length, listings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/marketplace/listings
router.post('/listings', verifyToken, (req, res) => {
  try {
    const { farmerId, farmerName, village, cropName, cropIcon, qty, unit, askPrice, quality, contact, notes } = req.body;
    if (!cropName || !qty || !askPrice) {
      return res.status(400).json({ success: false, message: 'cropName, qty and askPrice are required' });
    }
    let listings;
    try { listings = readData('marketplace'); } catch { listings = []; }

    const icons = { Rice:'🌾', Wheat:'🌾', Maize:'🌽', Cotton:'🌿', Sugarcane:'🎋', Tomato:'🍅', Onion:'🧅' };
    const newListing = {
      id:         'MP' + uuidv4().split('-')[0].toUpperCase(),
      farmerId:   farmerId || 0,
      farmerName: farmerName || '',
      village:    village || '',
      cropName,
      cropIcon:   cropIcon || icons[cropName] || '🌱',
      qty:        Number(qty),
      unit:       unit || 'qtl',
      askPrice:   Number(askPrice),
      quality:    quality || 'Grade A',
      available:  true,
      listedAt:   new Date().toLocaleDateString('en-IN'),
      contact:    contact || '',
      notes:      notes || '',
      createdAt:  new Date().toISOString()
    };
    listings.unshift(newListing);
    writeData('marketplace', listings);
    res.status(201).json({ success: true, message: 'Listing added to marketplace', listing: newListing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
