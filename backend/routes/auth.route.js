/**
 * Express router for authentication-related routes.
 * @typedef {import('express').Router} ExpressRouter
 */

const { Router } = require('express');
const authController = require('../controllers/auth.controller.js');
const { body } = require('express-validator');
const router /** @type {ExpressRouter} */ = Router();
const verify = require('../middleware/tokenVerification');

/**
 * Route for user signup.
 *
 * @name POST /signup
 * @function
 * @memberof module:authRoutes
 * @inner
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {string} req.body.username - The username of the user.
 * @param {number} req.body.age - The age of the user.
 * @returns {Object} The result of the signup operation.
 * @throws {Error} If validation fails or an error occurs during signup.
 *
 * @example
 * // Usage Example
 * // Assuming you have an Express app instance
 * const express = require('express');
 * const app = express();
 *
 * // Import the authRoutes module
 * const authRoutes = require('./path/to/authRoutes');
 *
 * // Use the authRoutes in your app
 * app.use('/auth', authRoutes);
 *
 * // Start your Express app
 * const port = 5000;
 * app.listen(port, () => {
 *   console.log(`Server is running on port ${port}`);
 * });
 */
router.post('/signup', [
    body("email").isString().notEmpty(),
    body("password").isString().notEmpty(),
    body("username").isString().notEmpty(),
    body("age").isNumeric().notEmpty()
    ],
    authController.signup
);

/**
 * Route for user login.
 *
 * @name POST /login
 * @function
 * @memberof module:authRoutes
 * @inner
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @returns {Object} The result of the login operation.
 * @throws {Error} If validation fails or an error occurs during login.
 */
router.post('/login', [
    body("email").isString().notEmpty(),
    body("password").isString().notEmpty()
    ],
    authController.login
);

/**
 * Route for user logout.
 *
 * @name GET /logout
 * @function
 * @memberof module:authRoutes
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {Error} If token verification fails or an error occurs during logout.
 */
router.get('/logout', verify, authController.logout);

/**
 * Route for changing user password.
 *
 * @name POST /change-password
 * @function
 * @memberof module:authRoutes
 * @inner
 * @param {string} req.body.currentPassword - The current password of the user.
 * @param {string} req.body.newPassword - The new password of the user.
 * @returns {Object} The result of the password change operation.
 * @throws {Error} If validation fails, token verification fails, or an error occurs during password change.
 */
router.post('/change-password', [
    body("currentPassword").isString().notEmpty(),
    body("newPassword").isString().notEmpty(),
    ],
    verify, authController.changePass);

module.exports = router;
