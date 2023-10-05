/**
 * Express router for cycle-related routes.
 * @typedef {Object} ExpressRouter
 */

const { Router } = require('express');
const router /** @type {ExpressRouter} */ = Router();
const { body } = require('express-validator');
const cycleController = require('../../controllers/cycle.controller');

// Create a cycle
router.post('/create', [
    body("period").isNumeric().notEmpty(),
    body("startdate").isString().notEmpty()
    ],
    cycleController.create);

// Get user id
router.get('/getall', cycleController.fetchAll);

// Get a cycle using cycleId
router.get('/:cycleId', cycleController.fetchOne);

// Get cycles by month
router.get('/getall/:month', cycleController.fetchMonth);

// Update cycle
router.put('/:cycleId', cycleController.update);

// Delete cycle by cycleId
router.delete('/:cycleId', cycleController.delete);

module.exports = router;
