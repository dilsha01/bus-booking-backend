const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const User = require('../models/User');
const Bus = require('../models/Bus');

async function listBookings(req, res) {
  try {
    const bookings = await Booking.findAll({ 
      include: [
        { model: Trip, include: Bus },
        User
      ] 
    });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
}

async function getBooking(req, res) {
  try {
    const booking = await Booking.findByPk(req.params.id, { 
      include: [
        { model: Trip, include: Bus },
        User
      ] 
    });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch booking' });
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

async function updateBooking(req, res) {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    await booking.update(req.body);
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to update booking', error: err.message });
  }
}

async function deleteBooking(req, res) {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    await booking.destroy();
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete booking', error: err.message });
  }
}

module.exports = { listBookings, getBooking, createBooking, updateBooking, deleteBooking };
