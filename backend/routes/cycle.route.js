// cycle.route.js
const { Router } = require('express');
const router = Router();
const { body } = require('express-validator');
const cycleController = require('../controllers/cycle.controller');
const verify = require('../middleware/tokenVerification');

// Create cycle
router.post('/:userId/cycles', [
    body("period").isNumeric().notEmpty(),
    body("startdate").isString().notEmpty()
    ],
    verify, cycleController.create);

// Fetch all cycles
router.get('/:userId/cycles', verify, cycleController.fetchAll);

// Fetch one cycle
router.get('/:userId/cycles/:cycleId', verify, cycleController.fetchOne);

// Fetch cycles for a given month
router.get('/:userId/:month', verify, cycleController.fetchMonth);

// Update a cycle
router.put('/:userId/cycles/:cycleId', [
    body("period").isNumeric(),
    body("ovulation").isString()
    ],
    verify, cycleController.update);

// Delete the cycle
router.delete('/:userId/cycles/:cycleId', verify, cycleController.delete);

module.exports = router;
