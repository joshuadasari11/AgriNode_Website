// ─────────────────────────────────────────────────────────────────────────────
// controllers/farmerController.js
//
// Handles all farmer-facing API operations:
//   - Profile read/update
//   - Crop listing CRUD
//   - Marketplace listings
//   - Complaints
//   - Loan applications
// ─────────────────────────────────────────────────────────────────────────────

const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../utils/fileHelper');

// ── Helper: sanitize user ──
const sanitize = (user) => { const { password, ...safe } = user; return safe; };

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/farmer/profile
// ─────────────────────────────────────────────────────────────────────────────
exports.getProfile = (req, res) => {
  const { users } = readData('users');
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'Farmer not found.' });
  res.json({ success: true, data: sanitize(user) });
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/farmer/profile
// Body: { name, phone, village, district, state, landAcres }
// ─────────────────────────────────────────────────────────────────────────────
exports.updateProfile = (req, res) => {
  const allowed = ['name', 'phone', 'village', 'district', 'state', 'landAcres', 'profilePic'];
  const store = readData('users');
  const idx   = store.users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Farmer not found.' });

  allowed.forEach(field => {
    if (req.body[field] !== undefined) store.users[idx][field] = req.body[field];
  });
  store.users[idx].updatedAt = new Date().toISOString();
  writeData('users', store);
  res.json({ success: true, message: 'Profile updated.', data: sanitize(store.users[idx]) });
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/farmer/crops  – all crops (public marketplace view)
// ─────────────────────────────────────────────────────────────────────────────
exports.getCrops = (req, res) => {
  const { crops } = readData('crops');
  const { status, district, cropName } = req.query;

  let result = crops;
  if (status)   result = result.filter(c => c.status === status);
  if (district) result = result.filter(c => c.district.toLowerCase().includes(district.toLowerCase()));
  if (cropName) result = result.filter(c => c.cropName.toLowerCase().includes(cropName.toLowerCase()));

  res.json({ success: true, count: result.length, data: result });
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/farmer/crops  – add a new crop record (farmer's own field)
// Body: { cropName, variety, quantityKg, harvestDate, quality, description }
// ─────────────────────────────────────────────────────────────────────────────
exports.addCrop = (req, res) => {
  const { users } = readData('users');
  const farmer = users.find(u => u.id === req.user.id);

  const { cropName, variety, quantityKg, harvestDate, quality, description } = req.body;
  if (!cropName || !quantityKg) {
    return res.status(400).json({ success: false, message: 'cropName and quantityKg are required.' });
  }

  const store = readData('crops');
  const newCrop = {
    id:          `crp-${uuidv4().slice(0,6)}`,
    farmerId:    req.user.id,
    farmerName:  farmer?.name || req.user.name,
    cropName,
    variety:     variety || '',
    quantityKg:  Number(quantityKg),
    pricePerKg:  null,
    totalValue:  null,
    harvestDate: harvestDate || null,
    village:     farmer?.village || '',
    district:    farmer?.district || '',
    state:       farmer?.state || '',
    status:      'not-listed',
    quality:     quality || '',
    description: description || '',
    images:      [],
    listedAt:    null,
    updatedAt:   new Date().toISOString()
  };
  store.crops.push(newCrop);
  writeData('crops', store);
  res.status(201).json({ success: true, message: 'Crop added.', data: newCrop });
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/farmer/list-crop  – list a crop on the marketplace
// Body: { cropId, pricePerKg }
// ─────────────────────────────────────────────────────────────────────────────
exports.listCrop = (req, res) => {
  const { cropId, pricePerKg } = req.body;
  if (!cropId || !pricePerKg) {
    return res.status(400).json({ success: false, message: 'cropId and pricePerKg are required.' });
  }

  const store = readData('crops');
  const idx   = store.crops.findIndex(c => c.id === cropId && c.farmerId === req.user.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Crop not found or not yours.' });

  store.crops[idx].pricePerKg  = Number(pricePerKg);
  store.crops[idx].totalValue  = store.crops[idx].quantityKg * Number(pricePerKg);
  store.crops[idx].status      = 'available';
  store.crops[idx].listedAt    = new Date().toISOString();
  store.crops[idx].updatedAt   = new Date().toISOString();
  writeData('crops', store);

  res.json({ success: true, message: 'Crop listed on marketplace.', data: store.crops[idx] });
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/farmer/my-listings  – get current farmer's listed crops
// ─────────────────────────────────────────────────────────────────────────────
exports.getMyListings = (req, res) => {
  const { crops } = readData('crops');
  const mine = crops.filter(c => c.farmerId === req.user.id);
  res.json({ success: true, count: mine.length, data: mine });
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/farmer/complaint
// Body: { category, subject, description }
// ─────────────────────────────────────────────────────────────────────────────
exports.submitComplaint = (req, res) => {
  const { category, subject, description } = req.body;
  if (!subject || !description) {
    return res.status(400).json({ success: false, message: 'Subject and description are required.' });
  }

  const { users } = readData('users');
  const farmer = users.find(u => u.id === req.user.id);

  const store = readData('complaints');
  const newComplaint = {
    id:          `cmp-${uuidv4().slice(0,6)}`,
    farmerId:    req.user.id,
    farmerName:  farmer?.name || req.user.name,
    category:    category || 'General',
    subject,
    description,
    status:      'open',
    priority:    'medium',
    assignedTo:  null,
    adminNotes:  '',
    createdAt:   new Date().toISOString(),
    resolvedAt:  null
  };
  store.complaints.push(newComplaint);
  writeData('complaints', store);
  res.status(201).json({ success: true, message: 'Complaint submitted.', data: newComplaint });
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/farmer/loan
// Body: { type, amountRequested, purpose, bankPreference }
// ─────────────────────────────────────────────────────────────────────────────
exports.applyLoan = (req, res) => {
  const { type, amountRequested, purpose, bankPreference } = req.body;
  if (!type || !amountRequested || !purpose) {
    return res.status(400).json({ success: false, message: 'type, amountRequested and purpose are required.' });
  }

  const { users } = readData('users');
  const farmer = users.find(u => u.id === req.user.id);

  const store = readData('loans');
  const newLoan = {
    id:               `lon-${uuidv4().slice(0,6)}`,
    farmerId:         req.user.id,
    farmerName:       farmer?.name || req.user.name,
    type,
    amountRequested:  Number(amountRequested),
    purpose,
    landAcres:        farmer?.landAcres || null,
    bankPreference:   bankPreference || 'Any',
    status:           'pending',
    adminNotes:       '',
    approvedBy:       null,
    createdAt:        new Date().toISOString(),
    processedAt:      null
  };
  store.loans.push(newLoan);
  writeData('loans', store);
  res.status(201).json({ success: true, message: 'Loan application submitted.', data: newLoan });
};
