const express = require('express');
const {userReg, userLogin} = require('../Controller.js/auth');
const authenticationToken = require('../Middleware/protect');
const dashBoard = require('../Controller.js/dashboard');
const router = express.Router();

const middleware = [authenticationToken]

router.route('/reg').post(userReg)
router.route('/login').post(userLogin)
router.route('/dash').get(middleware,dashBoard)

module.exports = router;