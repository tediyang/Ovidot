/**
 * Express router for Admin-related routes.
 * @typedef {import('express').Router} ExpressRouter
 */

const { Router } = require('express');
const router /** @type {ExpressRouter} */ = Router();
const adminController = require('../controller/admin.controller');
const { forgotPass } = require('../../controllers/password.reset');
const verify = require('../../middleware/tokenVerification');
const { body } = require('express-validator');

/**
 * Route for logging into the admin profile.
 *
 * @name POST /auth/login
 * @function
 * @memberof module:adminRoutes
 * @inner
 * @param {string} req.body.username - The username of the admin.
 * @param {string} req.body.password - The password of the admin.
 * @returns {Object} The result of the login operation.
 * @throws {Error} If validation fails or an error occurs during login.
 *
 * @example
 * // Usage Example
 * // Assuming you have an Express app instance
 * const express = require('express');
 * const app = express();
 *
 * // Import the adminRoutes module
 * const adminRoutes = require('./path/to/adminRoutes');
 *
 * // Use the adminRoutes in your app
 * app.use('/admin', adminRoutes);
 *
 * // Start your Express app
 * const port = 5000;
 * app.listen(port, () => {
 *   console.log(`Server is running on port ${port}`);
 * });
 */
router.post('/auth/login', [
    body('username').isString().notEmpty(),
    body('password').isString().notEmpty()
    ],
    adminController.login);

/**
 * Route for retrieving all users.
 *
 * @name GET /users
 * @function
 * @memberof module:adminRoutes
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {Error} If token verification fails or an error occurs during retrieval.
 */
router.get('/users', verify, adminController.viewAllusers);

/**
 * Route for retrieving a user by email.
 *
 * @name GET /users/:email
 * @function
 * @memberof module:adminRoutes
 * @inner
 * @param {Object} req - The request object containing the email parameter.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {Error} If token verification fails or an error occurs during retrieval.
 */
router.get('/users/:email', verify, adminController.viewUser);

/**
 * Route for updating a user by email.
 *
 * @name PUT /users/:email
 * @function
 * @memberof module:adminRoutes
 * @inner
 * @param {Object} req - The request object containing the email parameter.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {Error} If validation fails, token verification fails, or an error occurs during update.
 */
router.put('/users/:email', [
    body('email').isString().notEmpty()
    ],
    verify, adminController.updateUser);

/**
 * Route for deleting a user by email.
 *
 * @name DELETE /users/:email
 * @function
 * @memberof module:adminRoutes
 * @inner
 * @param {Object} req - The request object containing the email parameter.
 * @param {Object} res - The response object.
 * @throws {Error} If token verification fails or an error occurs during deletion.
 */
router.delete('/users/:email', adminController.deleteUser);

/**
 * Route for sending a forgot password link to a user.
 *
 * @name POST /users/forgot-password
 * @function
 * @memberof module:adminRoutes
 * @inner
 * @param {Object} req - The request object containing the email parameter.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {Error} If validation fails, token verification fails, or an error occurs during password reset.
 */
router.post('/users/forgot-password', [
    body('email').isString().notEmpty()
    ],
    verify, forgotPass);

/**
 * Route for retrieving all cycles.
 *
 * @name GET /cycles
 * @function
 * @memberof module:adminRoutes
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {Error} If token verification fails or an error occurs during retrieval.
 */
router.get('/cycles', verify, adminController.viewAllCycles);

/**
 * Route for retrieving a cycle by cycleId.
 *
 * @name GET /cycles/:cycleId
 * @function
 * @memberof module:adminRoutes
 * @inner
 * @param {Object} req - The request object containing the cycleId parameter.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {Error} If token verification fails or an error occurs during retrieval.
 */
router.get('/cycles/:cycleId', verify, adminController.viewCycle);

/**
 * Route for deleting a cycle by cycleId.
 *
 * @name DELETE /cycles/:cycleId
 * @function
 * @memberof module:adminRoutes
 * @inner
 * @param {Object} req - The request object containing the cycleId parameter.
 * @param {Object} res - The response object.
 * @throws {Error} If token verification fails or an error occurs during deletion.
 */
router.delete('/cycles/:cycleId', verify, adminController.deleteCycle);

module.exports = router;
