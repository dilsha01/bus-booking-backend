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

async function getTrip(req, res) {
  try {
    const trip = await Trip.findByPk(req.params.id, { include: Bus });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch trip' });
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

async function updateTrip(req, res) {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    await trip.update(req.body);
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to update trip', error: err.message });
  }
}

async function deleteTrip(req, res) {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    await trip.destroy();
    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete trip', error: err.message });
  }
}

module.exports = { listTrips, getTrip, createTrip, updateTrip, deleteTrip };
