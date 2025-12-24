const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/db');
const { seedDatabase } = require('./seed');
const tripRoutes = require('./routes/tripRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const busRoutes = require('./routes/busRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'BusGo Bus Booking API is running' });
});

app.use('/api/trips', tripRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/admin', adminRoutes);

async function start() {
  await testConnection();
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');

    // Seed database if no trips exist
    const Trip = require('./models/Trip');
    const count = await Trip.count();
    if (count === 0) {
      await seedDatabase();
    }
  } catch (err) {
    console.error('❌ Failed to sync database:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`🚍 BusGo API listening on port ${PORT}`);
  });
}

start();
