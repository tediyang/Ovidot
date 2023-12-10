
// Import necessary modules
import { Router } from 'express';
import userRoutes from './auth/user.routes.js';
import cycleRoutes from './auth/cycle.routes.js';
import { logout } from '../controllers/register.controller.js';

// Create an Express router
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authenticated Routes
 *   description: Endpoints requiring authentication
 */

// Route to handle user CRUD operations
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Authenticated Routes]
 *     responses:
 *       '200':
 *         description: Successfully retrieved users
 *       '401':
 *         description: Unauthorized request
 *   post:
 *     summary: Create a new user
 *     tags: [Authenticated Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your user properties here
 *     responses:
 *       '201':
 *         description: User created successfully
 *       '401':
 *         description: Unauthorized request
 */
router.use('/users', userRoutes);

// Route to handle cycle CRUD operations
/**
 * @swagger
 * /cycles:
 *   get:
 *     summary: Get all cycles
 *     tags: [Authenticated Routes]
 *     responses:
 *       '200':
 *         description: Successfully retrieved cycles
 *       '401':
 *         description: Unauthorized request
 *   post:
 *     summary: Create a new cycle
 *     tags: [Authenticated Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your cycle properties here
 *     responses:
 *       '201':
 *         description: Cycle created successfully
 *       '401':
 *         description: Unauthorized request
 */
router.use('/cycles', cycleRoutes);

// Route to log out a user
/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Log out a user
 *     tags: [Authenticated Routes]
 *     responses:
 *       '200':
 *         description: User logged out successfully
 *       '401':
 *         description: Unauthorized request
 */
router.get('/logout', logout);

// Export the router
export default router;
