// ADMIN ROUTES
import { Router } from 'express';
const router /** @type {ExpressRouter} */ = Router();
import adminController from '../controller/admin.controller.js';
import { forgotPass } from '../../controllers/password.controller.js';
import verifyAdmin from '../middleware/token.admin.verify.js';
import { body } from 'express-validator';
import { logout } from '../../controllers/register.controller.js';

/** Route for logging into the admin profile. */
router.post('/login', [
    body('username').isString().notEmpty(),
    body('password').isString().notEmpty()
    ],
    adminController.login);

/** Logout admin */
router.get('/logout', verifyAdmin, logout);

/** Route for retrieving all users. */
router.get('/users', verifyAdmin, adminController.viewAllusers);

/** Route for retrieving a user by email. */
router.post('/users/email', [
    body('email').isString().notEmpty()
    ],
    verifyAdmin, adminController.viewUser);

/** Route for retrieving all cycles for an email */
router.post('/users/email/cycles', [
    body('email').isString().notEmpty()
    ],
    verifyAdmin, adminController.getAllCyclesByEmail);

/** Route for updating a user by email. */
router.put('/users/email', [
    body('oldEmail').isString().notEmpty(),
    body('newEmail').isString().notEmpty()
    ],
    verifyAdmin, adminController.updateUser);

/** Route for deleting a user by email. */
router.delete('/users/email', [
    body('email').isString().notEmpty()
    ],
    verifyAdmin, adminController.deleteUser);

/** Route for sending a forgot password link to a user. */
router.post('/users/forgot-password', [
    body('email').isString().notEmpty()
    ],
    verifyAdmin, forgotPass);

/** Route for retrieving all cycles. */
router.get('/cycles', verifyAdmin, adminController.viewAllCycles);

/** Route for retrieving a cycle by cycleId. */
router.get('/cycles/:cycleId', verifyAdmin, adminController.viewCycle);

/** Route for deleting a cycle by cycleId. */
router.delete('/cycles/:cycleId', verifyAdmin, adminController.deleteCycle);

export default router;
