const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Bus = require('./Bus');

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
});

Bus.hasMany(Trip, { foreignKey: 'busId' });
Trip.belongsTo(Bus, { foreignKey: 'busId' });

module.exports = Trip;
