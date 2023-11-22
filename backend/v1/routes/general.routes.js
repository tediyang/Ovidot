// Non-Authenticated routes
import { Router } from 'express';
const router /** @type {ExpressRouter} */ = Router();
import { signup, login } from '../controllers/register.controller.js';
import { forgotPass, VerifyResetPass, ResetPass } from '../controllers/password.controller.js';
import { body } from 'express-validator';

// Register a user
router.post('/signup', [
    body("email").isString().notEmpty(),
    body("password").isString().notEmpty(),
    body("username").isString().notEmpty(),
    body("age").isNumeric().notEmpty()
    ],
    signup
);

// login in user
router.post('/login', [
    body("email").isString().notEmpty(),
    body("password").isString().notEmpty()
    ],
    login
);

// Send rest link to user's email
router.post('/forgot-password', [
    body("email").isString().notEmpty()
    ],
    forgotPass
);

// Validate reset token 
router.get('/reset-password/:token',
    VerifyResetPass
);

// Reset password
router.post('/reset-password/:token', [
    body("password").isString().notEmpty(),
    ],
    ResetPass
);

export default router;
