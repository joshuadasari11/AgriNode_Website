const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, loanController.getLoans);
router.post('/apply', verifyToken, requireRole('farmer', 'admin'), loanController.applyLoan);
router.put('/status', verifyToken, requireRole('admin', 'agent'), loanController.updateLoanStatus);

module.exports = router;
