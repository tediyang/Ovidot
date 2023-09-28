const { Router } = require('express');
const authController = require('../controllers/auth.controller.js');
const { body } = require('express-validator');

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

router.get('/logout', authController.logout);

module.exports = router;
