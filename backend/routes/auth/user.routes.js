// User Routes
const { Router } = require('express');
const router /** @type {ExpressRouter} */ = Router();
const userController = require('../../controllers/user.controller');
const passController = require('../../controllers/password.controller.js');
const { body } = require('express-validator');

// Get user data
router.get('/get', userController.fetch);

// Update user data
router.put('/update', userController.update);

// Delete user by UserId
router.delete('/delete', userController.delete);

// Change logged-in user password
router.put('/change-password', [
    body("currentPassword").isString().notEmpty(),
    body("newPassword").isString().notEmpty(),
    ],
    passController.changePass);

module.exports = router;
