/* ============================================================
   AgriNode – script.js  (Shared Core Logic)
   ============================================================ */

// ── TRANSLATIONS ──────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    dashboard:'Dashboard', farmers:'Farmers', crops:'Crops',
    finance:'Finance', market:'Market', admin:'Admin', logout:'Logout',
    myFarm:'My Farm', schemes:'Schemes', payments:'Payments', profile:'Profile',
    marketplace:'Marketplace', analytics:'Analytics', broadcast:'Broadcast',
    controlCenter:'Control Center', users:'Users', verification:'Verification',
    loans:'Loans', complaints:'Complaints', reports:'Reports',
    addFarmer:'Add Farmer', addCrop:'Add Crop', save:'Save',
    cancel:'Cancel', search:'Search...', allVillages:'All Villages',
    approve:'Approve', reject:'Reject', view:'View', delete:'Delete',
    contact:'Contact', download:'Download', apply:'Apply Now',
    sell:'Sell Crop', buy:'Buy', sendBroadcast:'Send Broadcast',
    goodMorning:'Good Morning', goodAfternoon:'Good Afternoon', goodEvening:'Good Evening',
    welcome:'Welcome', noData:'No data found', loading:'Loading...',
    loginSuccess:'Login successful!', saved:'Saved successfully!',
    deleted:'Record deleted', error:'Something went wrong',
    paymentSuccess:'Payment processed successfully!', paymentFailed:'Payment failed. Try again.',
    listingAdded:'Crop listed in marketplace!', broadcastSent:'Broadcast sent to all farmers!',
    highExpense:'⚠️ High expense detected this month',
    lowProfit:'📉 Low profit warning – review your expenses',
    goodProfit:'📈 Great profit this month! Keep it up',
    callAgent:'Call Agent', myCrops:'My Crops', myProfit:'My Profit',
    marketPrices:'Market Prices', voiceAssist:'Voice Assistant',
    report:'Download Report', totalFarmers:'Total Farmers',
    activeCrops:'Active Crops', pendingLoans:'Pending Loans',
    totalRevenue:'Total Revenue', monthlyIncome:'Monthly Income',
    weatherForecast:'Weather Forecast', govtAlerts:'Govt Alerts',
    nearbyBuyers:'Nearby Buyers', quickActions:'Quick Actions',
    sellCrop:'Sell My Crop', buyerListings:'Buyer Listings',
    pricePerQtl:'Price / Qtl', quantity:'Quantity', quality:'Quality',
    available:'Available', soldOut:'Sold Out', contactBuyer:'Contact Buyer',
    eligibility:'Eligibility', deadline:'Deadline', benefit:'Benefit',
    applyScheme:'Apply for Scheme', schemeDetails:'View Details',
    paymentMethod:'Payment Method', upi:'UPI', debitCard:'Debit Card',
    creditCard:'Credit Card', netBanking:'Net Banking', cashOnDelivery:'Cash on Delivery',
    amount:'Amount (₹)', transactionHistory:'Transaction History',
    payNow:'Pay Now', enterAmount:'Enter amount',
    temperature:'Temperature', humidity:'Humidity',
    windSpeed:'Wind Speed', farmingAdvisory:'Farming Advisory',
    verifyUser:'Verify User', approveLoan:'Approve Loan',
    resolveComplaint:'Resolve', userManagement:'User Management',
    verificationCenter:'Verification Center', loanApproval:'Loan Approval',
    complaintMgmt:'Complaint Management', monitoringDashboard:'Monitoring Dashboard',
    addToCart:'Add to Cart', checkout:'Checkout', cart:'Cart',
    seeds:'Seeds', fertilizers:'Fertilizers', pesticides:'Pesticides', tractors:'Tractors'
  },
  hi: {
    dashboard:'डैशबोर्ड', farmers:'किसान', crops:'फसलें',
    finance:'वित्त', market:'बाज़ार', admin:'प्रशासन', logout:'लॉगआउट',
    myFarm:'मेरी खेती', schemes:'योजनाएं', payments:'भुगतान', profile:'प्रोफ़ाइल',
    marketplace:'बाज़ार', analytics:'विश्लेषण', broadcast:'प्रसारण',
    controlCenter:'नियंत्रण केंद्र', users:'उपयोगकर्ता', verification:'सत्यापन',
    loans:'ऋण', complaints:'शिकायतें', reports:'रिपोर्ट',
    addFarmer:'किसान जोड़ें', addCrop:'फसल जोड़ें', save:'सहेजें',
    cancel:'रद्द करें', search:'खोजें...', allVillages:'सभी गाँव',
    approve:'स्वीकृत करें', reject:'अस्वीकार करें', view:'देखें', delete:'हटाएं',
    contact:'संपर्क करें', download:'डाउनलोड', apply:'अभी आवेदन करें',
    sell:'फसल बेचें', buy:'खरीदें', sendBroadcast:'प्रसारण भेजें',
    goodMorning:'शुभ प्रभात', goodAfternoon:'शुभ दोपहर', goodEvening:'शुभ संध्या',
    welcome:'स्वागत', noData:'कोई डेटा नहीं', loading:'लोड हो रहा है...',
    loginSuccess:'लॉगिन सफल!', saved:'सफलतापूर्वक सहेजा!',
    deleted:'रिकॉर्ड हटाया गया', error:'कुछ गलत हो गया',
    paymentSuccess:'भुगतान सफलतापूर्वक हुआ!', paymentFailed:'भुगतान विफल। पुनः प्रयास करें।',
    listingAdded:'फसल बाज़ार में सूचीबद्ध!', broadcastSent:'सभी किसानों को प्रसारण भेजा!',
    highExpense:'⚠️ इस महीने अधिक खर्च', lowProfit:'📉 कम लाभ – खर्च जांचें',
    goodProfit:'📈 इस महीने अच्छा लाभ!',
    callAgent:'एजेंट को कॉल करें', myCrops:'मेरी फसलें', myProfit:'मेरा लाभ',
    marketPrices:'बाज़ार भाव', voiceAssist:'आवाज़ सहायक',
    report:'रिपोर्ट डाउनलोड', totalFarmers:'कुल किसान',
    activeCrops:'सक्रिय फसलें', pendingLoans:'लंबित ऋण',
    totalRevenue:'कुल आय', monthlyIncome:'मासिक आय',
    weatherForecast:'मौसम पूर्वानुमान', govtAlerts:'सरकारी सूचनाएं',
    nearbyBuyers:'नज़दीकी खरीदार', quickActions:'त्वरित कार्य',
    sellCrop:'फसल बेचें', buyerListings:'खरीदार सूची',
    pricePerQtl:'मूल्य / क्विंटल', quantity:'मात्रा', quality:'गुणवत्ता',
    available:'उपलब्ध', soldOut:'बिक गया', contactBuyer:'खरीदार से संपर्क',
    eligibility:'पात्रता', deadline:'अंतिम तिथि', benefit:'लाभ',
    applyScheme:'योजना के लिए आवेदन करें', schemeDetails:'विवरण देखें',
    paymentMethod:'भुगतान विधि', upi:'यूपीआई', debitCard:'डेबिट कार्ड',
    creditCard:'क्रेडिट कार्ड', netBanking:'नेट बैंकिंग', cashOnDelivery:'कैश ऑन डिलीवरी',
    amount:'राशि (₹)', transactionHistory:'लेनदेन इतिहास',
    payNow:'अभी भुगतान करें', enterAmount:'राशि दर्ज करें',
    temperature:'तापमान', humidity:'आर्द्रता',
    windSpeed:'हवा की गति', farmingAdvisory:'कृषि सलाह',
    verifyUser:'उपयोगकर्ता सत्यापित करें', approveLoan:'ऋण स्वीकृत करें',
    resolveComplaint:'समाधान करें', userManagement:'उपयोगकर्ता प्रबंधन',
    verificationCenter:'सत्यापन केंद्र', loanApproval:'ऋण स्वीकृति',
    complaintMgmt:'शिकायत प्रबंधन', monitoringDashboard:'निगरानी डैशबोर्ड',
    addToCart:'कार्ट में जोड़ें', checkout:'चेकआउट', cart:'कार्ट',
    seeds:'बीज', fertilizers:'उर्वरक', pesticides:'कीटनाशक', tractors:'ट्रैक्टर'
  },
  kn: {
    dashboard:'ಡ್ಯಾಶ್\u200cಬೋರ್ಡ್', farmers:'ರೈತರು', crops:'ಬೆಳೆಗಳು',
    finance:'ಹಣಕಾಸು', market:'ಮಾರುಕಟ್ಟೆ', admin:'ನಿರ್ವಾಹಕ', logout:'ಲಾಗ್ ಔಟ್',
    myFarm:'ನನ್ನ ಜಮೀನು', schemes:'ಯೋಜನೆಗಳು', payments:'ಪಾವತಿಗಳು', profile:'ಪ್ರೊಫೈಲ್',
    marketplace:'ಮಾರುಕಟ್ಟೆ', analytics:'ವಿಶ್ಲೇಷಣೆ', broadcast:'ಪ್ರಸಾರ',
    controlCenter:'ನಿಯಂತ್ರಣ ಕೇಂದ್ರ', users:'ಬಳಕೆದಾರರು', verification:'ಪರಿಶೀಲನೆ',
    loans:'ಸಾಲಗಳು', complaints:'ದೂರುಗಳು', reports:'ವರದಿಗಳು',
    addFarmer:'ರೈತ ಸೇರಿಸಿ', addCrop:'ಬೆಳೆ ಸೇರಿಸಿ', save:'ಉಳಿಸಿ',
    cancel:'ರದ್ದುಮಾಡಿ', search:'ಹುಡುಕಿ...', allVillages:'ಎಲ್ಲಾ ಹಳ್ಳಿಗಳು',
    approve:'ಅನುಮೋದಿಸಿ', reject:'ತಿರಸ್ಕರಿಸಿ', view:'ನೋಡಿ', delete:'ಅಳಿಸಿ',
    contact:'ಸಂಪರ್ಕಿಸಿ', download:'ಡೌನ್\u200cಲೋಡ್', apply:'ಈಗ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    sell:'ಬೆಳೆ ಮಾರಿ', buy:'ಖರೀದಿಸಿ', sendBroadcast:'ಪ್ರಸಾರ ಕಳುಹಿಸಿ',
    goodMorning:'ಶುಭ ಬೆಳಿಗ್ಗೆ', goodAfternoon:'ಶುಭ ಮಧ್ಯಾಹ್ನ', goodEvening:'ಶುಭ ಸಂಜೆ',
    welcome:'ಸ್ವಾಗತ', noData:'ಡೇಟಾ ಇಲ್ಲ', loading:'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    loginSuccess:'ಲಾಗಿನ್ ಯಶಸ್ವಿ!', saved:'ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!',
    deleted:'ದಾಖಲೆ ತೆಗೆದುಹಾಕಲಾಗಿದೆ', error:'ತಪ್ಪಾಗಿದೆ',
    paymentSuccess:'ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ!', paymentFailed:'ಪಾವತಿ ವಿಫಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    listingAdded:'ಬೆಳೆ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಪಟ್ಟಿ!', broadcastSent:'ಎಲ್ಲಾ ರೈತರಿಗೆ ಪ್ರಸಾರ!',
    highExpense:'⚠️ ಈ ತಿಂಗಳು ಹೆಚ್ಚು ಖರ್ಚು', lowProfit:'📉 ಕಡಿಮೆ ಲಾಭ – ಖರ್ಚು ಪರಿಶೀಲಿಸಿ',
    goodProfit:'📈 ಈ ತಿಂಗಳು ಉತ್ತಮ ಲಾಭ!',
    callAgent:'ಏಜೆಂಟ್\u200cಗೆ ಕರೆ ಮಾಡಿ', myCrops:'ನನ್ನ ಬೆಳೆಗಳು', myProfit:'ನನ್ನ ಲಾಭ',
    marketPrices:'ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು', voiceAssist:'ಧ್ವನಿ ಸಹಾಯಕ',
    report:'ವರದಿ ಡೌನ್\u200cಲೋಡ್', totalFarmers:'ಒಟ್ಟು ರೈತರು',
    activeCrops:'ಸಕ್ರಿಯ ಬೆಳೆಗಳು', pendingLoans:'ಬಾಕಿ ಸಾಲಗಳು',
    totalRevenue:'ಒಟ್ಟು ಆದಾಯ', monthlyIncome:'ಮಾಸಿಕ ಆದಾಯ',
    weatherForecast:'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ', govtAlerts:'ಸರ್ಕಾರಿ ಎಚ್ಚರಿಕೆ',
    nearbyBuyers:'ಸಮೀಪದ ಖರೀದಿದಾರರು', quickActions:'ತ್ವರಿತ ಕ್ರಿಯೆ',
    sellCrop:'ಬೆಳೆ ಮಾರಾಟ', buyerListings:'ಖರೀದಿದಾರರ ಪಟ್ಟಿ',
    pricePerQtl:'ಬೆಲೆ / ಕ್ವಿಂಟಾಲ್', quantity:'ಪ್ರಮಾಣ', quality:'ಗುಣಮಟ್ಟ',
    available:'ಲಭ್ಯವಿದೆ', soldOut:'ಮಾರಾಟವಾಗಿದೆ', contactBuyer:'ಖರೀದಿದಾರ ಸಂಪರ್ಕ',
    eligibility:'ಅರ್ಹತೆ', deadline:'ಕೊನೆಯ ದಿನಾಂಕ', benefit:'ಪ್ರಯೋಜನ',
    applyScheme:'ಯೋಜನೆಗೆ ಅರ್ಜಿ', schemeDetails:'ವಿವರ ನೋಡಿ',
    paymentMethod:'ಪಾವತಿ ವಿಧಾನ', upi:'ಯುಪಿಐ', debitCard:'ಡೆಬಿಟ್ ಕಾರ್ಡ್',
    creditCard:'ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್', netBanking:'ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್', cashOnDelivery:'ಕ್ಯಾಶ್ ಆನ್ ಡೆಲಿವರಿ',
    amount:'ಮೊತ್ತ (₹)', transactionHistory:'ವ್ಯವಹಾರ ಇತಿಹಾಸ',
    payNow:'ಈಗ ಪಾವತಿಸಿ', enterAmount:'ಮೊತ್ತ ನಮೂದಿಸಿ',
    temperature:'ತಾಪಮಾನ', humidity:'ಆರ್ದ್ರತೆ',
    windSpeed:'ಗಾಳಿ ವೇಗ', farmingAdvisory:'ಕೃಷಿ ಸಲಹೆ',
    verifyUser:'ಬಳಕೆದಾರ ಪರಿಶೀಲಿಸಿ', approveLoan:'ಸಾಲ ಅನುಮೋದಿಸಿ',
    resolveComplaint:'ಪರಿಹರಿಸಿ', userManagement:'ಬಳಕೆದಾರ ನಿರ್ವಹಣೆ',
    verificationCenter:'ಪರಿಶೀಲನಾ ಕೇಂದ್ರ', loanApproval:'ಸಾಲ ಅನುಮೋದನೆ',
    complaintMgmt:'ದೂರು ನಿರ್ವಹಣೆ', monitoringDashboard:'ಮೇಲ್ವಿಚಾರಣಾ ಡ್ಯಾಶ್\u200cಬೋರ್ಡ್',
    addToCart:'ಕಾರ್ಟ್\u200cಗೆ ಸೇರಿಸಿ', checkout:'ಚೆಕ್\u200cಔಟ್', cart:'ಕಾರ್ಟ್',
    seeds:'ಬೀಜಗಳು', fertilizers:'ಗೊಬ್ಬರಗಳು', pesticides:'ಕೀಟನಾಶಕ', tractors:'ಟ್ರ್ಯಾಕ್ಟರ್'
  }
};

