const express = require('express');
const { listTrips, getTrip, createTrip, updateTrip, deleteTrip } = require('../controllers/tripController');

const router = express.Router();

router.get('/', listTrips);
router.get('/:id', getTrip);
router.post('/', createTrip);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

module.exports = router;
