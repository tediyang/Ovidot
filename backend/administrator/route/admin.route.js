/* route */
const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');
const verify = require('../../middleware/tokenVerification');
/**
 * create new admin
 * delete admin
 * view all cycle
 * view by Id
 * edit cycle
 * delete cycle
 **/
router.post('/create', adminController.createAdmin);
router.delete('/delete/:adminId', verify, adminController.deleteAdmin);
router.get('/view-all-cycle-data', verify, adminController.viewAllCycleData);
router.get('/view-specific-cycle-data/:cycleId', verify, adminController.viewSpecificCycleData);
router.put('/edit-cycle-data/:cycleId', verify, adminController.editCycleData);
router.delete('/delete-cycle-data/:cycleId', verify, adminController.deleteCycleData);

module.exports = router;
