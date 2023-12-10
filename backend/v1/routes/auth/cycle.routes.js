
// Import necessary modules
import { Router } from 'express';
import { body } from 'express-validator';
import * as cycle from '../../controllers/cycle.controller.js';

// Create an Express router
const router /** @type {ExpressRouter} */ = Router();

/**
 * @swagger
 * tags:
 *   name: Cycle Routes
 *   description: Endpoints related to cycles
 */

// Route to create a cycle
/**
 * @swagger
 * /cycles/create:
 *   post:
 *     summary: Create a new cycle
 *     tags: [Cycle Routes]
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
router.post('/create', [
    body("period").isNumeric().notEmpty(),
    body("startdate").isString().notEmpty()
    ],
    cycle.createCycle
);

// Route to get all cycles
/**
 * @swagger
 * /cycles/getall:
 *   get:
 *     summary: Get all cycles
 *     tags: [Cycle Routes]
 *     responses:
 *       '200':
 *         description: Successfully retrieved all cycles
 *       '400':
 *         description: Bad request
 */
router.get('/getall', cycle.fetchAllCycles);

// Route to get a cycle using cycleId
/**
 * @swagger
 * /cycles/{cycleId}:
 *   get:
 *     summary: Get a cycle by cycleId
 *     tags: [Cycle Routes]
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
router.get('/:cycleId', cycle.fetchOneCycle);

// Route to get cycles by month
/**
 * @swagger
 * /cycles/getcycles/{month}:
 *   get:
 *     summary: Get cycles by month
 *     tags: [Cycle Routes]
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved cycles for the specified month
 *       '400':
 *         description: Bad request
 */
router.get('/getcycles/:month', cycle.fetchMonth);

// Route to update a cycle
/**
 * @swagger
 * /cycles/{cycleId}:
 *   put:
 *     summary: Update a cycle
 *     tags: [Cycle Routes]
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
router.put('/:cycleId', cycle.updateCycle);

// Route to delete a cycle by cycleId
/**
 * @swagger
 * /cycles/{cycleId}:
 *   delete:
 *     summary: Delete a cycle by cycleId
 *     tags: [Cycle Routes]
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
router.delete('/:cycleId', cycle.deleteCycle);

// Export the router
export default router;
