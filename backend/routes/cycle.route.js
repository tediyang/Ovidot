// cycle.route.js

const express = require('express');
const router = express.Router();
const cycleController = require('../controllers/cycle.controller');
const verify = require('../middleWare/tokenVerification');

/* protect routes */
router.use('/:userId/cycles', verify);

/**
 * create
 * gell all
 * get by cycleId
 * get by month
 * update
 * delete
 **/
router.post('/:userId/cycles', cycleController.create);
router.get('/:userId/cycles', cycleController.fetchAll);
router.get('/:userId/cycles/:cycleId', cycleController.fetchOne);
router.get('/:userId/cycles/:month', cycleController.fetchMonth);
router.put('/:userId/cycles/:cycleId', cycleController.update);
router.delete('/:userId/cycles/:cycleId', cycleController.delete);

module.exports = router;
