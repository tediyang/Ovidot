const express = require('express');
const cycleRoutes = express.Router();
const cc = require('../controllers/cycle.controller.js');

cycleRoutes.post("/cycles", cc.create);
cycleRoutes.put("/cycles/:id", cc.updateCycleById);
cycleRoutes.delete("/cycles/:id", cc.deleteCycleById);

module.exports = cycleRoutes;
