const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', userController.register);

// @route   POST api/users/login
// @desc    Login user
// @access  Public
router.post('/login', userController.login);

module.exports = router;