// ── LANGUAGE ──────────────────────────────────────────────────
function getLang() { return localStorage.getItem('agri_lang') || 'en'; }
function setLang(lang) {
  localStorage.setItem('agri_lang', lang);
  applyTranslations(lang);
}
// Called by: <select onchange="changeLang(this.value)"> on all pages
function changeLang(lang) {
  localStorage.setItem('agri_lang', lang);
  document.querySelectorAll('.lang-select,.lang-sel,#langSelect').forEach(function(el){ el.value=lang; });
  applyTranslations(lang);
  if (typeof renderGreeting==='function') renderGreeting();
}
function applyTranslations(lang) {
  var tr = TRANSLATIONS[lang] || TRANSLATIONS.en;
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    if (!tr[key]) return;
    if (el.tagName==='INPUT'||el.tagName==='TEXTAREA') { el.placeholder=tr[key]; }
    else { el.textContent=tr[key]; }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
    var key=el.getAttribute('data-i18n-placeholder');
    if (tr[key]) el.placeholder=tr[key];
  });
}
function initLang() {
  var lang=getLang();
  document.querySelectorAll('.lang-select,.lang-sel,#langSelect').forEach(function(el){ el.value=lang; });
  applyTranslations(lang);
}
function t(key) { return (TRANSLATIONS[getLang()]||TRANSLATIONS.en)[key]||key; }

