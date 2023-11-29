// Cycle routes.
import { Router } from 'express';
const router /** @type {ExpressRouter} */ = Router();
import { body } from 'express-validator';
import * as cycle from '../../controllers/cycle.controller.js';

// Create a cycle
router.post('/create', [
    body("period").isNumeric().notEmpty(),
    body("startdate").isString().notEmpty()
    ],
    cycle.createCycle);

// Get user id
router.get('/getall', cycle.fetchAllCycles);

// Get a cycle using cycleId
router.get('/:cycleId', cycle.fetchOneCycle);

// Get cycles by month
router.get('/getcycles/:month/:year', cycle.fetchMonth);

// Update cycle
router.put('/:cycleId', cycle.updateCycle);

// Delete cycle by cycleId
router.delete('/:cycleId', cycle.deleteCycle);

export default router;
