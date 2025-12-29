const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Bus = require('./bus');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  origin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Route number, e.g. "138" for Maharagama - Colombo
  routeNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  departureTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  arrivalTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  // Ordered list of stops/sections along the route, including origin and destination
  stops: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

Bus.hasMany(Trip, { foreignKey: 'busId' });
Trip.belongsTo(Bus, { foreignKey: 'busId' });

module.exports = Trip;
