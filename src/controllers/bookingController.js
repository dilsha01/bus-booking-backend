const Booking = require('../models/booking');
const Trip = require('../models/trip');
const User = require('../models/user');
const Bus = require('../models/bus');
const { Op } = require('sequelize');

async function listBookings(req, res) {
  try {
    const { status, userId, tripId, limit = 50, offset = 0 } = req.query;
    
    const where = {};
    
    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (tripId) where.tripId = tripId;
    
    const bookings = await Booking.findAll({ 
      where,
      include: [
        { model: Trip, include: Bus },
        User
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });
    
    res.json({ 
      success: true,
      data: bookings,
      count: bookings.length,
    });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch bookings',
      error: err.message,
    });
  }
}

async function getBooking(req, res) {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid booking ID',
      });
    }
    
    const booking = await Booking.findByPk(id, { 
      include: [
        { model: Trip, include: Bus },
        User
      ] 
    });
    
    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found',
      });
    }
    
    res.json({ 
      success: true,
      data: booking,
    });
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch booking',
      error: err.message,
    });
  }
}

async function createBooking(req, res) {
  try {
    const { userId, tripId, seats, startStop, endStop } = req.body;
    
    // Validation
    if (!userId || !tripId || !seats) {
      return res.status(400).json({ 
        success: false,
        message: 'User ID, Trip ID, and seats are required',
      });
    }
    
    if (seats < 1 || seats > 10) {
      return res.status(400).json({ 
        success: false,
        message: 'Seats must be between 1 and 10',
      });
    }
    
    // Check if trip exists
    const trip = await Trip.findByPk(tripId, { include: Bus });
    if (!trip) {
      return res.status(404).json({ 
        success: false,
        message: 'Trip not found',
      });
    }

    // Validate section selection if provided
    let totalPrice = null;
    if (startStop && endStop && Array.isArray(trip.stops) && trip.stops.length >= 2) {
      const stops = trip.stops;
      const fromIndex = stops.findIndex((s) => s.toLowerCase() === String(startStop).toLowerCase());
      const toIndex = stops.findIndex((s) => s.toLowerCase() === String(endStop).toLowerCase());

      if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
        return res.status(400).json({
          success: false,
          message: 'Invalid section selection for this route',
        });
      }

      const fullSegments = stops.length - 1;
      const basePrice = parseFloat(trip.price); // full route price per seat
      const pricePerSegment = fullSegments > 0 ? basePrice / fullSegments : basePrice;
      const segmentCount = toIndex - fromIndex;
      const pricePerSeatForSection = pricePerSegment * segmentCount;
      totalPrice = Number((pricePerSeatForSection * seats).toFixed(2));
    }
    
    // Check seat availability
    const existingBookings = await Booking.findAll({
      where: { 
        tripId,
        status: { [Op.ne]: 'cancelled' },
      },
    });
    
    const bookedSeats = existingBookings.reduce((sum, booking) => sum + booking.seats, 0);
    const availableSeats = trip.Bus.totalSeats - bookedSeats;
    
    if (seats > availableSeats) {
      return res.status(400).json({ 
        success: false,
        message: `Only ${availableSeats} seats available`,
        availableSeats,
      });
    }
    
    // Create booking
    const booking = await Booking.create({
      userId,
      tripId,
      seats,
      status: 'confirmed',
      startStop: startStop || null,
      endStop: endStop || null,
      totalPrice,
    });
    
    // Fetch complete booking with relations
    const completeBooking = await Booking.findByPk(booking.id, {
      include: [
        { model: Trip, include: Bus },
        User
      ],
    });
    
    res.status(201).json({ 
      success: true,
      message: 'Booking created successfully',
      data: completeBooking,
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(400).json({ 
      success: false,
      message: 'Failed to create booking',
      error: err.message,
    });
  }
}

async function updateBooking(req, res) {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid booking ID',
      });
    }
    
    const booking = await Booking.findByPk(id);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found',
      });
    }
    
    // If updating seats, check availability
    if (req.body.seats && req.body.seats !== booking.seats) {
      const trip = await Trip.findByPk(booking.tripId, { include: Bus });
      const existingBookings = await Booking.findAll({
        where: { 
          tripId: booking.tripId,
          id: { [Op.ne]: id },
          status: { [Op.ne]: 'cancelled' },
        },
      });
      
      const bookedSeats = existingBookings.reduce((sum, b) => sum + b.seats, 0);
      const availableSeats = trip.Bus.totalSeats - bookedSeats;
      
      if (req.body.seats > availableSeats) {
        return res.status(400).json({ 
          success: false,
          message: `Only ${availableSeats} seats available`,
          availableSeats,
        });
      }
    }
    
    await booking.update(req.body);
    
    const updatedBooking = await Booking.findByPk(id, {
      include: [
        { model: Trip, include: Bus },
        User
      ],
    });
    
    res.json({ 
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking,
    });
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(400).json({ 
      success: false,
      message: 'Failed to update booking',
      error: err.message,
    });
  }
}

async function deleteBooking(req, res) {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid booking ID',
      });
    }
    
    const booking = await Booking.findByPk(id);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found',
      });
    }
    
    await booking.destroy();
    
    res.json({ 
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete booking',
      error: err.message,
    });
  }
}

module.exports = { listBookings, getBooking, createBooking, updateBooking, deleteBooking };
