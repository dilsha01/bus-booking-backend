const express = require('express');
const { listBookings, getBooking, createBooking, updateBooking, deleteBooking } = require('../controllers/bookingController');

const router = express.Router();

router.get('/', listBookings);
router.get('/:id', getBooking);
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

module.exports = router;
