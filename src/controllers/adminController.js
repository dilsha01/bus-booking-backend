const Bus = require('../models/bus');
const Trip = require('../models/trip');
const Booking = require('../models/booking');
const User = require('../models/user');
const { sequelize } = require('../config/db');

async function getDashboardStats(req, res) {
  try {
    const totalBuses = await Bus.count();
    const totalTrips = await Trip.count();
    const totalBookings = await Booking.count();
    const totalUsers = await User.count();
    
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
      totalUsers,
      revenue: revenue[0]?.totalRevenue || 0,
      bookingsByStatus,
      recentBookings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: err.message });
  }
}

// Get all users
async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'isVerified', 'createdAt'],
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Booking,
          attributes: ['id', 'status'],
          required: false
        }
      ]
    });

    // Add booking count to each user
    const usersWithStats = users.map(user => {
      const userData = user.toJSON();
      userData.totalBookings = userData.Bookings ? userData.Bookings.length : 0;
      delete userData.Bookings;
      return userData;
    });

    res.json(usersWithStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
}

// Get user by ID with details
async function getUserById(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'role', 'isVerified', 'createdAt'],
      include: [
        {
          model: Booking,
          include: [
            {
              model: Trip,
              include: Bus
            }
          ],
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
}

// Update user
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, role, isVerified } = req.body;

    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof isVerified === 'boolean') user.isVerified = isVerified;

    await user.save();

    // Return user without sensitive data
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt
    };

    res.json({ message: 'User updated successfully', user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
}

// Delete user
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting admin users (optional safety check)
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
}

module.exports = { 
  getDashboardStats, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
};
