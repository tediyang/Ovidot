const express = require('express');
const { Router } = require('express');
const authController = require('../controllers/auth.controller.js');
const { validationResult, body } = require('express-validator');

const AuthRoutes = express.Router();

AuthRoutes.post('/api/signup', [
    body("email").isString().notEmpty(),
    body("password").isString().notEmpty()
    ],
    authController.signup
);

AuthRoutes.post('/api/login', [
    body("email").isString().notEmpty(),
    body("password").isString().notEmpty()
    ],
    authController.login
);

module.exports = AuthRoutes;
