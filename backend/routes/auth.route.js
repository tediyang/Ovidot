const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validationResult } = require('express-validator');
const { body } = require('express-validator');

// Signup
router.post('/api/signup', [
    body("email").isString().notEmpty(),
    body("password").isString().notEmpty()
    ],
    authController.signup
);

// Login
router.post('/api/login', [
    body("email").isString().notEmpty(),
    body("password").isString().notEmpty()
    ],
    authController.login
);

module.exports = router;
