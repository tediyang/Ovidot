require('dotenv').config();

const express = require('express');
const { Router } = require('express');
const authController = require('../controllers/auth.controller.js');
const { validationResult, body } = require('express-validator');
const verifyToken = require('../middleware/verifyToken');

const router = Router();

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

/* verifyToken middleware */
router.use('/signup', verifyToken);
router.use('/login', verifyToken);

module.exports = router;
