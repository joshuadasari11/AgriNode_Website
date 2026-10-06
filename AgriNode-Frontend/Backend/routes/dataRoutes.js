const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// Bypass verifyToken for demo purposes to avoid auth overhead
router.get('/:collection', dataController.getCollection);
router.post('/:collection', dataController.updateCollection);

module.exports = router;
