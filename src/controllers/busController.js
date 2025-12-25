const Bus = require('../models/bus');

async function listBuses(req, res) {
  try {
    const buses = await Bus.findAll();
    res.json(buses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch buses' });
  }
}

async function getBus(req, res) {
  try {
    const bus = await Bus.findByPk(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json(bus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch bus' });
  }
}

async function createBus(req, res) {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json(bus);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to create bus', error: err.message });
  }
}

async function updateBus(req, res) {
  try {
    const bus = await Bus.findByPk(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    await bus.update(req.body);
    res.json(bus);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to update bus', error: err.message });
  }
}

async function deleteBus(req, res) {
  try {
    const bus = await Bus.findByPk(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    await bus.destroy();
    res.json({ message: 'Bus deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete bus', error: err.message });
  }
}

module.exports = { listBuses, getBus, createBus, updateBus, deleteBus };
