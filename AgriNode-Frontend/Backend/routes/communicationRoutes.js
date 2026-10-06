const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, communicationController.getMessages);
router.post('/send', verifyToken, communicationController.sendMessage);

module.exports = router;
