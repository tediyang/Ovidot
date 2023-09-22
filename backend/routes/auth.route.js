const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validationResult } = require('express-validator');
const { body } = require('express-validator');

// Signup
router.post('/signup', [
    body("email").isString().notEmpty(),
    body("password").isString().notEmpty()
    ],
    authController.signup
);

// Login
router.post('/login', [
    body("email").isString().notEmpty(),
    body("password").isString().notEmpty()
    ],
    authController.login
);

module.exports = router;
