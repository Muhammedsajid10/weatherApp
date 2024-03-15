const express = require('express');
const authenticationToken = require('../Middleware/protect');
const { addLocation, getLocations } = require('../Controller.js/location');
const router = express.Router();

router.use(authenticationToken); // Protect all routes in this router

router.route('/add').post(addLocation); 
router.route('/').get(getLocations); 

module.exports = router;
