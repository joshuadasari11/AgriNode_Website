// ─────────────────────────────────────────────────────────────────────────────
// controllers/agentController.js
//
// Handles: farmer management, crop view, broadcasts, reports
// ─────────────────────────────────────────────────────────────────────────────

const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../utils/fileHelper');

const sanitize = (user) => { const { password, ...safe } = user; return safe; };

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/agent/farmers  – list all farmers in agent's district
// ─────────────────────────────────────────────────────────────────────────────
exports.getFarmers = (req, res) => {
  const { users } = readData('users');

  // Agent sees their own district by default; query param overrides
  const { users: allUsers } = readData('users');
  const agent = allUsers.find(u => u.id === req.user.id);
  const targetDistrict = req.query.district || agent?.district;

  let farmers = users.filter(u => u.role === 'farmer');
  if (targetDistrict) {
    farmers = farmers.filter(u =>
      u.district?.toLowerCase() === targetDistrict.toLowerCase()
    );
  }

  res.json({ success: true, count: farmers.length, data: farmers.map(sanitize) });
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/agent/farmers  – manually add / link a farmer to agent
// Body: { name, email, phone, village, district, state, landAcres }
// ─────────────────────────────────────────────────────────────────────────────
exports.addFarmer = async (req, res) => {
  const bcrypt = require('bcryptjs');
  const { name, email, phone, village, district, state, landAcres } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'name and phone are required.' });
  }

  const store = readData('users');
  const existing = store.users.find(u => u.phone === phone);
  if (existing) {
    return res.status(409).json({ success: false, message: 'Phone number already registered.' });
  }

  const tempPwd = 'Agri@1234'; // agent-registered farmers get a temp password
  const hashed  = await bcrypt.hash(tempPwd, 10);

  const newFarmer = {
    id:        `usr-${uuidv4().slice(0,6)}`,
    name,
    email:     email || null,
    phone,
    password:  hashed,
    role:      'farmer',
    village:   village || null,
    district:  district || null,
    state:     state || null,
    aadhar:    null,
    verified:  false,
    status:    'pending',
    joinedAt:  new Date().toISOString(),
    profilePic: null,
    landAcres: landAcres || null,
    addedByAgent: req.user.id
  };

  store.users.push(newFarmer);

  // Link farmer to agent's assignedFarmers
  const agentIdx = store.users.findIndex(u => u.id === req.user.id);
  if (agentIdx !== -1) {
    if (!store.users[agentIdx].assignedFarmers) store.users[agentIdx].assignedFarmers = [];
    store.users[agentIdx].assignedFarmers.push(newFarmer.id);
  }

  writeData('users', store);
  res.status(201).json({
    success: true,
    message: `Farmer added. Temporary password: ${tempPwd}`,
    data: sanitize(newFarmer)
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/agent/crops  – all crops (read-only view for agents)
// ─────────────────────────────────────────────────────────────────────────────
exports.getCrops = (req, res) => {
  const { crops } = readData('crops');
  const { status, district } = req.query;
  let result = crops;
  if (status)   result = result.filter(c => c.status === status);
  if (district) result = result.filter(c => c.district?.toLowerCase() === district.toLowerCase());
  res.json({ success: true, count: result.length, data: result });
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/agent/broadcast  – send broadcast to farmers
// Body: { type, title, message, targetVillages, targetDistrict }
// ─────────────────────────────────────────────────────────────────────────────
exports.sendBroadcast = (req, res) => {
  const { type, title, message, targetVillages, targetDistrict } = req.body;
  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'title and message are required.' });
  }

  const { users } = readData('users');
  const agent = users.find(u => u.id === req.user.id);

  const store = readData('broadcasts');
  const newBroadcast = {
    id:             `brd-${uuidv4().slice(0,6)}`,
    agentId:        req.user.id,
    agentName:      agent?.name || req.user.name,
    type:           type || 'general',
    title,
    message,
    targetVillages: targetVillages || [],
    targetDistrict: targetDistrict || agent?.district || '',
    sentAt:         new Date().toISOString(),
    readBy:         [],
    status:         'delivered'
  };
  store.broadcasts.push(newBroadcast);
  writeData('broadcasts', store);
  res.status(201).json({ success: true, message: 'Broadcast sent.', data: newBroadcast });
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/agent/reports  – summary report for agent's district
// ─────────────────────────────────────────────────────────────────────────────
exports.getReports = (req, res) => {
  const { users }      = readData('users');
  const { crops }      = readData('crops');
  const { complaints } = readData('complaints');
  const { loans }      = readData('loans');

  const agent = users.find(u => u.id === req.user.id);
  const district = req.query.district || agent?.district;

  const districtFarmers    = users.filter(u => u.role === 'farmer' && u.district === district);
  const districtCrops      = crops.filter(c => c.district === district);
  const districtComplaints = complaints.filter(c => {
    const f = users.find(u => u.id === c.farmerId);
    return f?.district === district;
  });
  const districtLoans      = loans.filter(l => {
    const f = users.find(u => u.id === l.farmerId);
    return f?.district === district;
  });

  const report = {
    district,
    generatedAt:     new Date().toISOString(),
    farmers: {
      total:    districtFarmers.length,
      verified: districtFarmers.filter(f => f.verified).length,
      pending:  districtFarmers.filter(f => !f.verified).length
    },
    crops: {
      total:     districtCrops.length,
      available: districtCrops.filter(c => c.status === 'available').length,
      sold:      districtCrops.filter(c => c.status === 'sold').length,
      totalValueINR: districtCrops.reduce((sum, c) => sum + (c.totalValue || 0), 0)
    },
    complaints: {
      total:      districtComplaints.length,
      open:       districtComplaints.filter(c => c.status === 'open').length,
      resolved:   districtComplaints.filter(c => c.status === 'resolved').length
    },
    loans: {
      total:    districtLoans.length,
      pending:  districtLoans.filter(l => l.status === 'pending').length,
      approved: districtLoans.filter(l => l.status === 'approved').length,
      rejected: districtLoans.filter(l => l.status === 'rejected').length,
      totalAmountINR: districtLoans.reduce((s, l) => s + (l.amountRequested || 0), 0)
    }
  };

  res.json({ success: true, data: report });
};