// ── THEME ─────────────────────────────────────────────────────
function initTheme() {
  const theme = localStorage.getItem('agri_theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
}
function toggleDark() {
  const cur  = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('agri_theme', next);
}

// ── TOAST ─────────────────────────────────────────────────────
function showToast(msg, type) {
  type = type || '';
  let tc = document.getElementById('toast-container');
  if (!tc) { tc = document.createElement('div'); tc.id = 'toast-container'; document.body.appendChild(tc); }
  const c = document.createElement('div');
  c.className = 'toast-msg ' + type;
  const icon = type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'check-circle';
  c.innerHTML = '<i class="fa fa-' + icon + '"></i> ' + msg;
  tc.appendChild(c);
  setTimeout(function() { c.remove(); }, 3500);
}

// ── SPINNER ───────────────────────────────────────────────────
function showSpinner() { var s = document.getElementById('global-spinner'); if (s) s.style.display = 'flex'; }
function hideSpinner() { var s = document.getElementById('global-spinner'); if (s) s.style.display = 'none'; }

// ── OFFLINE ───────────────────────────────────────────────────
function initOffline() {
  var b = document.getElementById('offline-banner');
  if (!b) return;
  var check = function() { b.style.display = navigator.onLine ? 'none' : 'block'; };
  window.addEventListener('online', check);
  window.addEventListener('offline', check);
  check();
}

// ── SIDEBAR ───────────────────────────────────────────────────
function toggleSidebar() {
  var sb = document.getElementById('sidebar');
  var ov = document.getElementById('sidebarOverlay');
  if (sb) sb.classList.toggle('open');
  if (ov) ov.classList.toggle('open');
}

// ── AUTH (session persisted in sessionStorage) ────────────────
var _currentUser = null;
function getCurrentUser() {
  if (_currentUser) return _currentUser;
  // Restore from sessionStorage (survives page navigation within same tab)
  try {
    var raw = sessionStorage.getItem('agri_session_user');
    if (raw) { _currentUser = JSON.parse(raw); }
  } catch (e) {}
  return _currentUser;
}
function setCurrentUser(user) {
  _currentUser = user;
  try {
    if (user) { sessionStorage.setItem('agri_session_user', JSON.stringify(user)); }
    else       { sessionStorage.removeItem('agri_session_user'); }
  } catch (e) {}
}
function requireAuth(role) {
  var cu = getCurrentUser();
  if (!cu) { window.location.href = 'login.html'; return null; }
  if (role && cu.role !== role) { window.location.href = 'dashboard.html'; return null; }
  return cu;
}
function doLogout() {
  localStorage.removeItem('cu');
  localStorage.removeItem('agri_token');
  sessionStorage.removeItem('agri_session_user');
  if (typeof AgriAuth !== 'undefined') AgriAuth.clearSession();
  showToast('Logged out successfully');
  setTimeout(function() { window.location.href = 'login.html'; }, 600);
}
function redirectByRole(role) {
  if (role === 'Admin')        window.location.href = 'admin.html';
  else if (role === 'Farmer')  window.location.href = 'farmer-dashboard.html';
  else                         window.location.href = 'agent-dashboard.html';
}

// ── IN-MEMORY DATA STORE ──────────────────────────────────────
var _store = {
  users: [
    { name: 'Ramesh Kumar',  phone: '9876543210', password: '1234',  role: 'Agent',  village: 'Kodalipura', status: 'approved', joinedAt: '01/01/2026', kycDone: true  },
    { name: 'Admin User',    phone: '9000000000', password: 'admin', role: 'Admin',  village: 'HQ',         status: 'approved', joinedAt: '01/01/2025', kycDone: true  },
    { name: 'Geetha Devi',  phone: '9111111111', password: 'pass',  role: 'Farmer', village: 'Devapur',    status: 'approved', joinedAt: '10/02/2026', kycDone: true,  agentPhone: '9876543210' },
    { name: 'Suresh Patil', phone: '9222222222', password: 'pass',  role: 'Agent',  village: 'Hubli',      status: 'pending',  joinedAt: '18/05/2026', kycDone: false },
    { name: 'Priya Singh',  phone: '9555555555', password: 'pass',  role: 'Farmer', village: 'Bellary',    status: 'approved', joinedAt: '01/03/2026', kycDone: false, agentPhone: '9876543210' },
    { name: 'Mohan Rao',    phone: '9666666666', password: 'pass',  role: 'Agent',  village: 'Mysuru',     status: 'pending',  joinedAt: '20/05/2026', kycDone: false }
  ],
  farmers: [
    { id: 1, name: 'Geetha Devi',   phone: '9111111111', village: 'Devapur',    crop: 'Rice',      land: '3', age: '45', addedAt: '01/04/2026', kycDone: true  },
    { id: 2, name: 'Prakash Nair',  phone: '9333333333', village: 'Kodalipura', crop: 'Wheat',     land: '5', age: '52', addedAt: '05/04/2026', kycDone: true  },
    { id: 3, name: 'Laxmi Bai',    phone: '9444444444', village: 'Devapur',    crop: 'Maize',     land: '2', age: '38', addedAt: '10/04/2026', kycDone: false },
    { id: 4, name: 'Priya Singh',   phone: '9555555555', village: 'Bellary',    crop: 'Cotton',    land: '4', age: '34', addedAt: '15/04/2026', kycDone: false },
    { id: 5, name: 'Venkat Reddy',  phone: '9777777777', village: 'Raichur',    crop: 'Sugarcane', land: '7', age: '60', addedAt: '20/04/2026', kycDone: true  }
  ],
  crops: [
    { id: 101, farmerId: 1, farmerName: 'Geetha Devi',  cropName: 'Rice',      season: 'Kharif', qty: '40', area: '3', sowDate: '2026-06-01', harvestDate: '2026-11-15', addedAt: '01/04/2026' },
    { id: 102, farmerId: 2, farmerName: 'Prakash Nair', cropName: 'Wheat',     season: 'Rabi',   qty: '60', area: '5', sowDate: '2026-11-15', harvestDate: '2027-03-20', addedAt: '05/04/2026' },
    { id: 103, farmerId: 3, farmerName: 'Laxmi Bai',   cropName: 'Maize',     season: 'Kharif', qty: '30', area: '2', sowDate: '2026-06-15', harvestDate: '2026-10-10', addedAt: '10/04/2026' },
    { id: 104, farmerId: 4, farmerName: 'Priya Singh',  cropName: 'Cotton',    season: 'Kharif', qty: '25', area: '4', sowDate: '2026-05-20', harvestDate: '2026-12-01', addedAt: '15/04/2026' },
    { id: 105, farmerId: 5, farmerName: 'Venkat Reddy', cropName: 'Sugarcane', season: 'Annual', qty: '120',area: '7', sowDate: '2026-01-10', harvestDate: '2027-01-10', addedAt: '20/04/2026' }
  ],
  finance: [
    { id: 201, farmerId: 1, farmerName: 'Geetha Devi',  type: 'income',  amount: 88000,  category: 'Crop Sale',     date: '2026-03-10' },
    { id: 202, farmerId: 1, farmerName: 'Geetha Devi',  type: 'expense', amount: 22000,  category: 'Fertilizer',    date: '2026-03-05' },
    { id: 203, farmerId: 2, farmerName: 'Prakash Nair', type: 'income',  amount: 126000, category: 'Crop Sale',     date: '2026-03-20' },
    { id: 204, farmerId: 2, farmerName: 'Prakash Nair', type: 'expense', amount: 41000,  category: 'Labour',        date: '2026-03-18' },
    { id: 205, farmerId: 4, farmerName: 'Priya Singh',  type: 'income',  amount: 64000,  category: 'Cotton Sale',   date: '2026-04-12' },
    { id: 206, farmerId: 4, farmerName: 'Priya Singh',  type: 'expense', amount: 18000,  category: 'Pesticides',    date: '2026-04-08' },
    { id: 207, farmerId: 5, farmerName: 'Venkat Reddy', type: 'income',  amount: 210000, category: 'Sugarcane Sale',date: '2026-04-20' },
    { id: 208, farmerId: 5, farmerName: 'Venkat Reddy', type: 'expense', amount: 55000,  category: 'Irrigation',    date: '2026-04-15' }
  ],
  schemes: [
    { id: 'S1', name: 'PM-KISAN Samman Nidhi',      ministry: 'Ministry of Agriculture',       benefit: '₹6,000/year in 3 instalments',        eligibility: 'All landholding farmers',            deadline: '30 Jun 2026', category: 'subsidy',        tag: 'PM Scheme',   icon: '🌾', applied: false },
    { id: 'S2', name: 'Kisan Credit Card (KCC)',     ministry: 'NABARD / RBI',                  benefit: 'Up to ₹3 Lakh at 4% interest',         eligibility: 'Farmers with land records',           deadline: 'Open',        category: 'loan',           tag: 'Credit',      icon: '💳', applied: false },
    { id: 'S3', name: 'Soil Health Card Scheme',     ministry: 'Dept. of Agriculture',          benefit: 'Free soil testing & advisory',          eligibility: 'All farmers',                         deadline: 'Open',        category: 'advisory',       tag: 'Free',        icon: '🌱', applied: true  },
    { id: 'S4', name: 'PM Fasal Bima Yojana',        ministry: 'Ministry of Agriculture',       benefit: 'Crop insurance at 1.5–2% premium',      eligibility: 'Farmers with Aadhar & bank account', deadline: '31 Jul 2026', category: 'insurance',      tag: 'Insurance',   icon: '🛡️', applied: false },
    { id: 'S5', name: 'Drip Irrigation Subsidy',     ministry: 'State Agriculture Dept.',       benefit: '50–75% subsidy on drip systems',        eligibility: 'SC/ST/Small farmers',                 deadline: '15 Aug 2026', category: 'subsidy',        tag: 'State Scheme',icon: '💧', applied: false },
    { id: 'S6', name: 'e-NAM – National Agri Market',ministry: 'Ministry of Agriculture',       benefit: 'Direct online sale to buyers',          eligibility: 'Registered farmers',                  deadline: 'Open',        category: 'market',         tag: 'e-Market',    icon: '🏪', applied: true  },
    { id: 'S7', name: 'PMGSY – Rural Roads',         ministry: 'Ministry of Rural Development', benefit: 'All-weather road to village',           eligibility: 'Villages 500+ population',            deadline: 'Open',        category: 'infrastructure', tag: 'Infrastructure',icon:'🛣️',applied: false }
  ],
  loans: [
    { id: 'L001', farmerId: 1, farmerName: 'Geetha Devi',  type: 'kcc',       amount: 150000, bank: 'SBI', status: 'disbursed', appliedAt: '01/03/2026', rate: '4%',   tenure: '12 months', progress: 100 },
    { id: 'L002', farmerId: 2, farmerName: 'Prakash Nair', type: 'agri',      amount: 200000, bank: 'PNB', status: 'approved',  appliedAt: '10/04/2026', rate: '7%',   tenure: '24 months', progress: 70  },
    { id: 'L003', farmerId: 4, farmerName: 'Priya Singh',  type: 'equipment', amount: 80000,  bank: 'BOI', status: 'pending',   appliedAt: '15/05/2026', rate: '8.5%', tenure: '18 months', progress: 30  },
    { id: 'L004', farmerId: 5, farmerName: 'Venkat Reddy', type: 'kcc',       amount: 300000, bank: 'SBI', status: 'disbursed', appliedAt: '05/02/2026', rate: '4%',   tenure: '12 months', progress: 100 }
  ],
  complaints: [
    { id: 'CMP001', farmerId: 1, farmerName: 'Geetha Devi',  category: 'Water Supply',    subject: 'Canal blocked at Devapur',                status: 'inprogress', priority: 'high',   createdAt: '10/05/2026', assignedTo: 'Block Dev. Officer'    },
    { id: 'CMP002', farmerId: 2, farmerName: 'Prakash Nair', category: 'Fertilizer',      subject: 'Urea not available at local store',        status: 'open',       priority: 'medium', createdAt: '15/05/2026', assignedTo: 'Unassigned'             },
    { id: 'CMP003', farmerId: 4, farmerName: 'Priya Singh',  category: 'Market Price',    subject: 'APMC not giving correct cotton rate',      status: 'resolved',   priority: 'high',   createdAt: '02/05/2026', assignedTo: 'APMC Officer'           },
    { id: 'CMP004', farmerId: 5, farmerName: 'Venkat Reddy', category: 'Power Supply',    subject: 'No electricity for 3 days in Raichur',    status: 'open',       priority: 'high',   createdAt: '18/05/2026', assignedTo: 'Unassigned'             },
    { id: 'CMP005', farmerId: 3, farmerName: 'Laxmi Bai',   category: 'Loan Disbursement',subject: 'KCC loan still not credited to account',  status: 'inprogress', priority: 'medium', createdAt: '20/05/2026', assignedTo: 'Bank Liaison Officer'   }
  ],
  marketplace: [
    { id: 'MP001', farmerId: 1, farmerName: 'Geetha Devi',  village: 'Devapur',    cropName: 'Rice',      cropIcon: '🌾', qty: 25, unit: 'qtl', askPrice: 2400, quality: 'Grade A', available: true,  listedAt: '20/05/2026', contact: '9111111111' },
    { id: 'MP002', farmerId: 2, farmerName: 'Prakash Nair', village: 'Kodalipura', cropName: 'Wheat',     cropIcon: '🌾', qty: 40, unit: 'qtl', askPrice: 2200, quality: 'Grade A', available: true,  listedAt: '18/05/2026', contact: '9333333333' },
    { id: 'MP003', farmerId: 4, farmerName: 'Priya Singh',  village: 'Bellary',    cropName: 'Cotton',    cropIcon: '🌿', qty: 15, unit: 'qtl', askPrice: 6600, quality: 'Grade B', available: true,  listedAt: '22/05/2026', contact: '9555555555' },
    { id: 'MP004', farmerId: 3, farmerName: 'Laxmi Bai',   village: 'Devapur',    cropName: 'Maize',     cropIcon: '🌽', qty: 20, unit: 'qtl', askPrice: 1800, quality: 'Grade A', available: false, listedAt: '10/05/2026', contact: '9444444444' },
    { id: 'MP005', farmerId: 5, farmerName: 'Venkat Reddy', village: 'Raichur',    cropName: 'Sugarcane', cropIcon: '🎋', qty: 80, unit: 'ton', askPrice: 380,  quality: 'Grade A', available: true,  listedAt: '21/05/2026', contact: '9777777777' }
  ],
  buyers: [
    { id: 'B001', name: 'Shree Agro Traders',   type: 'Trader',   location: 'Hubli',     distance: 12, crops: ['Rice','Wheat','Maize'],   rating: 4.8, phone: '8001001001', verified: true  },
    { id: 'B002', name: 'Karnataka Rice Mills',  type: 'Miller',   location: 'Bellary',   distance: 28, crops: ['Rice'],                   rating: 4.5, phone: '8002002002', verified: true  },
    { id: 'B003', name: 'Deccan Cotton Corp.',   type: 'Exporter', location: 'Raichur',   distance: 45, crops: ['Cotton'],                 rating: 4.9, phone: '8003003003', verified: true  },
    { id: 'B004', name: 'Nandini Sugar Works',   type: 'Factory',  location: 'Mandya',    distance: 60, crops: ['Sugarcane'],              rating: 4.6, phone: '8004004004', verified: true  },
    { id: 'B005', name: 'Fresh Veggie Mart',     type: 'Retailer', location: 'Mysuru',    distance: 35, crops: ['Vegetables','Maize'],    rating: 4.2, phone: '8005005005', verified: false },
    { id: 'B006', name: 'AgroPlus Exports Ltd.', type: 'Exporter', location: 'Bangalore', distance: 80, crops: ['Rice','Wheat','Cotton'], rating: 4.7, phone: '8006006006', verified: true  }
  ],
  apmc: [
    { id: 'A001', name: 'Hubli APMC',   dist: 'Dharwad', distance: 12, status: 'open',   commodities: [{name:'Rice',min:2100,max:2400,modal:2280,trend:'up'},{name:'Wheat',min:1950,max:2200,modal:2080,trend:'flat'},{name:'Maize',min:1600,max:1820,modal:1720,trend:'down'}] },
    { id: 'A002', name: 'Bellary APMC', dist: 'Bellary', distance: 28, status: 'open',   commodities: [{name:'Cotton',min:6100,max:6700,modal:6450,trend:'up'},{name:'Groundnut',min:4800,max:5200,modal:5020,trend:'flat'}] },
    { id: 'A003', name: 'Raichur APMC', dist: 'Raichur', distance: 45, status: 'open',   commodities: [{name:'Paddy',min:2000,max:2280,modal:2180,trend:'up'},{name:'Jowar',min:2800,max:3100,modal:2950,trend:'flat'},{name:'Tur Dal',min:6200,max:7000,modal:6600,trend:'down'}] },
    { id: 'A004', name: 'Mysuru APMC',  dist: 'Mysuru',  distance: 38, status: 'open',   commodities: [{name:'Sugarcane',min:320,max:400,modal:360,trend:'up'},{name:'Potato',min:1200,max:1500,modal:1380,trend:'flat'}] },
    { id: 'A005', name: 'Gadag APMC',   dist: 'Gadag',   distance: 55, status: 'closed', commodities: [{name:'Wheat',min:1980,max:2250,modal:2100,trend:'flat'},{name:'Sunflower',min:5400,max:5900,modal:5680,trend:'up'}] }
  ],
  auditLogs: [
    { id: 'LOG001', action: 'login',   user: 'Admin User',   role: 'Admin',  detail: 'Admin logged in',                    ip: '192.168.1.1',  ts: '23/05/2026 18:01' },
    { id: 'LOG002', action: 'approve', user: 'Admin User',   role: 'Admin',  detail: 'Agent Ramesh Kumar approved',         ip: '192.168.1.1',  ts: '23/05/2026 17:55' },
    { id: 'LOG003', action: 'create',  user: 'Ramesh Kumar', role: 'Agent',  detail: 'New farmer Priya Singh added',        ip: '10.0.0.5',     ts: '23/05/2026 16:30' },
    { id: 'LOG004', action: 'update',  user: 'Ramesh Kumar', role: 'Agent',  detail: 'Crop record updated for Geetha Devi', ip: '10.0.0.5',     ts: '23/05/2026 15:20' },
    { id: 'LOG005', action: 'login',   user: 'Geetha Devi',  role: 'Farmer', detail: 'Farmer logged in via OTP',            ip: '172.16.0.10',  ts: '23/05/2026 14:00' },
    { id: 'LOG006', action: 'reject',  user: 'Admin User',   role: 'Admin',  detail: 'Agent Mohan Rao application rejected',ip: '192.168.1.1',  ts: '22/05/2026 11:30' },
    { id: 'LOG007', action: 'create',  user: 'Ramesh Kumar', role: 'Agent',  detail: 'Finance record Rs.88,000 added',      ip: '10.0.0.5',     ts: '22/05/2026 10:15' },
    { id: 'LOG008', action: 'login',   user: 'Prakash Nair', role: 'Farmer', detail: 'Farmer logged in',                    ip: '172.16.0.22',  ts: '22/05/2026 09:00' },
    { id: 'LOG009', action: 'delete',  user: 'Admin User',   role: 'Admin',  detail: 'Old complaint record cleared',        ip: '192.168.1.1',  ts: '21/05/2026 16:45' },
    { id: 'LOG010', action: 'update',  user: 'Admin User',   role: 'Admin',  detail: 'System settings updated',             ip: '192.168.1.1',  ts: '21/05/2026 14:00' }
  ],
  weather: {
    city: 'Hubli, Karnataka', temp: 34, feels: 38, humidity: 62, wind: 14, uv: 8,
    condition: 'Partly Cloudy', icon: '⛅',
    forecast: [
      { day: 'Mon', icon: '☀️',  high: 36, low: 24, rain: 5  },
      { day: 'Tue', icon: '⛅', high: 34, low: 23, rain: 20 },
      { day: 'Wed', icon: '🌧️', high: 29, low: 21, rain: 80 },
      { day: 'Thu', icon: '🌧️', high: 27, low: 20, rain: 75 },
      { day: 'Fri', icon: '⛅', high: 31, low: 22, rain: 30 },
      { day: 'Sat', icon: '☀️',  high: 35, low: 24, rain: 10 },
      { day: 'Sun', icon: '☀️',  high: 37, low: 25, rain: 5  }
    ],
    advisory: 'Rain expected Wed–Thu. Avoid pesticide application. Ensure proper drainage in rice fields. Good time to plan Kharif sowing after rain.'
  },
  news: [
    { id: 'N1', cat: 'gov',    title: 'PM-KISAN 17th instalment released for 9.5 Cr farmers',  time: '2 hours ago',  summary: 'Govt released Rs.20,000 Cr to farmer accounts directly via DBT.' },
    { id: 'N2', cat: 'market', title: 'Wheat MSP increased to Rs.2,275/qtl for Rabi 2026-27',  time: '5 hours ago',  summary: 'CACP recommends significant MSP hike for wheat and mustard.' },
    { id: 'N3', cat: 'weather',title: 'IMD predicts normal monsoon onset in Karnataka by June 5',time: '1 day ago',   summary: 'SW monsoon on track; farmers advised to prepare paddy nurseries.' },
    { id: 'N4', cat: 'alert',  title: 'Locust sighting reported in Rajasthan border districts', time: '1 day ago',   summary: 'State agri depts on alert. No threat to Karnataka currently.' },
    { id: 'N5', cat: 'gov',    title: 'Soil Health Card portal updated with 2026 test results', time: '2 days ago',  summary: 'Over 14 Cr SHCs distributed. New portal allows instant download.' },
    { id: 'N6', cat: 'market', title: 'Cotton prices surge 8% on global demand revival',        time: '2 days ago',  summary: 'Cotton futures up Rs.500/qtl; favorable for Deccan farmers.' },
    { id: 'N7', cat: 'gov',    title: 'Agri-Drone subsidy scheme launched for SC/ST farmers',   time: '3 days ago',  summary: '90% subsidy on drone purchase for precision farming.' }
  ],
  tickets: [
    { id: 'TKT001', subject: 'Unable to upload Aadhar for KYC',    status: 'replied', priority: 'medium', category: 'KYC',     createdAt: '20/05/2026', lastUpdate: '21/05/2026' },
    { id: 'TKT002', subject: 'Scheme application not reflecting',   status: 'open',    priority: 'low',    category: 'Schemes', createdAt: '22/05/2026', lastUpdate: '22/05/2026' },
    { id: 'TKT003', subject: 'Finance record showing wrong amount', status: 'closed',  priority: 'high',   category: 'Finance', createdAt: '15/05/2026', lastUpdate: '18/05/2026' }
  ],
  payments: [
    { id: 'PAY001', type: 'credit', amount: 88000, label: 'Rice Sale – APMC Hubli',   date: '10/03/2026', method: 'NEFT', status: 'success' },
    { id: 'PAY002', type: 'debit',  amount: 22000, label: 'Fertilizer Store – Hubli',  date: '05/03/2026', method: 'UPI',  status: 'success' },
    { id: 'PAY003', type: 'credit', amount: 6000,  label: 'PM-KISAN Instalment 16',    date: '28/02/2026', method: 'DBT',  status: 'success' },
    { id: 'PAY004', type: 'debit',  amount: 5000,  label: 'Loan EMI – SBI KCC',        date: '01/03/2026', method: 'NACH', status: 'success' }
  ],
  verifications: [
    { id: 'VER001', userId: '9222222222', name: 'Suresh Patil', role: 'Agent',  doc: 'Aadhar',       submitted: '18/05/2026', status: 'pending'  },
    { id: 'VER002', userId: '9666666666', name: 'Mohan Rao',    role: 'Agent',  doc: 'Pan Card',     submitted: '20/05/2026', status: 'pending'  },
    { id: 'VER003', userId: '9555555555', name: 'Priya Singh',  role: 'Farmer', doc: 'Land Record',  submitted: '12/05/2026', status: 'pending'  },
    { id: 'VER004', userId: '9444444444', name: 'Laxmi Bai',   role: 'Farmer', doc: 'Bank Passbook',submitted: '08/05/2026', status: 'verified' }
  ],
  storeProducts: [
    // FERTILIZERS
    { id:'SP01', cat:'fertilizer', name:'DAP (Diammonium Phosphate)', brand:'IFFCO',   price:1350, unit:'50 kg bag', stock:142, icon:'🧪', rating:4.8, desc:'High phosphorus fertilizer for all crops. Promotes root growth and flowering.' },
    { id:'SP02', cat:'fertilizer', name:'Urea (46% Nitrogen)',        brand:'NFL',     price:266,  unit:'45 kg bag', stock:280, icon:'🧪', rating:4.6, desc:'Essential nitrogen source. Promotes leaf and stem growth. Apply at sowing stage.' },
    { id:'SP03', cat:'fertilizer', name:'NPK 10-26-26',               brand:'Coromandel',price:1420,unit:'50 kg bag',stock:96, icon:'🧪', rating:4.7, desc:'Balanced NPK for Kharif crops. Ideal for cotton, paddy, and vegetables.' },
    { id:'SP04', cat:'fertilizer', name:'MOP (Muriate of Potash)',    brand:'IPL',     price:980,  unit:'50 kg bag', stock:64,  icon:'🧪', rating:4.5, desc:'Improves fruit quality and disease resistance. Use for sugarcane and potato.' },
    { id:'SP05', cat:'fertilizer', name:'Zinc Sulphate 21%',          brand:'Tata',    price:420,  unit:'25 kg bag', stock:55,  icon:'🧪', rating:4.4, desc:'Corrects zinc deficiency in paddy and wheat. Prevents white bud disease.' },
    { id:'SP06', cat:'fertilizer', name:'Vermicompost (Organic)',      brand:'KrishiMart',price:180, unit:'10 kg bag',stock:210, icon:'🌱', rating:4.9, desc:'Organic matter improves soil texture and microbial activity. 100% natural.' },
    // SEEDS
    { id:'SP07', cat:'seed', name:'BPT 5204 Paddy Seeds',         brand:'KARNATAKA SEED', price:120,  unit:'5 kg pack',  stock:88,  icon:'🌾', rating:4.9, desc:'High-yield fine rice variety. 135-day duration. Suitable for irrigated conditions.' },
    { id:'SP08', cat:'seed', name:'HD 2967 Wheat Seeds',           brand:'ICAR',          price:85,   unit:'5 kg pack',  stock:120, icon:'🌾', rating:4.7, desc:'Semi-dwarf wheat with lodging resistance. Best for Rabi season. Yield 45–55 qtl/acre.' },
    { id:'SP09', cat:'seed', name:'Bt Cotton Hybrid (Bollgard II)',brand:'Mahyco',        price:750,  unit:'450 g pack', stock:200, icon:'🌿', rating:4.8, desc:'Bollworm resistant Bt cotton. High ginning outturn 38–40%. Suitable for black soil.' },
    { id:'SP10', cat:'seed', name:'DHM 117 Maize Hybrid',          brand:'Pioneer',       price:320,  unit:'4 kg pack',  stock:65,  icon:'🌽', rating:4.6, desc:'Early maturing maize. 90-day duration. Suitable for both Kharif and Rabi seasons.' },
    { id:'SP11', cat:'seed', name:'CO 86032 Sugarcane Sets',       brand:'SUGARCANE RES', price:45,   unit:'per 100 sets',stock:300,icon:'🎋', rating:4.5, desc:'High sugar content variety. Ratoon crop maintains good yield. Resistant to red rot.' },
    { id:'SP12', cat:'seed', name:'TMV 2 Groundnut Seeds',         brand:'TNAU',          price:180,  unit:'10 kg pack', stock:75,  icon:'🥜', rating:4.7, desc:'Bunch type groundnut. 105-day duration. Suitable for light soils. Good oil content.' },
    // TRACTORS & EQUIPMENT
    { id:'SP13', cat:'tractor', name:'Mahindra 575 DI (47 HP)',  brand:'Mahindra', price:685000, unit:'unit', stock:3, icon:'🚜', rating:4.8, desc:'47 HP, 2WD tractor with power steering. Excellent for medium farms. Best-in-class fuel efficiency.' },
    { id:'SP14', cat:'tractor', name:'SONALIKA DI 745 III (50 HP)',brand:'Sonalika',price:720000, unit:'unit',stock:2, icon:'🚜', rating:4.6, desc:'50 HP 2WD tractor. Heavy-duty hydraulics, ergonomic cabin. Great for sugarcane ploughing.' },
    { id:'SP15', cat:'tractor', name:'Mini Tractor (22 HP)',      brand:'VST',      price:325000, unit:'unit', stock:4, icon:'🚜', rating:4.5, desc:'22 HP compact tractor for small farms. Easy maneuverability in narrow rows.' },
    { id:'SP16', cat:'tractor', name:'Drip Irrigation Kit (1 Acre)',brand:'Netafim', price:18500,  unit:'set', stock:28, icon:'💧', rating:4.9, desc:'Complete drip system for 1 acre. Includes main/sub lines, drippers, filters, and timer.' },
    { id:'SP17', cat:'tractor', name:'Power Tiller (7 HP)',        brand:'Kirloskar',price:62000,  unit:'unit', stock:6, icon:'🔧', rating:4.4, desc:'7 HP diesel power tiller for land preparation. Adjustable tilling width 600–900mm.' },
    { id:'SP18', cat:'tractor', name:'Crop Spray Drone (10L)',     brand:'General Aero',price:285000,unit:'unit',stock:2, icon:'🚁', rating:4.7, desc:'GPS-guided 10-litre spray drone. Covers 10 acres/hour. Reduces pesticide use by 40%.' },
    // PESTICIDES
    { id:'SP19', cat:'pesticide', name:'Chlorpyrifos 20% EC',   brand:'Tata Rallis', price:320,  unit:'1 litre', stock:88,  icon:'🧴', rating:4.5, desc:'Broad-spectrum insecticide for sucking pests. Effective on aphids, whitefly, thrips.' },
    { id:'SP20', cat:'pesticide', name:'Mancozeb 75% WP',       brand:'Indofil',    price:180,  unit:'500 g',   stock:132, icon:'🧴', rating:4.6, desc:'Protective fungicide for downy mildew, early blight, and anthracnose.' },
    { id:'SP21', cat:'pesticide', name:'Imidacloprid 17.8% SL', brand:'Bayer',      price:280,  unit:'250 ml',  stock:72,  icon:'🧴', rating:4.8, desc:'Systemic insecticide for BPH, leaf hopper, white fly. Use at early crop stage.' },
    { id:'SP22', cat:'pesticide', name:'Glyphosate 41% SL',     brand:'Monsanto',   price:220,  unit:'1 litre', stock:95,  icon:'🧴', rating:4.3, desc:'Non-selective herbicide for pre-sowing weed control. Do not use on standing crops.' },
    { id:'SP23', cat:'pesticide', name:'Emamectin Benzoate 5%', brand:'Syngenta',   price:480,  unit:'100 g',   stock:44,  icon:'🧴', rating:4.7, desc:'Highly effective against bollworm, fall armyworm, and stem borer.' },
    { id:'SP24', cat:'pesticide', name:'Neem Oil 1500 PPM',     brand:'Agro Neem',  price:140,  unit:'500 ml',  stock:160, icon:'🌿', rating:4.8, desc:'Bio-pesticide safe for humans. Controls mealy bug, mites, and fungal diseases.' }
  ],
  govtAlerts: [
    { id:'GA1', severity:'high',   icon:'⚠️', title:'Heavy Rain Alert – Wed & Thu',                 body:'IMD Red Alert for Dharwad, Haveri, Gadag districts. Avoid field work 28–29 May.',      time:'2 hours ago' },
    { id:'GA2', severity:'info',   icon:'📋', title:'PM-KISAN 17th Instalment Released',             body:'Rs.2,000 credited to eligible farmer accounts. Check your bank account or Kisan app.', time:'5 hours ago' },
    { id:'GA3', severity:'medium', icon:'🐛', title:'Fall Armyworm Outbreak – Early Warning',        body:'Outbreak detected in Bellary maize farms. Use Emamectin Benzoate spray immediately.',   time:'1 day ago'   },
    { id:'GA4', severity:'info',   icon:'🌾', title:'Kharif MSP 2026-27 Announced',                  body:'Paddy MSP raised to Rs.2,300/qtl. Cotton to Rs.7,121/qtl. Check full list at DAC.',     time:'2 days ago'  },
    { id:'GA5', severity:'medium', icon:'💧', title:'Water Release Schedule – Malaprabha Canal',     body:'Water released for rabi crops. Check your canal schedule at dist. irrigation office.',  time:'3 days ago'  }
  ],
  loanApprovals: [
    { id:'LA001', farmerName:'Geetha Devi',  farmerId:1, type:'KCC',       amount:150000, bank:'SBI',    appliedAt:'01/03/2026', status:'approved',  officer:'B.K. Sharma',    notes:'Documents verified. Disbursed.' },
    { id:'LA002', farmerName:'Prakash Nair', farmerId:2, type:'Agri Loan', amount:200000, bank:'PNB',    appliedAt:'10/04/2026', status:'approved',  officer:'R. Menon',       notes:'Collateral land record verified.' },
    { id:'LA003', farmerName:'Priya Singh',  farmerId:4, type:'Equipment', amount:80000,  bank:'BOI',    appliedAt:'15/05/2026', status:'pending',   officer:'Unassigned',     notes:'Pending field verification.' },
    { id:'LA004', farmerName:'Venkat Reddy', farmerId:5, type:'KCC',       amount:300000, bank:'SBI',    appliedAt:'05/02/2026', status:'disbursed', officer:'A. Krishnamurthy',notes:'Fully disbursed. Active account.' },
    { id:'LA005', farmerName:'Laxmi Bai',   farmerId:3, type:'SHG Loan',  amount:50000,  bank:'Canara', appliedAt:'20/05/2026', status:'pending',   officer:'Unassigned',     notes:'SHG group verification pending.' },
    { id:'LA006', farmerName:'Rajesh Patil', farmerId:6, type:'KCC',       amount:120000, bank:'SBI',    appliedAt:'22/05/2026', status:'pending',   officer:'Unassigned',     notes:'Income certificate awaited.' },
    { id:'LA007', farmerName:'Suresh Kumar', farmerId:7, type:'Agri Loan', amount:175000, bank:'PNB',    appliedAt:'18/05/2026', status:'rejected',  officer:'V. Nair',        notes:'Insufficient land records provided.' }
  ]
};

// ── CONVENIENCE ACCESSORS ─────────────────────────────────────
function getUsers()         { return _store.users; }
function getFarmers()       { return _store.farmers; }
function getCrops()         { return _store.crops; }
function getFinance()       { return _store.finance; }
function getSchemes()       { return _store.schemes; }
function getLoans()         { return _store.loans; }
function getComplaints()    { return _store.complaints; }
function getMarketplace()   { return _store.marketplace; }
function getBuyers()        { return _store.buyers; }
function getAPMC()          { return _store.apmc; }
function getAuditLogs()     { return _store.auditLogs; }
function getWeather()       { return _store.weather; }
function getNews()          { return _store.news; }
function getTickets()       { return _store.tickets; }
function getPayments()      { return _store.payments; }
function getVerifications()  { return _store.verifications; }
function getStoreProducts()  { return _store.storeProducts; }
function getGovtAlerts()     { return _store.govtAlerts; }
function getLoanApprovals()  { return _store.loanApprovals; }

function seedDemoData() { /* no-op – data lives in _store */ }

// ── SMART ALERTS ──────────────────────────────────────────────
function computeAlerts() {
  var finance = getFinance();
  var income  = finance.filter(function(r){return r.type==='income';}).reduce(function(s,r){return s+r.amount;},0);
  var expense = finance.filter(function(r){return r.type==='expense';}).reduce(function(s,r){return s+r.amount;},0);
  var profit  = income - expense;
  var alerts  = [];
  if (expense>0 && expense/(income||1)>0.6) alerts.push({type:'warning',msg:t('highExpense')});
  if (profit<5000 && income>0)              alerts.push({type:'error',  msg:t('lowProfit')  });
  if (profit>20000)                          alerts.push({type:'success',msg:t('goodProfit') });
  return alerts;
}
function renderAlerts(containerId) {
  var el = document.getElementById(containerId);
  if (!el) return;
  var alerts = computeAlerts();
  if (!alerts.length) { el.innerHTML=''; return; }
  el.innerHTML = alerts.map(function(a){
    var color  = a.type==='error'?'#FFEBEE':a.type==='warning'?'#FFF8E1':'#E8F5E9';
    var border = a.type==='error'?'var(--danger)':a.type==='warning'?'var(--accent)':'var(--primary)';
    return '<div style="background:'+color+';border-left:4px solid '+border+';border-radius:10px;padding:12px 16px;margin-bottom:8px;font-weight:600;font-size:.88rem;">'+a.msg+'</div>';
  }).join('');
}

// ── FARMER GROUPING ───────────────────────────────────────────
function groupFarmersByVillage() {
  return getFarmers().reduce(function(acc,f){var v=f.village||'Unknown';acc[v]=(acc[v]||[]).concat(f);return acc;},{});
}
function groupFarmersByCrop() {
  return getFarmers().reduce(function(acc,f){var c=f.crop||'Unknown';acc[c]=(acc[c]||[]).concat(f);return acc;},{});
}

// ── ECO TAB SWITCHER ──────────────────────────────────────────
function switchEcoTab(panelId, clickedEl, tabClass, panelClass) {
  document.querySelectorAll('.'+tabClass).forEach(function(t){t.classList.remove('active');});
  document.querySelectorAll('.'+panelClass).forEach(function(p){p.classList.remove('active');});
  clickedEl.classList.add('active');
  var panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
}

// ── VOICE COMMANDS ────────────────────────────────────────────
function startVoice(inputId, resultId) {
  var inputEl  = document.getElementById(inputId);
  var resultEl = document.getElementById(resultId);
  var voiceBtn = document.getElementById('voiceBtn');
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    var demos = ['Add farmer Ramesh','Show crops','Open market','Check finance','Generate report'];
    if (inputEl)  inputEl.value = demos[Math.floor(Math.random()*demos.length)];
    if (resultEl) resultEl.textContent = '(Simulated – Speech API unavailable)';
    if (inputEl)  handleVoiceCommand(inputEl.value);
    return;
  }
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var r  = new SR(); r.lang='en-IN'; r.interimResults=false;
  if (voiceBtn) voiceBtn.classList.add('listening');
  r.start();
  r.onresult = function(e){
    var txt = e.results[0][0].transcript;
    if (inputEl)  inputEl.value = txt;
    if (voiceBtn) voiceBtn.classList.remove('listening');
    handleVoiceCommand(txt);
  };
  r.onerror = function(){
    if (voiceBtn) voiceBtn.classList.remove('listening');
    if (resultEl) resultEl.textContent = 'Could not hear you. Try again.';
  };
}
function handleVoiceCommand(cmd) {
  var c = cmd.toLowerCase();
  var r = document.getElementById('voiceResult');
  function go(msg,url){if(r)r.textContent=msg;setTimeout(function(){window.location.href=url;},900);}
  if      (c.indexOf('farmer')>=0)                         go('Opening Farmers…',   'farmer.html');
  else if (c.indexOf('crop')>=0)                           go('Opening Crops…',     'crop.html');
  else if (c.indexOf('finance')>=0||c.indexOf('money')>=0) go('Opening Finance…',   'finance.html');
  else if (c.indexOf('market')>=0)                         go('Opening Market…',    'market.html');
  else if (c.indexOf('admin')>=0)                          go('Opening Admin…',     'admin.html');
  else if (c.indexOf('weather')>=0)                        go('Checking Weather…',  'dashboard.html');
  else if (c.indexOf('scheme')>=0)                         go('Opening Schemes…',   'dashboard.html');
  else if (c.indexOf('report')>=0)                         go('Generating report…', 'finance.html');
  else if (c.indexOf('dashboard')>=0)                      go('Going to Dashboard…','dashboard.html');
  else if (r) r.textContent = 'Not recognized. Try: "Add farmer" or "Show crops"';
}

