const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, complaintController.getComplaints);
router.post('/file', verifyToken, requireRole('farmer', 'admin'), complaintController.fileComplaint);
router.put('/status', verifyToken, requireRole('admin', 'agent'), complaintController.updateComplaintStatus);

module.exports = router;
