const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Bus = sequelize.define('Bus', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  numberPlate: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  totalSeats: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('XL', 'AC', 'S', 'N'),
    allowNull: true,
  },
});

module.exports = Bus;