// ── SIDEBAR USER INFO ─────────────────────────────────────────
function populateSidebar() {
  var cu = getCurrentUser();
  if (!cu) return;
  var nameEl = document.getElementById('sidebarName');
  var roleEl = document.getElementById('sidebarRole');
  var initEl = document.getElementById('sidebarInitial');
  if (nameEl) nameEl.textContent = cu.name;
  if (roleEl) roleEl.textContent = cu.role;
  if (initEl) initEl.textContent = cu.name.charAt(0).toUpperCase();
  var adminLink = document.getElementById('adminLink');
  if (adminLink && cu.role !== 'Admin') adminLink.style.display = 'none';
}

// ── DOWNLOAD HELPER ───────────────────────────────────────────
function _triggerDownload(url, filename) {
  var a = document.createElement('a');
  a.href = url;
  if (filename) a.download = filename;
  a.rel = 'noopener';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(function() {
    if (a.parentNode) a.parentNode.removeChild(a);
  }, 300);
}

function _normalizeAssetPath(relPath) {
  return String(relPath || '').replace(/\\/g, '/');
}

function _checkAssetAvailable(relPath) {
  var path = _normalizeAssetPath(relPath);
  if (!path) return Promise.resolve(false);
  if (window.location.protocol === 'file:') {
    // Browsers block fetch() checks on file:// pages; direct trigger is the safest fallback.
    return Promise.resolve(true);
  }
  return fetch(path, { method: 'HEAD', cache: 'no-store' })
    .then(function(res) {
      if (res.ok) return true;
      return fetch(path, { method: 'GET', cache: 'no-store' }).then(function(getRes) {
        return !!getRes.ok;
      });
    })
    .catch(function() {
      return false;
    });
}

