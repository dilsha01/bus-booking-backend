const Route = require('../models/route');
const Trip = require('../models/trip');

// List all routes
async function listRoutes(req, res) {
  try {
    const routes = await Route.findAll({
      order: [['routeNumber', 'ASC']],
    });

    res.json({ success: true, data: routes });
  } catch (err) {
    console.error('Error fetching routes:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch routes',
      error: err.message,
    });
  }
}

// Get single route by id
async function getRoute(req, res) {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid route ID' });
    }

    const route = await Route.findByPk(id);

    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }

    res.json({ success: true, data: route });
  } catch (err) {
    console.error('Error fetching route:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch route',
      error: err.message,
    });
  }
}

// Helper to normalize stops coming from admin UI
function normalizeStops(stops) {
  if (!stops) return null;

  if (Array.isArray(stops)) {
    const cleaned = stops
      .map((s) => (s != null ? String(s).trim() : ''))
      .filter((s) => s.length > 0);
    return cleaned.length ? cleaned : null;
  }

  if (typeof stops === 'string') {
    const cleaned = stops
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    return cleaned.length ? cleaned : null;
  }

  return null;
}

// Create new route
async function createRoute(req, res) {
  try {
    const { routeNumber, origin, destination, stops, category } = req.body;

    if (!routeNumber || !origin || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Route number, origin and destination are required',
      });
    }

    // category is optional, but if provided must be one of the known values
    const allowedCategories = ['XL', 'AC', 'S', 'N'];
    if (category && !allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be one of XL, AC, S, N',
      });
    }

    const normalizedStops = normalizeStops(stops);

    const route = await Route.create({
      routeNumber,
      origin,
      destination,
      category: category || null,
      stops: normalizedStops,
    });

    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      data: route,
    });
  } catch (err) {
    console.error('Error creating route:', err);
    res.status(400).json({
      success: false,
      message: 'Failed to create route',
      error: err.message,
    });
  }
}

// Update existing route and keep linked trips in sync
async function updateRoute(req, res) {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid route ID' });
    }

    const route = await Route.findByPk(id);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }

    const { routeNumber, origin, destination, stops, category } = req.body;

    const normalizedStops = normalizeStops(stops);

    const allowedCategories = ['XL', 'AC', 'S', 'N'];
    let newCategory = route.category;
    if (category !== undefined) {
      if (category === null || category === '') {
        newCategory = null;
      } else if (!allowedCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category. Must be one of XL, AC, S, N',
        });
      } else {
        newCategory = category;
      }
    }

    await route.update({
      routeNumber: routeNumber ?? route.routeNumber,
      origin: origin ?? route.origin,
      destination: destination ?? route.destination,
      category: newCategory,
      stops: normalizedStops !== null ? normalizedStops : route.stops,
    });

    // Keep trips that reference this route in sync with latest structural data
    await Trip.update(
      {
        routeNumber: route.routeNumber,
        origin: route.origin,
        destination: route.destination,
        stops: route.stops,
      },
      {
        where: { routeId: route.id },
      }
    );

    res.json({
      success: true,
      message: 'Route updated successfully',
      data: route,
    });
  } catch (err) {
    console.error('Error updating route:', err);
    res.status(400).json({
      success: false,
      message: 'Failed to update route',
      error: err.message,
    });
  }
}

// Delete route (only if no trips reference it)
async function deleteRoute(req, res) {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid route ID' });
    }

    const route = await Route.findByPk(id);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }

    const tripCount = await Trip.count({ where: { routeId: route.id } });
    if (tripCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete route while trips are using it',
      });
    }

    await route.destroy();

    res.json({ success: true, message: 'Route deleted successfully' });
  } catch (err) {
    console.error('Error deleting route:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete route',
      error: err.message,
    });
  }
}

module.exports = { listRoutes, getRoute, createRoute, updateRoute, deleteRoute };
