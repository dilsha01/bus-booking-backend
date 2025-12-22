const Trip = require('../models/Trip');
const Bus = require('../models/Bus');

async function listTrips(req, res) {
  try {
    const trips = await Trip.findAll({ include: Bus });
    res.json(trips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch trips' });
  }
}

async function createTrip(req, res) {
  try {
    const trip = await Trip.create(req.body);
    res.status(201).json(trip);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to create trip', error: err.message });
  }
}

module.exports = { listTrips, createTrip };