// Download one of the prebuilt assets (relative to root)
function downloadAsset(relPath, filename, opts) {
  opts = opts || {};
  var safePath = _normalizeAssetPath(relPath);
  var safeName = filename || (safePath.split('/').pop() || 'download');
  return _checkAssetAvailable(safePath).then(function(available) {
    if (!available) {
      if (!opts.silent) showToast('File currently unavailable', 'warning');
      return false;
    }
    _triggerDownload(safePath, safeName);
    if (!opts.silent) showToast('Downloading ' + safeName + ' …');
    return true;
  });
}

function _downloadInSequence(files, delayMs) {
  var okCount = 0, missCount = 0;
  var queue = Promise.resolve();
  files.forEach(function(f) {
    queue = queue.then(function() {
      return downloadAsset(f.path, f.name, { silent: true }).then(function(ok) {
        if (ok) okCount += 1;
        else missCount += 1;
        return new Promise(function(resolve) { setTimeout(resolve, delayMs || 450); });
      });
    });
  });
  return queue.then(function() { return { ok: okCount, missing: missCount }; });
}

function _downloadFromElement(el) {
  if (!el) return;
  var file = el.getAttribute('data-download-file');
  if (!file) return;
  var name = el.getAttribute('data-download-name') || '';
  downloadAsset(file, name);
}

