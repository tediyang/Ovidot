
// Import necessary modules
const { Router } = require('express');
const userController = require('../../controllers/user.controller.js');

// Create an Express router
const router /** @type {ExpressRouter} */ = Router();

/**
 * @swagger
 * tags:
 *   name: User Routes | Authentication Needed
 *   description: Endpoints related to user operations
 */

// Route to get user data
/**
 * @swagger
 * /users/get:
 *   get:
 *     summary: Get user data
 *     tags: [User Routes | Authentication Needed]
 *     security:
 *       - userToken: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved user data
 *       '401':
 *         description: Unauthorized request
 */
router.get('/fetch', userController.fetchUser.bind(userController));

// Route to update user data
/**
 * @swagger
 * /users/update:
 *   put:
 *     summary: Update user data
 *     tags: [User Routes | Authentication Needed]
 *     security:
 *       - userToken: []
 *     responses:
 *       '200':
 *         description: User data updated successfully
 *       '401':
 *         description: Unauthorized request
 *       '400':
 *         description: Bad request
 */
router.put('/update', userController.updateUser.bind(userController));

router.get('/deactivate', userController.deactivateUser);
// Route to delete user by UserId
/**
 * @swagger
 * /users/delete:
 *   delete:
 *     summary: Delete user by UserId
 *     tags: [User Routes | Authentication Needed]
 *     security:
 *       - userToken: []
 *     responses:
 *       '204':
 *         description: User deleted successfully
 *       '401':
 *         description: Unauthorized request
 *       '400':
 *         description: Bad request
 */
router.delete('/delete', userController.deleteUser);

// Route to get notifications by UserId
/**
 * @swagger
 * /users/notifications:
 *   get:
 *     summary: Get notifications by UserId
 *     tags: [User Routes | Authentication Needed]
 *     security:
 *       - userToken: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved notifications
 *       '401':
 *         description: Unauthorized request
 *       '400':
 *         description: Bad request
 */
router.get('/notifications/:id', userController.getNotification);

router.delete('/notifications/:id', userController.deleteNotification);

router.get('/notifications', userController.getNotifications);


module.exports = router;
