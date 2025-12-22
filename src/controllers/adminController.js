const Bus = require('../models/Bus');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');
const { sequelize } = require('../config/db');

async function getDashboardStats(req, res) {
  try {
    const totalBuses = await Bus.count();
    const totalTrips = await Trip.count();
    const totalBookings = await Booking.count();
    
    const recentBookings = await Booking.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        { 
          model: Trip, 
          include: Bus 
        }
      ]
    });

    const bookingsByStatus = await Booking.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'count']
      ],
      group: ['status']
    });

    const revenue = await Booking.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.literal('seats * Trip.price')), 'totalRevenue']
      ],
      include: [{ model: Trip, attributes: [] }],
      where: { status: 'confirmed' },
      raw: true
    });

    res.json({
      totalBuses,
      totalTrips,
      totalBookings,
      revenue: revenue[0]?.totalRevenue || 0,
      bookingsByStatus,
      recentBookings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: err.message });
  }
}

module.exports = { getDashboardStats };
