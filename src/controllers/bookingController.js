const Booking = require('../models/Booking');
const Trip = require('../models/Trip');

async function listBookings(req, res) {
  try {
    const bookings = await Booking.findAll({ include: Trip });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
}

async function createBooking(req, res) {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to create booking', error: err.message });
  }
}

module.exports = { listBookings, createBooking };
