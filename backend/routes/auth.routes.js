// Authenticated routes
const { Router } = require('express');
const router = Router();
const userRoutes = require('./auth/user.routes');
const cycleRoutes = require('./auth/cycle.routes');
const regController = require('../controllers/register.controller.js');


// user CRUD routes
router.use('/users', userRoutes);

// cycle CRUD routes
router.use('/cycles', cycleRoutes);

// Logout a user
router.get('/logout', regController.logout);

module.exports = router;
