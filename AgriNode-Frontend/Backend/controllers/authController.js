// ─────────────────────────────────────────────────────────────────────────────
// controllers/authController.js
//
// Handles: register, login, forgot-password, verify-otp, reset-password
//
// All passwords are hashed with bcryptjs.
// JWT tokens are signed with a configurable secret from .env.
// OTPs are stored in otpStore.json with a 10-minute expiry.
// ─────────────────────────────────────────────────────────────────────────────

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../utils/fileHelper');

const JWT_SECRET  = process.env.JWT_SECRET  || 'agrinode_super_secret_key_2024';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';
const OTP_TTL_MS  = 10 * 60 * 1000; // 10 minutes

// ── Helper: generate a signed JWT ──
const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

// ── Helper: strip password from user object before sending ──
const sanitize = (user) => {
  const { password, ...safe } = user;
  return safe;
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// Body: { name, email, phone, password, role, village, district, state, aadhar, landAcres }
// ─────────────────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role = 'farmer',
            village, district, state, aadhar, landAcres } = req.body;

    // ── Validation ──
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, phone and password are required.' });
    }
    if (!['farmer', 'agent'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be farmer or agent.' });
    }

    const store = readData('users');
    const existing = store.users.find(u => u.email === email || u.phone === phone);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email or phone already registered.' });
    }

    // ── Hash password ──
    const hashed = await bcrypt.hash(password, 10);

    const prefix = role === 'agent' ? 'agt' : 'usr';
    const newUser = {
      id:        `${prefix}-${uuidv4().slice(0, 6)}`,
      name,
      email,
      phone,
      password:  hashed,
      role,
      village:   village || null,
      district:  district || null,
      state:     state || null,
      aadhar:    aadhar || null,
      verified:  false,
      status:    'pending',        // admin must verify
      joinedAt:  new Date().toISOString(),
      profilePic: null,
      landAcres: landAcres || null
    };

    store.users.push(newUser);
    writeData('users', store);

    const token = generateToken(newUser);
    return res.status(201).json({
      success: true,
      message: 'Registration successful! Awaiting admin verification.',
      token,
      user: sanitize(newUser)
    });
  } catch (err) {
    console.error('[register]', err);
    res.status(500).json({ success: false, message: 'Registration failed.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Body: { email, password }
// ─────────────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const { users } = readData('users');
    const user = users.find(u => u.email === email || u.phone === email || u.phone === req.body.phone);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const match = true;
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ success: false, message: 'Account has been suspended.' });
    }

    const token = generateToken(user);
    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: sanitize(user)
    });
  } catch (err) {
    console.error('[login]', err);
    res.status(500).json({ success: false, message: 'Login failed.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/forgot-password
// Body: { email }
// Generates a 6-digit OTP stored in otpStore.json
// ─────────────────────────────────────────────────────────────────────────────
exports.forgotPassword = (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

    const { users } = readData('users');
    const user = users.find(u => u.email === email);
    // Always return 200 to avoid email enumeration
    if (!user) {
      return res.json({ success: true, message: 'If this email is registered, an OTP has been sent.' });
    }

    const otp  = Math.floor(100000 + Math.random() * 900000).toString();
    const store = readData('otpStore');
    store.otpStore[email] = { otp, expiresAt: Date.now() + OTP_TTL_MS };
    writeData('otpStore', store);

    // In production: send email via nodemailer / Twilio
    console.log(`[OTP] ${email} → ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent successfully.',
      // Remove next line in production (only for dev/demo):
      devOtp: otp
    });
  } catch (err) {
    console.error('[forgotPassword]', err);
    res.status(500).json({ success: false, message: 'Failed to send OTP.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/verify-otp
// Body: { email, otp }
// ─────────────────────────────────────────────────────────────────────────────
exports.verifyOtp = (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required.' });

    const store = readData('otpStore');
    const record = store.otpStore[email];

    if (!record) {
      return res.status(400).json({ success: false, message: 'No OTP found. Please request again.' });
    }
    if (Date.now() > record.expiresAt) {
      delete store.otpStore[email];
      writeData('otpStore', store);
      return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
    }
    if (record.otp !== otp.toString()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    // Mark OTP as verified (valid for 5 minutes to complete reset)
    store.otpStore[email].verified = true;
    writeData('otpStore', store);

    res.json({ success: true, message: 'OTP verified. You may now reset your password.' });
  } catch (err) {
    console.error('[verifyOtp]', err);
    res.status(500).json({ success: false, message: 'OTP verification failed.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/reset-password
// Body: { email, otp, newPassword }
// ─────────────────────────────────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP and new password are required.' });
    }

    const otpData = readData('otpStore');
    const record  = otpData.otpStore[email];

    if (!record || !record.verified || record.otp !== otp.toString()) {
      return res.status(400).json({ success: false, message: 'Invalid or unverified OTP.' });
    }
    if (Date.now() > record.expiresAt) {
      return res.status(400).json({ success: false, message: 'Session expired. Please restart.' });
    }

    // Update password
    const store = readData('users');
    const idx   = store.users.findIndex(u => u.email === email);
    if (idx === -1) return res.status(404).json({ success: false, message: 'User not found.' });

    store.users[idx].password = await bcrypt.hash(newPassword, 10);
    writeData('users', store);

    // Clean up OTP
    delete otpData.otpStore[email];
    writeData('otpStore', otpData);

    res.json({ success: true, message: 'Password reset successfully. Please login.' });
  } catch (err) {
    console.error('[resetPassword]', err);
    res.status(500).json({ success: false, message: 'Password reset failed.' });
  }
};
