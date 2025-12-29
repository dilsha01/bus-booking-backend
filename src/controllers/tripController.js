const Trip = require('../models/trip');
const Bus = require('../models/bus');
const { Op } = require('sequelize');

async function listTrips(req, res) {
  try {
    const { origin, destination, date, limit = 50, offset = 0 } = req.query;
    
    const where = {};
    
    // For date we still filter at DB level; for origin/destination we
    // now mainly rely on in-memory filtering using the stops array
    // so we can support section-to-section search.
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      where.departureTime = { [Op.between]: [startDate, endDate] };
    }
    
    let trips = await Trip.findAll({ 
      where,
      include: Bus,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['departureTime', 'ASC']],
    });
    
    // Filter by origin/destination using stops (sections) if provided
    if (origin || destination) {
      const originLower = origin ? String(origin).toLowerCase() : null;
      const destinationLower = destination ? String(destination).toLowerCase() : null;

      trips = trips.filter((trip) => {
        const stops = Array.isArray(trip.stops) ? trip.stops : [];

        // Fallback: if no stops defined, keep old behavior using origin/destination fields
        if (stops.length === 0) {
          const matchesOrigin = originLower
            ? String(trip.origin || '').toLowerCase().includes(originLower)
            : true;
          const matchesDestination = destinationLower
            ? String(trip.destination || '').toLowerCase().includes(destinationLower)
            : true;
          return matchesOrigin && matchesDestination;
        }

        let fromIndex = 0;
        let toIndex = stops.length - 1;

        if (originLower) {
          fromIndex = stops.findIndex((s) => s.toLowerCase() === originLower);
          if (fromIndex === -1) return false;
        }

        if (destinationLower) {
          toIndex = stops.findIndex((s) => s.toLowerCase() === destinationLower);
          if (toIndex === -1) return false;
        }

        if (fromIndex >= toIndex) return false;
        return true;
      });
    }
    
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
    const { origin, destination, departureTime, arrivalTime, price, busId, routeNumber, stops } = req.body;
    
    // Validation
    if (!origin || !destination || !departureTime || !arrivalTime || !price || !busId || !routeNumber) {
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
    
    // Normalize stops if provided from admin UI (comma-separated string)
    let normalizedStops = stops;
    if (typeof stops === 'string') {
      normalizedStops = stops
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }

    const trip = await Trip.create({
      origin,
      destination,
      departureTime,
      arrivalTime,
      price,
      busId,
      routeNumber,
      stops: Array.isArray(normalizedStops) && normalizedStops.length > 0 ? normalizedStops : null,
    });
    
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
    
    const updatedData = { ...req.body };

    // Normalize stops if provided as comma-separated string from admin UI
    if (typeof updatedData.stops === 'string') {
      updatedData.stops = updatedData.stops
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    
    await trip.update(updatedData);
    
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
