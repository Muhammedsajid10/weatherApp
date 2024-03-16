const express = require('express');
const authenticationToken = require('../Middleware/protect');
const { addLocation, getLocations, getLocationsId } = require('../Controller.js/location');
const router = express.Router();

router.use(authenticationToken); // Protect all routes in this router

router.route('/add').post(addLocation); 
router.route('/').get(getLocations); 
router.route('/user/:userId').get(getLocationsId);

module.exports = router;
