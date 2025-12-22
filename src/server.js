const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/db');
const tripRoutes = require('./routes/tripRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Bus Booking API is running' });
});

app.use('/api/trips', tripRoutes);
app.use('/api/bookings', bookingRoutes);

async function start() {
  await testConnection();
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');
  } catch (err) {
    console.error('❌ Failed to sync database:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`🚍 Bus Booking API listening on port ${PORT}`);
  });
}

start();
