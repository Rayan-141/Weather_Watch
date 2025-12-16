const express = require('express');
const router = express.Router();
const weatherController = require('../controller/WeatherController');

// @route   GET api/weather
// @desc    Get weather data
// @access  Public
router.get('/', weatherController.getWeather);

module.exports = router;
