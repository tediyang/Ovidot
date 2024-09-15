
// Import necessary modules
const { Router } = require('express');
const userRoutes = require('./auth/user.routes.js');
const cycleRoutes = require('./auth/cycle.routes.js');
const appController = require('../controllers/register.controller.js');

// Create an Express router
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Logout Route | Authentication Needed
 *   description: Endpoints requiring authentication
 */

router.use('/users', userRoutes);
router.use('/cycles', cycleRoutes);

// Route to log out a user
/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Log out a user
 *     tags: [Logout Route | Authentication Needed]
 *     security:
 *       - userToken: []
 *     responses:
 *       '200':
 *         description: User logged out successfully
 *       '401':
 *         description: Unauthorized request
 */
router.get('/logout', appController.logout);


module.exports = router;
