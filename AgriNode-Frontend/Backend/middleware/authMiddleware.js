// ─────────────────────────────────────────────────────────────────────────────
// middleware/authMiddleware.js
//
// JWT-based authentication & role-based authorization middleware.
//
// Future MySQL migration:
//   In verifyToken, after decoding the JWT, optionally validate the user
//   against the DB instead of the JSON file:
//     const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
// ─────────────────────────────────────────────────────────────────────────────

const jwt   = require('jsonwebtoken');
const { readData } = require('../utils/fileHelper');

const JWT_SECRET = process.env.JWT_SECRET || 'agrinode_super_secret_key_2024';

// ─────────────────────────────────────────────────────────────────────────────
// verifyToken – Validates Bearer JWT from Authorization header.
// Attaches decoded user payload to req.user.
// ─────────────────────────────────────────────────────────────────────────────
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Optionally confirm user still exists in store (guards deleted users)
    const { users } = readData('users');
    const user = users.find(u => u.id === decoded.id);
    if (!user || user.status === 'banned') {
      return res.status(401).json({ success: false, message: 'User account is inactive.' });
    }

    req.user = decoded; // { id, email, role, name }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// requireRole – Role-based access control.
// Usage: router.get('/route', verifyToken, requireRole('admin'), handler)
// ─────────────────────────────────────────────────────────────────────────────
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden. Required role(s): ${roles.join(', ')}.`
      });
    }
    next();
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// optionalAuth – Attaches req.user if token exists, but doesn't block.
// ─────────────────────────────────────────────────────────────────────────────
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
  } catch {
    req.user = null;
  }
  next();
};

module.exports = { verifyToken, requireRole, optionalAuth };
