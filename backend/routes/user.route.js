// user.route.js

const { Router } = require('express');
const router = Router();
const userController = require('../controllers/user.controller');
const verify = require('../middleWare/tokenVerification');

/**
 * update user data
 * get user data
 * delete user
 */
router.get('/:userId', verify, userController.fetch);
router.put('/:userId', verify, userController.update);
router.delete('/:userId', verify, userController.delete);

module.exports = router;
