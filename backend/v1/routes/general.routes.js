
// Import necessary modules
import { Router } from 'express';
import { signup, login } from '../controllers/register.controller.js';
import { forgotPass, VerifyResetPass, ResetPass } from '../controllers/password.controller.js';
import { body } from 'express-validator';

// Create an Express router
const router /** @type {ExpressRouter} */ = Router();

/**
 * @swagger
 * tags:
 *   name: Non-Authenticated Routes
 *   description: Endpoints accessible without authentication
 */

// Route to register a user
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a user
 *     tags: [Non-Authenticated Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *               age:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Successful registration
 *       '400':
 *         description: Bad request
 */
router.post('/signup', [
    body("email").isString().notEmpty(),
    body("password").isString().notEmpty(),
    body("username").isString().notEmpty(),
    body("age").isNumeric().notEmpty()
    ],
    signup
);

// Route to log in a user
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     tags: [Non-Authenticated Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful login
 *       '400':
 *         description: Bad request
 */
router.post('/login', [
    body("email").isString().notEmpty(),
    body("password").isString().notEmpty()
    ],
    login
);

// Route to send a reset link to the user's email
/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Send reset link to user's email
 *     tags: [Non-Authenticated Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Reset link sent successfully
 *       '400':
 *         description: Bad request
 */
router.post('/forgot-password', [
    body("email").isString().notEmpty(),
    body("url").isString().notEmpty()
    ],
    forgotPass
);

// Route to validate the reset token
/**
 * @swagger
 * /reset-password/{token}:
 *   get:
 *     summary: Validate reset token
 *     tags: [Non-Authenticated Routes]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Reset token validated successfully
 *       '400':
 *         description: Bad request
 */
router.get('/reset-password/:token',
    VerifyResetPass
);

// Route to reset the password
/**
 * @swagger
 * /reset-password/{token}:
 *   post:
 *     summary: Reset password
 *     tags: [Non-Authenticated Routes]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password reset successfully
 *       '400':
 *         description: Bad request
 */
router.post('/reset-password/:token', [
    body("password").isString().notEmpty(),
    ],
    ResetPass
);

// Export the router
export default router;
