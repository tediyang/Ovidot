// Authenticated routes
import { Router } from 'express';
const router = Router();
import userRoutes from './auth/user.routes.js';
import cycleRoutes from './auth/cycle.routes.js';
import { logout } from '../controllers/register.controller.js';


// user CRUD routes
router.use('/users', userRoutes);

// cycle CRUD routes
router.use('/cycles', cycleRoutes);

// Logout a user
router.get('/logout', logout);

export default router;
