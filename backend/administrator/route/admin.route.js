/* Admin Routes */
const { Router } = require('express');
const router = Router();
const adminController = require('../controller/admin.controller');
const { forgotPass } = require('../../controllers/password.reset');
const verify = require('../../middleware/tokenVerification');
const { body } = require('express-validator');

// Login to admin profile
router.post('/auth/login', [
    body('username').isString().notEmpty(),
    body('password').isString().notEmpty()
    ],
    adminController.login);

// Get all user
router.get('/users', verify, adminController.viewAllusers);

// Get user by userId
router.get('/users/:email', verify, adminController.viewUser);

// update user by email
router.put('/users/:email', [
    body('email').isString().notEmpty()
    ],
    verify, adminController.updateUser);

// Delete user
router.delete('/users/:email', adminController.deleteUser);

// Send forget password link to user
router.post('/users/forgot-password', [
    body('email').isString().notEmpty()
    ],
    verify, forgotPass);

// Get all cycles
router.get('/cycles', verify, adminController.viewAllCycles);

// Get user by cycleId
router.get('/cycles/:cycleId', verify, adminController.viewCycle);

// Delete cycle by cycleId
router.delete('/cycles/:cycleId', verify, adminController.deleteCycle);

module.exports = router;