function initDownloadLinks() {
  document.querySelectorAll('[data-download-file]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      _downloadFromElement(el);
    });
  });
}

// ── REPORT GENERATOR ──────────────────────────────────────────
// For farmer-specific reports: download the real annual-report PDF,
// then also offer the CSV. For full-platform: download all assets.
function generateReport(farmerId) {
  if (farmerId) {
    // Individual farmer bundle
    _downloadInSequence([
      { path: 'assets/downloads/farmer-report.pdf', name: 'AgriNode-Farmer-Report-2026.pdf' },
      { path: 'assets/downloads/farmer-records.csv', name: 'AgriNode-Farmer-Records.csv' }
    ], 550).then(function(meta) {
      if (meta.ok > 0) showToast('Downloading Farm Report bundle …');
      if (meta.ok === 0) showToast('File currently unavailable', 'warning');
    });
    return;
  }
  // Full-platform report: download all export assets sequentially
  var files = [
    { path: 'assets/downloads/annual-report.pdf',  name: 'AgriNode-Annual-Report-FY2025-26.pdf' },
    { path: 'assets/downloads/village-analytics-report.pdf',  name: 'AgriNode-Village-Analytics-Report-2026.pdf' },
    { path: 'assets/downloads/farmer-records.csv', name: 'AgriNode-Farmer-Records.csv' },
    { path: 'assets/downloads/crop-data.csv',      name: 'AgriNode-Crop-Data.csv' },
    { path: 'assets/downloads/market-prices.csv',  name: 'AgriNode-Market-Prices.csv' }
  ];
  _downloadInSequence(files, 550).then(function(meta) {
    if (meta.ok > 0) showToast('Downloading ' + meta.ok + ' report files …');
    if (meta.ok === 0 || meta.missing > 0) showToast('File currently unavailable', 'warning');
  });
  // Also show the HTML print summary in the background
  var farmers = getFarmers(), crops = getCrops(), finance = getFinance();
  var income  = finance.filter(function(r){return r.type==='income';}).reduce(function(s,r){return s+r.amount;},0);
  var expense = finance.filter(function(r){return r.type==='expense';}).reduce(function(s,r){return s+r.amount;},0);
  var reportEl = document.getElementById('print-report');
  if (reportEl) {
    reportEl.innerHTML = '<div style="max-width:700px;margin:auto;font-family:sans-serif;">'
      +'<div style="text-align:center;padding:20px 0;border-bottom:3px solid #2E7D32;">'
      +'<h1 style="color:#2E7D32;margin:0;">AgriNode Platform Report</h1>'
      +'<p style="color:#666;">Generated: '+new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})+'</p></div>'
      +'<h2 style="color:#2E7D32;margin-top:24px;">Platform Summary</h2>'
      +'<p>Total Farmers: <strong>'+farmers.length+'</strong></p>'
      +'<p>Total Crops: <strong>'+crops.length+'</strong></p>'
      +'<p>Total Income: <strong>Rs.'+income.toLocaleString('en-IN')+'</strong></p>'
      +'<p>Total Expense: <strong>Rs.'+expense.toLocaleString('en-IN')+'</strong></p>'
      +'<p>Net '+(income-expense>=0?'Profit':'Loss')+': <strong>Rs.'+Math.abs(income-expense).toLocaleString('en-IN')+'</strong></p>'
      +'</div>';
  }
}

