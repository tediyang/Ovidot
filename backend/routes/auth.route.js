const express = require('express');
const { Router } = require('express');
const authController = require('../controllers/auth.controller.js');
const { validationResult, body } = require('express-validator');

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
