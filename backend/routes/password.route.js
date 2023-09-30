/**
 * Express router for password reset-related routes.
 * @typedef {import('express').Router} ExpressRouter
 */

const { Router } = require('express');
const passReset = require('../controllers/password.reset');
const { body } = require('express-validator');
const router /** @type {ExpressRouter} */ = Router();

/**
 * Route for initiating the forgot password process for logged-out users.
 *
 * @name POST /forgot-password
 * @function
 * @memberof module:passwordResetRoutes
 * @inner
 * @param {string} req.body.email - The email of the user.
 * @returns {Object} The result of the forgot password initiation.
 * @throws {Error} If validation fails or an error occurs during the initiation process.
 *
 * @example
 * // Usage Example
 * // Assuming you have an Express app instance
 * const express = require('express');
 * const app = express();
 *
 * // Import the passwordResetRoutes module
 * const passwordResetRoutes = require('./path/to/passwordResetRoutes');
 *
 * // Use the passwordResetRoutes in your app
 * app.use('/password-reset', passwordResetRoutes);
 *
 * // Start your Express app
 * const port = 3000;
 * app.listen(port, () => {
 *   console.log(`Server is running on port ${port}`);
 * });
 */
router.post('/forgot-password', [
    body("email").isString().notEmpty()
    ],
    passReset.forgotPass
);

/**
 * Route for verifying the reset password token.
 *
 * @name GET /reset-password/:token
 * @function
 * @memberof module:passwordResetRoutes
 * @inner
 * @param {string} req.params.token - The reset password token.
 * @returns {Object} The result of the reset password token verification.
 * @throws {Error} If token verification fails or an error occurs during verification.
 */
router.get('/reset-password/:token',
    passReset.VerifyResetPass
);

/**
 * Route for resetting the password.
 *
 * @name POST /reset-password/:token
 * @function
 * @memberof module:passwordResetRoutes
 * @inner
 * @param {string} req.params.token - The reset password token.
 * @param {string} req.body.password - The new password.
 * @returns {Object} The result of the password reset operation.
 * @throws {Error} If validation fails, token verification fails, or an error occurs during password reset.
 */
router.post('/reset-password/:token', [
    body("password").isString().notEmpty(),
    ],
    passReset.ResetPass
);

module.exports = router;