// ── BROCHURE DOWNLOAD ─────────────────────────────────────────
// Downloads the real PDF brochure from assets/downloads/
function downloadBrochure() {
  downloadAsset('assets/downloads/brochure.pdf', 'AgriNode-Platform-Brochure-2026.pdf');
}

function downloadAnnualReport() {
  downloadAsset('assets/downloads/annual-report.pdf', 'AgriNode-Annual-Report-FY2025-26.pdf');
}

function downloadFarmerReport() {
  downloadAsset('assets/downloads/farmer-report.pdf', 'AgriNode-Farmer-Report-2026.pdf');
}

function downloadVillageAnalyticsReport() {
  downloadAsset('assets/downloads/village-analytics-report.pdf', 'AgriNode-Village-Analytics-Report-2026.pdf');
}

function downloadImpactReport() {
  downloadVillageAnalyticsReport();
}

function downloadComplaintReport() {
  downloadFarmerReport();
}

function downloadAuditCsv() {
  downloadFarmerRecords();
}

function downloadSupportReport() {
  downloadVillageAnalyticsReport();
}

function downloadTransactionHistory() {
  downloadFarmerRecords();
}

// Download user guide
function downloadUserGuide() {
  downloadAsset('assets/downloads/user-guide.pdf', 'AgriNode-User-Guide-v2.pdf');
}

// Download data exports
function downloadCropData() {
  downloadAsset('assets/downloads/crop-data.csv', 'AgriNode-Crop-Data.csv');
}
function downloadFarmerRecords() {
  downloadAsset('assets/downloads/farmer-records.csv', 'AgriNode-Farmer-Records.csv');
}
function downloadMarketPrices() {
  downloadAsset('assets/downloads/market-prices.csv', 'AgriNode-Market-Prices.csv');
}

// ── MODAL WORKFLOW LOGIC ─────────────────────────────────────
var _currentBuyer = null;
function openBuyerModal(id) {
  var b = getBuyers().find(x => x.id === id);
  if(!b) return;
  _currentBuyer = b;
  var stars='★'.repeat(Math.floor(b.rating))+'☆'.repeat(5-Math.floor(b.rating));
  document.getElementById('buyerContactDetails').innerHTML = `
    <div style="display:flex; align-items:center; gap:12px;">
      <div style="width:50px;height:50px;background:var(--primary);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:bold;">${b.name.charAt(0)}</div>
      <div>
        <div style="font-weight:800; font-size:1.1rem;">${b.name} <span style="font-size:0.75rem; color:var(--text-muted);">(${b.type})</span></div>
        <div style="font-size:0.85rem;"><i class="fa fa-map-marker-alt text-danger"></i> ${b.location} &bull; ${b.distance} km away</div>
        <div style="color:var(--warning); font-size:0.85rem;">${stars} ${b.rating}</div>
      </div>
    </div>
  `;
  document.getElementById('buyerChatHistory').innerHTML = `
    <div style="align-self:flex-start; background:var(--bg); border:1px solid var(--border); padding:8px 12px; border-radius:12px; font-size:0.85rem; max-width:85%;">
      <strong>${b.name}:</strong> Hello! I am looking to purchase ${b.crops.join(', ')}. Do you have any stock available?
      <div style="font-size:0.7rem; color:var(--text-muted); margin-top:4px;">Yesterday, 10:00 AM</div>
    </div>
  `;
  var m = new bootstrap.Modal(document.getElementById('buyerContactModal'));
  m.show();
}

function sendBuyerMsg() {
  var i = document.getElementById('buyerMsgInput');
  var text = i.value.trim();
  if(!text) return;
  
  if (!_store.communications) _store.communications = [];
  _store.communications.push({
    id: 'MSG' + Date.now(),
    buyerId: _currentBuyer.id,
    farmerId: getCurrentUser() ? getCurrentUser().id : 1,
    text: text,
    timestamp: new Date().toISOString()
  });
  syncCollectionToJSON('communications');
  
  document.getElementById('buyerChatHistory').innerHTML += `
    <div style="align-self:flex-end; background:var(--primary); color:#fff; padding:8px 12px; border-radius:12px; font-size:0.85rem; max-width:85%;">
      ${text}
      <div style="font-size:0.7rem; color:rgba(255,255,255,0.7); margin-top:4px;">Just now</div>
    </div>
  `;
  i.value = '';
}

function callBuyer() {
  if(!_currentBuyer) return;
  showToast(`Calling ${_currentBuyer.name} on ${_currentBuyer.phone}...`, 'success');
  setTimeout(() => { window.location.href = 'tel:' + _currentBuyer.phone; }, 1500);
}

