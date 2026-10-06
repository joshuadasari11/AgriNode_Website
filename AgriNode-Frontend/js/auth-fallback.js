/* ============================================================
   AgriNode – auth-fallback.js
   Frontend Auth with API-first + localStorage fallback.

   Strategy:
   1. Try the real backend API (http://localhost:5000/api/...)
   2. If API is unreachable (network error / timeout):
      → Fall back to localStorage user store
   3. When backend becomes available, API calls automatically win
      (no config changes needed).

   localStorage keys used:
     agri_local_users   – array of registered users (fallback store)
     agri_session_user  – currently logged-in user object
   ============================================================ */

(function (global) {
  'use strict';

  /* ── Config ─────────────────────────────────────────────── */
  var API_BASE    = 'http://localhost:5000/api';
  var API_TIMEOUT = 4000; // ms before falling back

  /* ── LocalStorage helpers ────────────────────────────────── */
  var LS_USERS   = 'agri_local_users';
  var LS_SESSION = 'agri_session_user';

  /** Read the fallback user list (merges seed + registered) */
  function getLocalUsers() {
    try {
      var stored = JSON.parse(localStorage.getItem(LS_USERS) || 'null');
      if (stored && Array.isArray(stored)) return stored;
    } catch (e) { /* bad JSON – re-seed */ }
    // Seed from _store if available
    var seed = (typeof _store !== 'undefined' && _store.users) ? _store.users : _defaultSeedUsers();
    saveLocalUsers(seed);
    return seed;
  }

  function saveLocalUsers(users) {
    try { localStorage.setItem(LS_USERS, JSON.stringify(users)); } catch (e) {}
  }

  function _defaultSeedUsers() {
    // Minimal seed matching the demo credentials shown on login.html
    return [
      { id: 'u-admin', name: 'Admin User',    phone: '9000000000', email: 'admin@agrinode.in', password: 'admin', role: 'Admin',  village: 'HQ',        status: 'approved', joinedAt: '01/01/2025', kycDone: true  },
      { id: 'u-agt01', name: 'Ramesh Kumar',  phone: '9876543210', email: 'ramesh@agrinode.in',password: '1234',  role: 'Agent',  village: 'Kodalipura',status: 'approved', joinedAt: '01/01/2026', kycDone: true  },
      { id: 'u-frm01', name: 'Geetha Devi',   phone: '9111111111', email: 'geetha@agrinode.in', password: 'pass',  role: 'Farmer', village: 'Devapur',   status: 'approved', joinedAt: '10/02/2026', kycDone: true,  agentPhone: '9876543210' },
      { id: 'u-frm02', name: 'Suresh Patil',  phone: '9222222222', email: '',                   password: 'pass',  role: 'Agent',  village: 'Hubli',     status: 'pending',  joinedAt: '18/05/2026', kycDone: false },
      { id: 'u-frm03', name: 'Priya Singh',   phone: '9555555555', email: '',                   password: 'pass',  role: 'Farmer', village: 'Bellary',   status: 'approved', joinedAt: '01/03/2026', kycDone: false, agentPhone: '9876543210' },
      { id: 'u-frm04', name: 'Mohan Rao',     phone: '9666666666', email: '',                   password: 'pass',  role: 'Agent',  village: 'Mysuru',    status: 'pending',  joinedAt: '20/05/2026', kycDone: false }
    ];
  }

  /* ── Session persistence ─────────────────────────────────── */
  /** Save the active session (survives page reload within same tab) */
  function persistSession(user) {
    try { sessionStorage.setItem(LS_SESSION, JSON.stringify(user)); } catch (e) {}
    // Also update in-memory store if setCurrentUser is available
    if (typeof setCurrentUser === 'function') setCurrentUser(user);
  }

  /** Restore session on page load */
  function restoreSession() {
    try {
      var raw = sessionStorage.getItem(LS_SESSION);
      if (!raw) return null;
      var user = JSON.parse(raw);
      if (typeof setCurrentUser === 'function') setCurrentUser(user);
      return user;
    } catch (e) { return null; }
  }

  /** Clear session on logout */
  function clearSession() {
    sessionStorage.removeItem(LS_SESSION);
    if (typeof setCurrentUser === 'function') setCurrentUser(null);
  }

  /* ── API helper with timeout ─────────────────────────────── */
  /**
   * fetchWithTimeout(url, options, timeoutMs)
   * Resolves with { ok, data } or rejects on network error / timeout.
   */
  function fetchWithTimeout(url, options, timeoutMs) {
    return new Promise(function (resolve, reject) {
      var done = false;
      var timer = setTimeout(function () {
        if (!done) { done = true; reject(new Error('timeout')); }
      }, timeoutMs || API_TIMEOUT);

      fetch(url, options)
        .then(function (res) {
          clearTimeout(timer);
          if (done) return;
          done = true;
          res.json().then(function (data) {
            resolve({ ok: res.ok, status: res.status, data: data });
          }).catch(function () {
            resolve({ ok: res.ok, status: res.status, data: {} });
          });
        })
        .catch(function (err) {
          clearTimeout(timer);
          if (!done) { done = true; reject(err); }
        });
    });
  }

  /* ── REGISTER ────────────────────────────────────────────── */
  /**
   * apiRegister(payload)
   * payload: { name, phone, email, village, role, password }
   * Returns Promise<{ success, user, token, source: 'api'|'local', message }>
   */
  function apiRegister(payload) {
    // --- 1. Try real API ---
    return fetchWithTimeout(API_BASE + '/auth/register', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        name:     payload.name,
        email:    payload.email || (payload.phone + '@agrinode.local'),
        phone:    payload.phone,
        password: payload.password,
        role:     (payload.role || 'farmer').toLowerCase(),
        village:  payload.village || '',
        district: payload.district || '',
        state:    payload.state    || ''
      })
    }, API_TIMEOUT)
    .then(function (res) {
      if (res.ok && res.data && res.data.success) {
        // API success – persist session
        if (res.data.token) localStorage.setItem('agri_token', res.data.token);
        persistSession(res.data.user || payload);
        return { success: true, source: 'api', user: res.data.user, token: res.data.token, message: res.data.message };
      }
      // API returned an error (duplicate email etc.)
      return { success: false, source: 'api', message: (res.data && res.data.message) || 'Registration failed.' };
    })
    .catch(function () {
      // --- 2. API unreachable – fall back to localStorage ---
      return _localRegister(payload);
    });
  }

  function _localRegister(payload) {
    var users = getLocalUsers();
    // Check duplicate phone
    var existing = users.find(function (u) { return u.phone === payload.phone; });
    if (existing) {
      return { success: false, source: 'local', message: 'Phone number already registered. Please login.' };
    }

    var newUser = {
      id:        'l-' + Date.now(),
      name:      payload.name,
      phone:     payload.phone,
      email:     payload.email || '',
      password:  payload.password,   // stored plain-text in LS (offline-only, no backend)
      role:      _capitalizeRole(payload.role || 'Farmer'),
      village:   payload.village || '',
      district:  payload.district || '',
      state:     payload.state || '',
      status:    'approved',          // auto-approve for local-only fallback
      kycDone:   false,
      joinedAt:  new Date().toLocaleDateString('en-IN'),
      _localOnly: true               // flag to re-sync when backend comes online
    };

    users.push(newUser);
    saveLocalUsers(users);
    persistSession(newUser);

    return { success: true, source: 'local', user: newUser, message: 'Registered locally (backend offline). Your data will sync when the server is available.' };
  }

  /* ── LOGIN ───────────────────────────────────────────────── */
  /**
   * apiLogin(phone, password, role)
   * Returns Promise<{ success, user, token, source, message }>
   */
  function apiLogin(phone, password, role) {
    // Try to derive an email from local store for the API call
    var localUsers = getLocalUsers();
    var localUser  = localUsers.find(function (u) { return u.phone === phone; });
    var email = (localUser && localUser.email) ? localUser.email : (phone + '@agrinode.local');

    return fetchWithTimeout(API_BASE + '/auth/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email: email, phone: phone, password: password })
    }, API_TIMEOUT)
    .then(function (res) {
      if (res.ok && res.data && res.data.success) {
        var apiUser = res.data.user || {};
        // Normalize role casing to match frontend expectations
        if (apiUser.role) apiUser.role = _capitalizeRole(apiUser.role);
        if (res.data.token) localStorage.setItem('agri_token', res.data.token);
        persistSession(apiUser);
        return { success: true, source: 'api', user: apiUser, token: res.data.token, message: res.data.message };
      }
      
      // If API fails (user not found, wrong password, etc.), check if local demo credentials match
      var localAttempt = _localLogin(phone, password, role);
      if (localAttempt.success) return localAttempt;

      return { success: false, source: 'api', message: (res.data && res.data.message) || 'Invalid credentials.' };
    })
    .catch(function () {
      // --- Fallback: match against localStorage user store ---
      return _localLogin(phone, password, role);
    });
  }

  function _localLogin(phone, password, role) {
    var users = getLocalUsers();
    var user  = users.find(function (u) {
      return u.phone === phone &&
             u.password === password &&
             (!role || u.role === role);
    });

    if (!user) {
      return { success: false, source: 'local', message: 'Invalid credentials. Check phone, password & role.' };
    }
    if (user.status === 'pending') {
      return { success: false, source: 'local', message: 'Your account is pending admin approval.' };
    }

    persistSession(user);
    return { success: true, source: 'local', user: user, message: 'Welcome back, ' + user.name + '! (offline mode)' };
  }

  /* ── OTP LOGIN ───────────────────────────────────────────── */
  /** OTP login – always local fallback (OTP is demo-only) */
  function apiOtpLogin(phone) {
    var users = getLocalUsers();
    var user  = users.find(function (u) { return u.phone === phone; });
    if (!user) return Promise.resolve({ success: false, message: 'Phone number not registered. Please register first.' });
    return Promise.resolve({ success: true, user: user });
  }

  function apiOtpVerify(phone) {
    var users = getLocalUsers();
    var user  = users.find(function (u) { return u.phone === phone; });
    if (!user) return Promise.resolve({ success: false, message: 'User not found.' });
    if (user.status === 'pending') return Promise.resolve({ success: false, message: 'Account pending approval.' });
    persistSession(user);
    return Promise.resolve({ success: true, user: user });
  }

  /* ── Forgot / Reset Password ─────────────────────────────── */
  function apiResetPassword(phone, newPassword) {
    var users = getLocalUsers();
    var idx   = users.findIndex(function (u) { return u.phone === phone; });
    if (idx === -1) return;
    users[idx].password = newPassword;
    saveLocalUsers(users);
    // Also try real API (best-effort, no await)
    var email = users[idx].email || (phone + '@agrinode.local');
    fetch(API_BASE + '/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, otp: '000000', newPassword: newPassword })
    }).catch(function () { /* silent – backend may be offline */ });
  }

  /* ── Logout ──────────────────────────────────────────────── */
  function apiLogout() {
    clearSession();
    localStorage.removeItem('agri_token');
  }

  /* ── Helpers ─────────────────────────────────────────────── */
  function _capitalizeRole(r) {
    var map = { farmer: 'Farmer', agent: 'Agent', admin: 'Admin' };
    return map[r.toLowerCase()] || r;
  }

  /* ── Override getUsers() to merge _store + localStorage ─── */
  function getMergedUsers() {
    var baseUsers  = (typeof _store !== 'undefined' && _store.users) ? _store.users : [];
    var localUsers = getLocalUsers();
    // Merge: prefer localUsers entries, add any base users not in local
    var merged = localUsers.slice();
    baseUsers.forEach(function (bu) {
      var found = merged.find(function (u) { return u.phone === bu.phone; });
      if (!found) merged.push(bu);
    });
    return merged;
  }

  /* ── Exports ─────────────────────────────────────────────── */
  global.AgriAuth = {
    register:       apiRegister,
    login:          apiLogin,
    otpLogin:       apiOtpLogin,
    otpVerify:      apiOtpVerify,
    resetPassword:  apiResetPassword,
    logout:         apiLogout,
    restoreSession: restoreSession,
    clearSession:   clearSession,
    getLocalUsers:  getMergedUsers,
    persistSession: persistSession
  };

}(window));
