// ─────────────────────────────────────────────────────────────────────────────
// controllers/adminController.js
//
// Admin-only operations:
//   - User/farmer/agent management
//   - Agent approval/rejection
//   - User verification
//   - Complaint management
//   - Loan approval/rejection
//   - Platform statistics
// ─────────────────────────────────────────────────────────────────────────────

const { readData, writeData } = require('../utils/fileHelper');

const sanitize = (user) => { const { password, ...safe } = user; return safe; };

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/users  – all users (paginated)
// ─────────────────────────────────────────────────────────────────────────────
exports.getAllUsers = (req, res) => {
  const { users } = readData('users');
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 20;
  const start = (page - 1) * limit;
  const paginated = users.slice(start, start + limit);
  res.json({
    success: true,
    total: users.length,
    page, limit,
    data: paginated.map(sanitize)
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/farmers
// ─────────────────────────────────────────────────────────────────────────────
exports.getFarmers = (req, res) => {
  const { users } = readData('users');
  const farmers = users.filter(u => u.role === 'farmer');
  res.json({ success: true, count: farmers.length, data: farmers.map(sanitize) });
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/agents
// ─────────────────────────────────────────────────────────────────────────────
exports.getAgents = (req, res) => {
  const { users } = readData('users');
  const agents = users.filter(u => u.role === 'agent');
  res.json({ success: true, count: agents.length, data: agents.map(sanitize) });
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/admin/approve-agent/:id
// ─────────────────────────────────────────────────────────────────────────────
exports.approveAgent = (req, res) => {
  const store = readData('users');
  const idx   = store.users.findIndex(u => u.id === req.params.id && u.role === 'agent');
  if (idx === -1) return res.status(404).json({ success: false, message: 'Agent not found.' });

  store.users[idx].status     = 'active';
  store.users[idx].verified   = true;
  store.users[idx].approvedBy = req.user.id;
  store.users[idx].approvedAt = new Date().toISOString();
  writeData('users', store);
  res.json({ success: true, message: 'Agent approved.', data: sanitize(store.users[idx]) });
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/admin/reject-agent/:id
// Body: { reason }
// ─────────────────────────────────────────────────────────────────────────────
exports.rejectAgent = (req, res) => {
  const store = readData('users');
  const idx   = store.users.findIndex(u => u.id === req.params.id && u.role === 'agent');
  if (idx === -1) return res.status(404).json({ success: false, message: 'Agent not found.' });

  store.users[idx].status         = 'rejected';
  store.users[idx].rejectedBy     = req.user.id;
  store.users[idx].rejectionReason = req.body.reason || '';
  store.users[idx].rejectedAt     = new Date().toISOString();
  writeData('users', store);
  res.json({ success: true, message: 'Agent rejected.', data: sanitize(store.users[idx]) });
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/admin/verify-user/:id
// ─────────────────────────────────────────────────────────────────────────────
exports.verifyUser = (req, res) => {
  const store = readData('users');
  const idx   = store.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'User not found.' });

  store.users[idx].verified   = true;
  store.users[idx].status     = 'active';
  store.users[idx].verifiedBy = req.user.id;
  store.users[idx].verifiedAt = new Date().toISOString();
  writeData('users', store);
  res.json({ success: true, message: 'User verified.', data: sanitize(store.users[idx]) });
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/complaints
// ─────────────────────────────────────────────────────────────────────────────
exports.getComplaints = (req, res) => {
  const { complaints } = readData('complaints');
  const { status } = req.query;
  let result = complaints;
  if (status) result = result.filter(c => c.status === status);
  res.json({ success: true, count: result.length, data: result });
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/admin/resolve-complaint/:id
// Body: { adminNotes }
// ─────────────────────────────────────────────────────────────────────────────
exports.resolveComplaint = (req, res) => {
  const store = readData('complaints');
  const idx   = store.complaints.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Complaint not found.' });

  store.complaints[idx].status     = 'resolved';
  store.complaints[idx].adminNotes = req.body.adminNotes || '';
  store.complaints[idx].assignedTo = req.user.id;
  store.complaints[idx].resolvedAt = new Date().toISOString();
  writeData('complaints', store);
  res.json({ success: true, message: 'Complaint resolved.', data: store.complaints[idx] });
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/loan-requests
// ─────────────────────────────────────────────────────────────────────────────
exports.getLoanRequests = (req, res) => {
  const { loans } = readData('loans');
  const { status } = req.query;
  let result = loans;
  if (status) result = result.filter(l => l.status === status);
  res.json({ success: true, count: result.length, data: result });
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/admin/approve-loan/:id
// Body: { adminNotes }
// ─────────────────────────────────────────────────────────────────────────────
exports.approveLoan = (req, res) => {
  const store = readData('loans');
  const idx   = store.loans.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Loan request not found.' });

  store.loans[idx].status      = 'approved';
  store.loans[idx].adminNotes  = req.body.adminNotes || '';
  store.loans[idx].approvedBy  = req.user.id;
  store.loans[idx].processedAt = new Date().toISOString();
  writeData('loans', store);
  res.json({ success: true, message: 'Loan approved.', data: store.loans[idx] });
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/admin/reject-loan/:id
// Body: { adminNotes }
// ─────────────────────────────────────────────────────────────────────────────
exports.rejectLoan = (req, res) => {
  const store = readData('loans');
  const idx   = store.loans.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Loan request not found.' });

  store.loans[idx].status      = 'rejected';
  store.loans[idx].adminNotes  = req.body.adminNotes || '';
  store.loans[idx].approvedBy  = req.user.id;
  store.loans[idx].processedAt = new Date().toISOString();
  writeData('loans', store);
  res.json({ success: true, message: 'Loan rejected.', data: store.loans[idx] });
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/stats  – platform-wide statistics
// ─────────────────────────────────────────────────────────────────────────────
exports.getStats = (req, res) => {
  const { users }      = readData('users');
  const { crops }      = readData('crops');
  const { complaints } = readData('complaints');
  const { loans }      = readData('loans');
  const { broadcasts } = readData('broadcasts');

  const farmers = users.filter(u => u.role === 'farmer');
  const agents  = users.filter(u => u.role === 'agent');

  const totalCropValueINR = crops.reduce((s, c) => s + (c.totalValue || 0), 0);
  const totalLoanINR      = loans.reduce((s, l) => s + (l.amountRequested || 0), 0);

  // Group farmers by state
  const stateDistribution = farmers.reduce((acc, f) => {
    const s = f.state || 'Unknown';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      generatedAt: new Date().toISOString(),
      users: {
        total:           users.length,
        farmers:         farmers.length,
        agents:          agents.length,
        admins:          users.filter(u => u.role === 'admin').length,
        verified:        users.filter(u => u.verified).length,
        pending:         users.filter(u => !u.verified).length,
        stateDistribution
      },
      crops: {
        total:         crops.length,
        available:     crops.filter(c => c.status === 'available').length,
        sold:          crops.filter(c => c.status === 'sold').length,
        totalValueINR: totalCropValueINR
      },
      complaints: {
        total:      complaints.length,
        open:       complaints.filter(c => c.status === 'open').length,
        inProgress: complaints.filter(c => c.status === 'in-progress').length,
        resolved:   complaints.filter(c => c.status === 'resolved').length
      },
      loans: {
        total:          loans.length,
        pending:        loans.filter(l => l.status === 'pending').length,
        approved:       loans.filter(l => l.status === 'approved').length,
        rejected:       loans.filter(l => l.status === 'rejected').length,
        totalAmountINR: totalLoanINR
      },
      broadcasts: {
        total: broadcasts.length
      }
    }
  });
};
