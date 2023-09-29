const { Router } = require('express');
const authController = require('../controllers/auth.controller.js');
const { body } = require('express-validator');
const router = Router();
const verify = require('../middleware/tokenVerification');

// Signup
router.post('/signup', [
    body("email").isString().notEmpty(),
    body("password").isString().notEmpty(),
    body("username").isString().notEmpty(),
    body("age").isNumeric().notEmpty()
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

// Logout
router.get('/logout', verify, authController.logout);

// Change Password
router.post('/change-password', [
    body("currentPassword").isString().notEmpty(),
    body("newPassword").isString().notEmpty(),
    ],
    verify, authController.changePass);

module.exports = router;
