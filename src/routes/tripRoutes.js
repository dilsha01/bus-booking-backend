const express = require('express');
const { listTrips, createTrip } = require('../controllers/tripController');

const router = express.Router();

router.get('/', listTrips);
router.post('/', createTrip);

module.exports = router;
