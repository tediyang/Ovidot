
// Import necessary modules
const { Router } = require('express');
const userRoutes = require('./auth/user.routes.js');
const cycleRoutes = require('./auth/cycle.routes.js');
const appController = require('../controllers/register.controller.js');

// Create an Express router
const router = Router();

router.use('/users', userRoutes);
router.use('/cycles', cycleRoutes);

/**
 * Route to logout user
 * @swagger
 * paths:
 *   /logout:
 *      get:
 *        summary: Logout user
 *        tags:
 *          - User Routes
 *        security:
 *          - userToken: []
 * 
 *      responses:
 *        '200':
 *          description: Succesful
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    description: Logout Successful
 * 
 *        '500':
 *          description: Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                  error:
 *                    type: object
 */
router.get('/logout', appController.logout);


module.exports = router;
