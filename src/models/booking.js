const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./user');
const Trip = require('./trip');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  seats: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    defaultValue: 'confirmed',
  },
  // Boarding stop name within the route (section start)
  startStop: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Drop-off stop name within the route (section end)
  endStop: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Total price for this booking (all seats, this section)
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
});

User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Trip.hasMany(Booking, { foreignKey: 'tripId' });
Booking.belongsTo(Trip, { foreignKey: 'tripId' });

module.exports = Booking;
