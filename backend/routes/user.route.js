/**
 * Express router for user-related routes.
 * @typedef {import('express').Router} ExpressRouter
 */

const { Router } = require('express');
const router /** @type {ExpressRouter} */ = Router();
const userController = require('../controllers/user.controller');
const verify = require('../middleware/tokenVerification');

/**
 * Route for fetching user data.
 *
 * @name GET /:userId
 * @function
 * @memberof module:userRoutes
 * @inner
 * @param {number} req.params.userId - The ID of the user.
 * @returns {Object} The user data.
 * @throws {Error} If token verification fails or an error occurs during data retrieval.
 *
 * @example
 * // Usage Example
 * // Assuming you have an Express app instance
 * const express = require('express');
 * const app = express();
 *
 * // Import the userRoutes module
 * const userRoutes = require('./path/to/userRoutes');
 *
 * // Use the userRoutes in your app
 * app.use('/users', userRoutes);
 *
 * // Start your Express app
 * const port = 3000;
 * app.listen(port, () => {
 *   console.log(`Server is running on port ${port}`);
 * });
 */
router.get('/:userId', verify, userController.fetch);

/**
 * Route for updating user data.
 *
 * @name PUT /:userId
 * @function
 * @memberof module:userRoutes
 * @inner
 * @param {number} req.params.userId - The ID of the user.
 * @returns {Object} The result of the user data update.
 * @throws {Error} If token verification fails or an error occurs during data update.
 */
router.put('/:userId', verify, userController.update);

/**
 * Route for deleting a user.
 *
 * @name DELETE /:userId
 * @function
 * @memberof module:userRoutes
 * @inner
 * @param {number} req.params.userId - The ID of the user.
 * @returns {Object} The result of the user deletion operation.
 * @throws {Error} If token verification fails or an error occurs during deletion.
 */
router.delete('/:userId', verify, userController.delete);

module.exports = router;
