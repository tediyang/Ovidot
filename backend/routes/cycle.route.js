// cycle.route.js
const { Router } = require('express');
const router = Router();
const cycleController = require('../controllers/cycle.controller');
const verify = require('../middleWare/tokenVerification');

/**
 * create
 * get all
 * get by cycleId
 * get by month
 * update
 * delete
 **/
router.post('/:userId/cycles', verify, cycleController.create);
router.get('/:userId/cycles', verify, cycleController.fetchAll);
router.get('/:userId/cycles/:cycleId', verify, cycleController.fetchOne);
router.get('/:userId/cycles/:month', verify, cycleController.fetchMonth);
router.put('/:userId/cycles/:cycleId', verify, cycleController.update);
router.delete('/:userId/cycles/:cycleId', verify, cycleController.delete);

module.exports = router;
