
// Import necessary modules
const { Router } = require('express');
const cycleController = require('../../controllers/cycle.controller.js');

// Create an Express router
const router /** @type {ExpressRouter} */ = Router();

/**
 * @swagger
 * tags:
 *   name: Cycle Routes | Authentication Needed
 *   description: Endpoints related to cycles
 */

// Route to create a cycle
/**
 * @swagger
 * /cycles/create:
 *   post:
 *     summary: Create a new cycle
 *     tags: [Cycle Routes | Authentication Needed]
 *     security:
 *       - userToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               period:
 *                 type: number
 *               startdate:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Cycle created successfully
 *       '400':
 *         description: Bad request
 */
router.post('/create', cycleController.createCycle);

// Route to get all cycles
/**
 * @swagger
 * /cycles/getall:
 *   get:
 *     summary: Get all cycles
 *     tags: [Cycle Routes | Authentication Needed]
 *     security:
 *       - userToken: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved all cycles
 *       '400':
 *         description: Bad request
 */
router.get('/getall', cycleController.fetchAllCycles);

// Route to get a cycle using cycleId
/**
 * @swagger
 * /cycles/{cycleId}:
 *   get:
 *     summary: Get a cycle by cycleId
 *     tags: [Cycle Routes | Authentication Needed]
 *     security:
 *       - userToken: []
 *     parameters:
 *       - in: path
 *         name: cycleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved the cycle
 *       '404':
 *         description: Cycle not found
 */
router.get('/:cycleId', cycleController.fetchOneCycle);

// Route to update a cycle
/**
 * @swagger
 * /cycles/{cycleId}:
 *   put:
 *     summary: Update a cycle
 *     tags: [Cycle Routes | Authentication Needed]
 *     security:
 *       - userToken: []
 *     parameters:
 *       - in: path
 *         name: cycleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Cycle updated successfully
 *       '404':
 *         description: Cycle not found
 *       '400':
 *         description: Bad request
 */
router.put('/:cycleId', cycleController.updateCycle);

// Route to delete a cycle by cycleId
/**
 * @swagger
 * /cycles/{cycleId}:
 *   delete:
 *     summary: Delete a cycle by cycleId
 *     tags: [Cycle Routes | Authentication Needed]
 *     security:
 *       - userToken: []
 *     parameters:
 *       - in: path
 *         name: cycleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Cycle deleted successfully
 *       '404':
 *         description: Cycle not found
 */
router.delete('/:cycleId', cycleController.deleteCycle);

// Export the router
module.exports = router;
