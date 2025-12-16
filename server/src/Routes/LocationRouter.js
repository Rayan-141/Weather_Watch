const express = require('express');
const router = express.Router();
const locationController = require('../controller/LocationController');
const auth = require('../middleware/AuthMiddleware');

// @route   GET api/locations
// @desc    Get all user locations
// @access  Private
router.get('/', auth, locationController.getLocations);

// @route   POST api/locations
// @desc    Add new location
// @access  Private
router.post('/', auth, locationController.addLocation);

module.exports = router;
