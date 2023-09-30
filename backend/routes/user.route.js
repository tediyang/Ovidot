// user.route.js

const { Router } = require('express');
const router = Router();
const userController = require('../controllers/user.controller');
const verify = require('../middleware/tokenVerification');
const { body } = require('express-validator');

/**
 * update user data
 * get user data
 * delete user
 */

// Get user data
router.get('/:userId', verify, userController.fetch);

// Update user data
router.put('/:userId', [
    body('username').isString(),
    body('age').isNumeric()
    ],
    verify, userController.update);

// Delete user
router.delete('/:userId', verify, userController.delete);

module.exports = router;
