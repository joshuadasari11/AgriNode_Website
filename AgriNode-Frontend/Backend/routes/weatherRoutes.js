const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// Allow public access or add token middleware if needed
router.get('/', weatherController.getWeather);

module.exports = router;
