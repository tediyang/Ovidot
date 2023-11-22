// ADMIN ROUTES
import { Router } from 'express';
const router /** @type {ExpressRouter} */ = Router();
import { login, viewAllusers, viewUser,
    updateUser, deleteUser, viewAllCycles,
    viewCycle, deleteCycle } from '../controller/admin.controller';
import { forgotPass } from '../../controllers/password.controller';
import verifyAdmin from '../middleware/token.admin.verify';
import { body } from 'express-validator';
import { logout } from '../../controllers/register.controller';

/** Route for logging into the admin profile. */
router.post('/login', [
    body('username').isString().notEmpty(),
    body('password').isString().notEmpty()
    ],
    login);

/** Logout admin */
router.get('/logout', verifyAdmin, logout);

/** Route for retrieving all users. */
router.get('/users', verifyAdmin, viewAllusers);

/** Route for retrieving a user by email. */
router.post('/users/email', [
    body('email').isString().notEmpty()
    ],
    verifyAdmin, viewUser);

/** Route for updating a user by email. */
router.put('/users/email', [
    body('oldEmail').isString().notEmpty(),
    body('newEmail').isString().notEmpty()
    ],
    verifyAdmin, updateUser);

/** Route for deleting a user by email. */
router.delete('/users/email', [
    body('email').isString().notEmpty()
    ],
    verifyAdmin, deleteUser);

/** Route for sending a forgot password link to a user. */
router.post('/users/forgot-password', [
    body('email').isString().notEmpty()
    ],
    verifyAdmin, forgotPass);

/** Route for retrieving all cycles. */
router.get('/cycles', verifyAdmin, viewAllCycles);

/** Route for retrieving a cycle by cycleId. */
router.get('/cycles/:cycleId', verifyAdmin, viewCycle);

/** Route for deleting a cycle by cycleId. */
router.delete('/cycles/:cycleId', verifyAdmin, deleteCycle);

export default router;
