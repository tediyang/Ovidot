const { Router } = require('express');
const passReset = require('../controllers/password.reset');
const { body } = require('express-validator');
const router = Router();

// Forgot Password for logged out users
router.post('/forgot-password', [
    body("email").isString().notEmpty()
    ],
    passReset.forgotPass
);

// Verify reset password token
router.get('/reset-password/:token',
    passReset.VerifyResetPass
);

// Reset password
router.post('/reset-password/:token', [
    body("password").isString().notEmpty(),
    ],
    passReset.ResetPass
);

module.exports = router;
