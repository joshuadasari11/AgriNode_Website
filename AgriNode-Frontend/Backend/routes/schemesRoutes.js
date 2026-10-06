const express = require('express');
const router = express.Router();
const schemesController = require('../controllers/schemesController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, schemesController.getAllSchemes);
router.post('/apply', verifyToken, schemesController.applyForScheme);

module.exports = router;
