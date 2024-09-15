
// Import necessary modules
const { Router } = require('express');
const appController = require('../controllers/register.controller.js');
const passwordController = require('../controllers/password.controller.js');


// Create an Express router
const router /** @type {ExpressRouter} */ = Router();

/**
 * @swagger
 * tags:
 *   name: General Routes | No Authentication
 *   description: Endpoints accessible without authentication
 */

// Route to register a user
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a user
 *     tags: [General Routes | No Authentication]
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
 *               period:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Successful registration
 *       '400':
 *         description: Bad request
 */

/**
 * Route to register user
 * @swagger
 * paths:
 *  /register:
 *    post:
 *      summary: Register a new user
 *      tags:
 *        - Account Routes
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                fname:
 *                  type: string
 *                  required: true
 *                  description: First Name
 *                lname:
 *                  type: string
 *                  required: true
 *                  description: Last Name
 *                aka:
 *                  type: string
 *                  description: (Optional) Alias or Nickname
 *                email:
 *                  type: string
 *                  required: true
 *                  description: User's email address
 *                  format: email  # Ensures valid email format
 *                password:
 *                  type: string
 *                  required: true
 *                  description: Capital, small, number and special character
 *                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{8,}$/
 *                gender:
 *                  type: string
 *                  enum:
 *                    - MALE
 *                    - FEMALE
 *                  required: true
 *                  description: User's gender
 *                phone:
 *                  type: string
 *                  required: true
 *                  description: User's phone number (pattern for validation can be added)
 *                  pattern: "/^[8792][01](esp)d{8}$/"  # For 10-digit phone numbers
 *                dob:
 *                  type: string
 *                  required: true
 *                  format: YYYY-MM-DD
 *                q_and_a:
 *                  type: object
 *                  required: true
 *                  description: Security question and answer
 *                  properties:
 *                    question:
 *                      type: string
 *                      required: true
 *                    answer:
 *                      type: string
 *                      required: true

 *      responses:
 *        '201':
 *          description: User registration successful
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  email:
 *                    type: string
 *                    description: Registered user's email
 *                  phone:
 *                    type: string
 *                    description: Registered user's phone number
 *                  status:
 *                    type: string
 *                    description: Registration status (e.g., "success")
 *        '400':
 *          description: Bad request (invalid data)
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                oneOf:
 *                  - properties:
 *                      msg:
 *                        type: string
 *                        description: You are underage, go and play
 *                  - properties:
 *                      errors:
 *                        type: array
 *                        items:
 *                          type: string
 *        '500':
 *          description: Internal server error
 */
router.post('/signup', appController.signup);

// Route to log in a user
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     tags: [General Routes | No Authentication]
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
router.post('/login', appController.login.bind(appController));

// Route to send a reset link to the user's email
/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Send reset link to user's email
 *     tags: [General Routes | No Authentication]
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
router.post('/forgot-password', passwordController.forgotPass.bind(passwordController));

// Route to validate the reset token
/**
 * @swagger
 * /reset-password/{token}:
 *   get:
 *     summary: Validate reset token
 *     tags: [General Routes | No Authentication]
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
router.get('/reset-password/:token', passwordController.VerifyResetPass);

// Route to reset the password
/**
 * @swagger
 * /reset-password/{token}:
 *   post:
 *     summary: Reset password
 *     tags: [General Routes | No Authentication]
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
router.put('/reset-password', passwordController.ResetPass);


module.exports = router;
