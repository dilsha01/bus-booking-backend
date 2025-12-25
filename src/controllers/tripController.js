const Trip = require('../models/Trip');
const Bus = require('../models/Bus');
const { Op } = require('sequelize');

async function listTrips(req, res) {
  try {
    const { origin, destination, date, limit = 50, offset = 0 } = req.query;
    
    const where = {};
    
    if (origin) {
      where.origin = { [Op.like]: `%${origin}%` };
    }
    
    if (destination) {
      where.destination = { [Op.like]: `%${destination}%` };
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      where.departureTime = { [Op.between]: [startDate, endDate] };
    }
    
    const trips = await Trip.findAll({ 
      where,
      include: Bus,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['departureTime', 'ASC']],
    });
    
    res.json({ 
      success: true, 
      data: trips,
      count: trips.length,
    });
  } catch (err) {
    console.error('Error fetching trips:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch trips',
      error: err.message,
    });
  }
}

async function getTrip(req, res) {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid trip ID',
      });
    }
    
    const trip = await Trip.findByPk(id, { include: Bus });
    
    if (!trip) {
      return res.status(404).json({ 
        success: false,
        message: 'Trip not found',
      });
    }
    
    res.json({ 
      success: true,
      data: trip,
    });
  } catch (err) {
    console.error('Error fetching trip:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch trip',
      error: err.message,
    });
  }
}

async function createTrip(req, res) {
  try {
    const { origin, destination, departureTime, arrivalTime, price, busId } = req.body;
    
    // Validation
    if (!origin || !destination || !departureTime || !arrivalTime || !price || !busId) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required',
      });
    }
    
    // Check if bus exists
    const bus = await Bus.findByPk(busId);
    if (!bus) {
      return res.status(404).json({ 
        success: false,
        message: 'Bus not found',
      });
    }
    
    const trip = await Trip.create(req.body);
    
    res.status(201).json({ 
      success: true,
      message: 'Trip created successfully',
      data: trip,
    });
  } catch (err) {
    console.error('Error creating trip:', err);
    res.status(400).json({ 
      success: false,
      message: 'Failed to create trip',
      error: err.message,
    });
  }
}

async function updateTrip(req, res) {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid trip ID',
      });
    }
    
    const trip = await Trip.findByPk(id);
    
    if (!trip) {
      return res.status(404).json({ 
        success: false,
        message: 'Trip not found',
      });
    }
    
    // If busId is being updated, validate it
    if (req.body.busId) {
      const bus = await Bus.findByPk(req.body.busId);
      if (!bus) {
        return res.status(404).json({ 
          success: false,
          message: 'Bus not found',
        });
      }
    }
    
    await trip.update(req.body);
    
    res.json({ 
      success: true,
      message: 'Trip updated successfully',
      data: trip,
    });
  } catch (err) {
    console.error('Error updating trip:', err);
    res.status(400).json({ 
      success: false,
      message: 'Failed to update trip',
      error: err.message,
    });
  }
}

async function deleteTrip(req, res) {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid trip ID',
      });
    }
    
    const trip = await Trip.findByPk(id);
    
    if (!trip) {
      return res.status(404).json({ 
        success: false,
        message: 'Trip not found',
      });
    }
    
    await trip.destroy();
    
    res.json({ 
      success: true,
      message: 'Trip deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting trip:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete trip',
      error: err.message,
    });
  }
}

module.exports = { listTrips, getTrip, createTrip, updateTrip, deleteTrip };
