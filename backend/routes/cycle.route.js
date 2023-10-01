/**
 * Express router for cycle-related routes.
 * @typedef {Object} ExpressRouter
 */

const { Router } = require('express');
const router /** @type {ExpressRouter} */ = Router();
const { body } = require('express-validator');
const cycleController = require('../controllers/cycle.controller');
const verify = require('../middleware/tokenVerification');

/**
 * Route for creating a new cycle for a user.
 *
 * @name POST /:userId/cycles
 * @function
 * @memberof module:cycleRoutes
 * @inner
 * @param {number} req.params.userId - The ID of the user.
 * @param {number} req.body.period - The period of the cycle.
 * @param {string} req.body.startdate - The start date of the cycle.
 * @returns {Object} The result of the cycle creation operation.
 * @throws {Error} If validation fails, token verification fails, or an error occurs during creation.
 *
 * @example
 * // Usage Example
 * // Assuming you have an Express app instance
 * const express = require('express');
 * const app = express();
 *
 * // Import the cycleRoutes module
 * const cycleRoutes = require('./path/to/cycleRoutes');
 *
 * // Use the cycleRoutes in your app
 * app.use('/users', cycleRoutes);
 *
 * // Start your Express app
 * const port = 3000;
 * app.listen(port, () => {
 *   console.log(`Server is running on port ${port}`);
 * });
 */
router.post('/:userId/cycles', [
    body("period").isNumeric().notEmpty(),
    body("startdate").isString().notEmpty()
    ],
    verify, cycleController.create);

/**
 * Route for fetching all cycles for a user.
 *
 * @name GET /:userId/cycles
 * @function
 * @memberof module:cycleRoutes
 * @inner
 * @param {number} req.params.userId - The ID of the user.
 * @returns {Object[]} The array of cycles for the user.
 * @throws {Error} If token verification fails or an error occurs during retrieval.
 */
router.get('/:userId/cycles', verify, cycleController.fetchAll);

/**
 * Route for fetching a specific cycle for a user.
 *
 * @name GET /:userId/cycles/:cycleId
 * @function
 * @memberof module:cycleRoutes
 * @inner
 * @param {number} req.params.userId - The ID of the user.
 * @param {number} req.params.cycleId - The ID of the cycle.
 * @returns {Object} The details of the specified cycle.
 * @throws {Error} If token verification fails or an error occurs during retrieval.
 */
router.get('/:userId/cycles/:cycleId', verify, cycleController.fetchOne);

/**
 * Route for fetching cycles for a given month for a user.
 *
 * @name GET /:userId/:month
 * @function
 * @memberof module:cycleRoutes
 * @inner
 * @param {number} req.params.userId - The ID of the user.
 * @param {string} req.params.month - The month for which cycles are to be fetched.
 * @returns {Object[]} The array of cycles for the specified month.
 * @throws {Error} If token verification fails or an error occurs during retrieval.
 */
router.get('/:userId/:month', verify, cycleController.fetchMonth);

/**
 * Route for updating a cycle for a user.
 *
 * @name PUT /:userId/cycles/:cycleId
 * @function
 * @memberof module:cycleRoutes
 * @inner
 * @param {number} req.params.userId - The ID of the user.
 * @param {number} req.params.cycleId - The ID of the cycle.
 * @param {number} req.body.period - The updated period of the cycle.
 * @param {string} req.body.ovulation - The updated ovulation details of the cycle.
 * @returns {Object} The result of the cycle update operation.
 * @throws {Error} If validation fails, token verification fails, or an error occurs during update.
 */
router.put('/:userId/cycles/:cycleId', verify, cycleController.update);

/**
 * Route for deleting a cycle for a user.
 *
 * @name DELETE /:userId/cycles/:cycleId
 * @function
 * @memberof module:cycleRoutes
 * @inner
 * @param {number} req.params.userId - The ID of the user.
 * @param {number} req.params.cycleId - The ID of the cycle.
 * @returns {Object} The result of the cycle deletion operation.
 * @throws {Error} If token verification fails or an error occurs during deletion.
 */
router.delete('/:userId/cycles/:cycleId', verify, cycleController.delete);

module.exports = router;
