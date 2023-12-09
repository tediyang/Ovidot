// User Routes
import { Router } from 'express';
const router /** @type {ExpressRouter} */ = Router();
import * as user from '../../controllers/user.controller.js';
import { changePass } from '../../controllers/password.controller.js';
import { body } from 'express-validator';

// Get user data
router.get('/get', user.fetchUser);

// Update user data
router.put('/update', user.updateUser);

// Delete user by UserId
router.delete('/delete', user.deleteUser);

// Change logged-in user password
router.put('/change-password', [
    body("currentPassword").isString().notEmpty(),
    body("newPassword").isString().notEmpty(),
    ],
    changePass);

export default router;
