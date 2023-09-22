const express = require('express');
const authRoutes = require('./auth.route.js');
const cycleRoutes = require('./cycle.route.js');

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/cycles", cycleRoutes);

module.exports = router;
