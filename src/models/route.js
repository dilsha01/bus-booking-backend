const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Route represents the structural path between two cities with ordered stops.
// It can optionally be tied to a specific service category (XL, AC, S, N).
const Route = sequelize.define('Route', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  routeNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('XL', 'AC', 'S', 'N'),
    allowNull: true,
  },
  origin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Ordered list of stops/sections along the route, including origin and destination
  stops: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

module.exports = Route;
