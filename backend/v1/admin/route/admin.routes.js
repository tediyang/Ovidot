// Import necessary modules
const { Router } = require('express');
const adminController = require('../controller/admin.controller.js');
const tokenVerification = require('../../middleware/tokenVerification.js');
const appController = require('../../controllers/register.controller.js');
const passwordController = require('../../controllers/password.controller.js');

// Create an Express router
const router /** @type {ExpressRouter} */ = Router();

/**
 * @swagger
 * tags:
 *   name: Admin Routes | Admin Authentication Needed
 *   description: Endpoints related to admin operations
 */

// Route for logging into the admin profile
/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Log into the admin profile
 *     tags: [Admin Routes | Admin Authentication Needed]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Admin logged in successfully
 *       '400':
 *         description: Bad request
 */
router.post('/login', adminController.login.bind(adminController));

// Route to log out an admin
/**
 * @swagger
 * /admin/logout:
 *   get:
 *     summary: Logout admin
 *     tags: [Admin Routes | Admin Authentication Needed]
 *     security:
 *       - adminToken: []
 *     responses:
 *       '200':
 *         description: Admin logged out successfully
 *       '401':
 *         description: Unauthorized request
 */
router.get('/logout', tokenVerification.adminTokenVerification, appController.logout);

// Route for retrieving all users
/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Admin Routes | Admin Authentication Needed]
 *     security:
 *       - adminToken: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       '200':
 *         description: Successfully retrieved all users
 *       '401':
 *         description: Unauthorized request
 *       '400':
 *         description: Bad request
 */
router.get('/users', tokenVerification.adminTokenVerification, adminController.getUsers.bind(adminController));

// Route for retrieving a user by email
/**
 * @swagger
 * /admin/users/email:
 *   post:
 *     summary: Retrieve a user by email
 *     tags: [Admin Routes | Admin Authentication Needed]
 *     security:
 *       - adminToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved the user
 *       '401':
 *         description: Unauthorized request
 *       '400':
 *         description: Bad request
 */
router.post('/users/email', tokenVerification.adminTokenVerification, adminController.getUser.bind(adminController));

// Route for retrieving all cycles for a user by email
/**
 * @swagger
 * /admin/users/email/cycles:
 *   post:
 *     summary: Retrieve all cycles for a user by email
 *     tags: [Admin Routes | Admin Authentication Needed]
 *     security:
 *       - adminToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       '200':
 *         description: Successfully retrieved cycles for the specified user
 *       '401':
 *         description: Unauthorized request
 *       '400':
 *         description: Bad request
 */
router.post('/users/email/cycles', tokenVerification.adminTokenVerification, adminController.getUserCycles.bind(adminController));

// Route for updating a user by email
/**
 * @swagger
 * /admin/users/email:
 *   put:
 *     summary: Update a user by email
 *     tags: [Admin Routes | Admin Authentication Needed]
 *     security:
 *       - adminToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldEmail:
 *                 type: string
 *               newEmail:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '401':
 *         description: Unauthorized request
 *       '400':
 *         description: Bad request
 */
router.put('/users/email', tokenVerification.adminTokenVerification, adminController.updateUser.bind(adminController));

// Route for deleting a user by email
/**
 * @swagger
 * /admin/users/email:
 *   delete:
 *     summary: Delete a user by email
 *     tags: [Admin Routes | Admin Authentication Needed]
 *     security:
 *       - adminToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '204':
 *         description: User deleted successfully
 *       '401':
 *         description: Unauthorized request
 *       '400':
 *         description: Bad request
 */
router.delete('/users/email', tokenVerification.adminTokenVerification, adminController.deleteUser);

// Route for sending a forgot password link to a user
/**
 * @swagger
 * /admin/users/forgot-password:
 *   post:
 *     summary: Send a forgot password link to a user
 *     tags: [Admin Routes | Admin Authentication Needed]
 *     security:
 *       - adminToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Forgot password link sent successfully
 *       '401':
 *         description: Unauthorized request
 *       '400':
 *         description: Bad request
 */
router.post('/users/forgot-password', tokenVerification.adminTokenVerification, passwordController.forgotPass.bind(passwordController));

// Route for retrieving all cycles
/**
 * @swagger
 * /admin/cycles:
 *   get:
 *     summary: Retrieve all cycles
 *     tags: [Admin Routes | Admin Authentication Needed]
 *     security:
 *       - adminToken: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       '200':
 *         description: Successfully retrieved all cycles
 *       '401':
 *         description: Unauthorized request
 *       '400':
 *         description: Bad request
 */
router.get('/cycles', tokenVerification.adminTokenVerification, adminController.getCycles);

// Route for retrieving a cycle by cycleId
/**
 * @swagger
 * /admin/cycles/{cycleId}:
 *   get:
 *     summary: Retrieve a cycle by cycleId
 *     tags: [Admin Routes | Admin Authentication Needed]
 *     security:
 *       - adminToken: []
 *     parameters:
 *       - in: path
 *         name: cycleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved the cycle
 *       '401':
 *         description: Unauthorized request
 *       '404':
 *         description: Cycle not found
 */
router.get('/cycles/:cycleId', tokenVerification.adminTokenVerification, adminController.getCycle);

// Route for deleting a cycle by cycleId
/**
 * @swagger
 * /admin/cycles/{cycleId}:
 *   delete:
 *     summary: Delete a cycle by cycleId
 *     tags: [Admin Routes | Admin Authentication Needed]
 *     security:
 *       - adminToken: []
 *     parameters:
 *       - in: path
 *         name: cycleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Cycle deleted successfully
 *       '401':
 *         description: Unauthorized request
 *       '404':
 *         description: Cycle not found
 */
router.delete('/cycles/:cycleId', tokenVerification.adminTokenVerification, adminController.deleteCycle);

router.put('/switch', tokenVerification.adminTokenVerification, adminController.switchAdmin);

router.put('/deactivate', tokenVerification.adminTokenVerification, adminController.deactivateAdmin);

// Export the router
module.exports = router;
