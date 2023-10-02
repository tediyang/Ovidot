// Non-Authenticated routes
const { Router } = require('express');
const router /** @type {ExpressRouter} */ = Router();
const regController = require('../controllers/register.controller.js');
const passController = require('../controllers/password.controller.js');
const { body } = require('express-validator');

// Register a user
router.post('/signup', [
    body("email").isString().notEmpty(),
    body("password").isString().notEmpty(),
    body("username").isString().notEmpty(),
    body("age").isNumeric().notEmpty()
    ],
    regController.signup
);

// login in user
router.post('/login', [
    body("email").isString().notEmpty(),
    body("password").isString().notEmpty()
    ],
    regController.login
);

// Send rest link to user's email
router.post('/forgot-password', [
    body("email").isString().notEmpty()
    ],
    passController.forgotPass
);

// Validate reset token 
router.get('/reset-password/:token',
    passController.VerifyResetPass
);

// Reset password
router.post('/reset-password/:token', [
    body("password").isString().notEmpty(),
    ],
    passController.ResetPass
);

module.exports = router;
