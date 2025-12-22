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
    allowNull: false,
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
});

module.exports = Bus;
