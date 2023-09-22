const express = require('express');
const router = express.Router();
const cycleController = require('../controllers/cycle.controller');
const { body } = require('express-validator');

// create a cycle
router.post('/:userId/dashboard',
    cycleController.create);

// get all cycles for a user
router.get('/:userId/dashboard',
    cycleController.fetchAll);

// get cycle by cycleId
router.get('/:userId/dashboard/:cycleId',
    cycleController.fetchOne);

// get cycle by cycleId
router.get('/:userId/dashboard/:month',
    cycleController.fetchMonth);

// update cycle
router.get('/:userId/dashboard/:cycleId',
    cycleController.update);

// delete cycle
router.get('/:userId/dashboard/:cycleId',
    cycleController.delete);

module.exports = router;