var _currentScheme = null;
function openSchemeModal(id) {
  var s = getSchemes().find(x => x.id === id);
  if(!s) return;
  _currentScheme = s;
  document.getElementById('schemeModalTitle').textContent = `Apply: ${s.name}`;
  document.getElementById('schemeDetailsBox').innerHTML = `
    <strong>Ministry:</strong> ${s.ministry}<br/>
    <strong>Benefit:</strong> ${s.benefit}<br/>
    <strong>Eligibility:</strong> ${s.eligibility}<br/>
    <strong>Deadline:</strong> ${s.deadline}
  `;
  var m = new bootstrap.Modal(document.getElementById('schemeApplyModal'));
  m.show();
}

function submitSchemeApp() {
  if(!_currentScheme) return;
  var f1 = document.getElementById('schemeDocAadhar').files.length;
  var f2 = document.getElementById('schemeDocLand').files.length;
  if(!f1 || !f2) { showToast('Please upload all required documents (PDF/JPG/PNG)','error'); return; }
  
  _currentScheme.applied = true;
  syncCollectionToJSON('schemes');
  showToast(`Application for ${_currentScheme.name} submitted successfully! It will be reviewed by the Admin.`);
  var m = bootstrap.Modal.getInstance(document.getElementById('schemeApplyModal'));
  m.hide();
  if(typeof renderFarmerSchemes === 'function') renderFarmerSchemes();
}

function openLoanModal() {
  var m = new bootstrap.Modal(document.getElementById('loanApplyModal'));
  m.show();
}

function submitLoanApp() {
  var amt = document.getElementById('modLoanAmt').value;
  var type = document.getElementById('modLoanType').value;
  var docs = document.getElementById('modLoanDocs').files.length;
  if(!amt || !docs) { showToast('Please enter amount and upload documents','error'); return; }
  
  var newId = 'L' + Date.now();
  var fName = getCurrentUser() ? getCurrentUser().name : 'Geetha Devi';
  var fId = getCurrentUser() ? getCurrentUser().id : 1;
  var rate = type==='kcc'?'4%':type==='agri'?'7%':'8.5%';
  var dStr = new Date().toLocaleDateString('en-IN');
  
  getLoans().push({
    id: newId,
    farmerName: fName,
    farmerId: fId,
    type: type,
    bank: 'Pending Assignment',
    amount: parseInt(amt, 10),
    rate: rate,
    tenure: '24 Months',
    status: 'pending',
    progress: 0,
    appliedDate: dStr
  });
  
  getLoanApprovals().push({
    id: newId,
    farmerName: fName,
    farmerId: fId,
    type: type.toUpperCase(),
    amount: parseInt(amt, 10),
    bank: 'Pending Assignment',
    appliedAt: dStr,
    status: 'pending',
    officer: 'Unassigned',
    notes: 'Awaiting review'
  });
  
  syncCollectionToJSON('loans');
  syncCollectionToJSON('loanApprovals');
  
  showToast('Loan Application Submitted! Pending verification by Agent.', 'success');
  var m = bootstrap.Modal.getInstance(document.getElementById('loanApplyModal'));
  m.hide();
  if(typeof renderFarmerLoans === 'function') renderFarmerLoans();
}

function openPaymentModal(method) {
  var body = document.getElementById('paymentModalBody');
  var amt = document.getElementById('fPaymentAmount') ? document.getElementById('fPaymentAmount').value : 500;
  if(!amt) { showToast('Please enter payment amount', 'error'); return; }
  
  if(method === 'UPI') {
    body.innerHTML = `
      <h6>Scan to Pay via UPI</h6>
      <div style="background:#fff; display:inline-block; padding:15px; border-radius:12px; margin:15px 0; border:1px solid #ccc;">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=agrinode@sbi&pn=AgriNode&am=${amt}" alt="UPI QR"/>
      </div>
      <div style="font-size:1.2rem; font-weight:800; margin-bottom:15px;">₹${amt}</div>
      <p style="font-size:0.8rem; color:var(--text-muted)">Dummy UPI Gateway</p>
      <input type="password" class="form-control mb-3" placeholder="Enter Dummy UPI PIN (1234)" id="dummyUpiPin" style="text-align:center; font-size:1.2rem; letter-spacing:4px;" />
      <button class="btn-primary-custom" onclick="processPayment('UPI', ${amt})">Complete Payment</button>
    `;
  } else if(method === 'NetBanking') {
    body.innerHTML = `
      <h6>Dummy Net Banking Login</h6>
      <select class="form-select mb-3">
        <option>State Bank of India</option>
        <option>HDFC Bank</option>
        <option>ICICI Bank</option>
        <option>Punjab National Bank</option>
      </select>
      <div style="font-size:1.2rem; font-weight:800; margin-bottom:15px;">Amount: ₹${amt}</div>
      <input type="text" class="form-control mb-2" placeholder="Dummy User ID" />
      <input type="password" class="form-control mb-3" placeholder="Dummy Password" />
      <button class="btn-primary-custom" onclick="processPayment('NetBanking', ${amt})">Login & Pay</button>
    `;
  }
  
  var m = new bootstrap.Modal(document.getElementById('paymentModal'));
  m.show();
}

function processPayment(method, amt) {
  showToast(\`Processing ₹\${amt} via \${method}...\`);
  setTimeout(() => {
    var m = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
    m.hide();
    
    getPayments().push({
      id: 'PAY' + Date.now(),
      type: 'debit',
      amount: parseInt(amt),
      label: 'AgriNode Purchase / Payment',
      date: new Date().toLocaleDateString('en-IN'),
      method: method,
      status: 'success'
    });
    showToast('Payment Successful! Transaction recorded.', 'success');
    if(typeof renderFarmerPayments === 'function') renderFarmerPayments();
  }, 1500);
}

function openBalanceSheet() {
  var fa = getCurrentUser() || getFarmers()[0];
  var html = `
    <div style="text-align:center; margin-bottom:20px; border-bottom:2px dashed #000; padding-bottom:10px;">
      <h3 style="margin:0; font-weight:900;">AGRINODE FINANCIAL BALANCE SHEET</h3>
      <div style="font-size:12px;">Generated for: ${fa.name} (ID: ${fa.id || fa.phone})</div>
      <div style="font-size:12px;">Date: ${new Date().toLocaleDateString()}</div>
    </div>
    
    <h5 style="background:#eee; padding:5px; border:1px solid #ccc;">1. CROP REVENUE SUMMARY</h5>
    <table style="width:100%; margin-bottom:20px; font-size:13px; text-align:left;" border="1" cellpadding="5">
      <tr style="background:#f9f9f9"><th>Crop</th><th>Harvest Date</th><th>Quantity (Qtl)</th><th>Est. Value (₹)</th></tr>
      <tr><td>Rice (Kharif)</td><td>Nov 2026</td><td>40</td><td>₹91,200</td></tr>
      <tr><td>Wheat (Rabi)</td><td>Mar 2027</td><td>60</td><td>₹1,36,500</td></tr>
      <tr style="font-weight:bold"><td colspan="3">Total Revenue</td><td>₹2,27,700</td></tr>
    </table>
    
    <h5 style="background:#eee; padding:5px; border:1px solid #ccc;">2. EXPENSE SUMMARY</h5>
    <table style="width:100%; margin-bottom:20px; font-size:13px; text-align:left;" border="1" cellpadding="5">
      <tr style="background:#f9f9f9"><th>Category</th><th>Details</th><th>Amount (₹)</th></tr>
      <tr><td>Fertilizers</td><td>Urea & DAP</td><td>₹22,000</td></tr>
      <tr><td>Labour</td><td>Sowing & Harvest</td><td>₹41,000</td></tr>
      <tr><td>Pesticides</td><td>Chlorpyrifos</td><td>₹18,000</td></tr>
      <tr style="font-weight:bold"><td colspan="2">Total Expenses</td><td>₹81,000</td></tr>
    </table>
    
    <h5 style="background:#eee; padding:5px; border:1px solid #ccc;">3. LOANS & LIABILITIES</h5>
    <table style="width:100%; margin-bottom:20px; font-size:13px; text-align:left;" border="1" cellpadding="5">
      <tr style="background:#f9f9f9"><th>Loan Type</th><th>Bank</th><th>Amount (₹)</th><th>Status</th></tr>
      <tr><td>KCC</td><td>SBI</td><td>₹1,50,000</td><td>Disbursed</td></tr>
      <tr style="font-weight:bold"><td colspan="2">Total Liabilities</td><td colspan="2">₹1,50,000</td></tr>
    </table>
    
    <div style="border:2px solid #000; padding:15px; text-align:center; font-size:16px;">
      <div style="font-weight:bold">NET PROFIT ESTIMATE (Revenue - Expenses)</div>
      <div style="font-size:24px; font-weight:900; color:green;">₹1,46,700</div>
    </div>
  `;
  document.getElementById('bsPrintArea').innerHTML = html;
  var m = new bootstrap.Modal(document.getElementById('balanceSheetModal'));
  m.show();
}

function loadStoreFromJSON() {
  var collections = ['schemes', 'loans', 'loanApprovals', 'complaints', 'marketplace', 'communications'];
  var promises = collections.map(function(col) {
    return fetch('/api/data/' + col)
      .then(function(res) { return res.json(); })
      .then(function(json) {
        if (json && json.success) {
          _store[col] = json.data || [];
        }
      })
      .catch(function(e) { console.error('Fetch error for', col, e); });
  });
  return Promise.all(promises);
}

function syncCollectionToJSON(col) {
  fetch('/api/data/' + col, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(_store[col] || [])
  }).catch(function(err){ console.error('Sync err', err); });
}

// ── INIT (called per-page) ────────────────────────────────────
function agriInit() {
  initTheme();
  initOffline();
  seedDemoData();
  initLang();
  initDownloadLinks();
  populateSidebar();
  loadStoreFromJSON().then(function() {
    var activeBtn = document.querySelector('.bottom-nav .bn-item.active, .cmd-sidebar-link.active');
    if(activeBtn) activeBtn.click();
    if(typeof initHero === 'function') initHero();
  });
}

document.addEventListener('DOMContentLoaded', agriInit);
