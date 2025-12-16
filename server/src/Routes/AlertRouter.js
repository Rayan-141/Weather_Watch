const express = require('express');
const router = express.Router();
const alertController = require('../controller/AlertController');
const auth = require('../middleware/AuthMiddleware');

// @route   GET api/alerts
// @desc    Get all user alerts
// @access  Private
router.get('/', auth, alertController.getAlerts);

// @route   POST api/alerts
// @desc    Add new alert
// @access  Private
router.post('/', auth, alertController.addAlert);

module.exports = router;
