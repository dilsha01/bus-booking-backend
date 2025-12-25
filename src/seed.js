const { sequelize } = require('./config/db');
const Bus = require('./models/bus');
const Trip = require('./models/trip');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Hash passwords for test users
    const customerPassword = await bcrypt.hash('customer123', 10);
    const adminPassword = await bcrypt.hash('Passw0rd', 10);

    // Create sample users
    await User.bulkCreate([
      {
        name: 'John Doe',
        email: 'customer@test.com',
        passwordHash: customerPassword,
        role: 'customer',
        isVerified: true, // Test account - pre-verified
      },
      {
        name: 'Admin User',
        email: 'admin@test.com',
        passwordHash: adminPassword,
        role: 'admin',
        isVerified: true, // Test account - pre-verified
      },
    ]);

    // Create sample buses
    const buses = await Bus.bulkCreate([
      { name: 'Express Luxury', numberPlate: 'CAB-1234', totalSeats: 45 },
      { name: 'Super Deluxe', numberPlate: 'KAN-5678', totalSeats: 50 },
      { name: 'Royal Express', numberPlate: 'GAL-9012', totalSeats: 40 },
      { name: 'Comfort Plus', numberPlate: 'JAF-3456', totalSeats: 48 },
    ]);

    // Create sample trips
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);

    const trips = [];
    const routes = [
      { origin: 'Colombo', destination: 'Kandy', duration: 3 },
      { origin: 'Colombo', destination: 'Galle', duration: 2.5 },
      { origin: 'Kandy', destination: 'Jaffna', duration: 6 },
      { origin: 'Negombo', destination: 'Ella', duration: 7 },
      { origin: 'Colombo', destination: 'Anuradhapura', duration: 4 },
      { origin: 'Galle', destination: 'Matara', duration: 1.5 },
      { origin: 'Colombo', destination: 'Trincomalee', duration: 6.5 },
      { origin: 'Kandy', destination: 'Nuwara Eliya', duration: 2 },
    ];

    routes.forEach((route, index) => {
      const departureTime = new Date(tomorrow);
      departureTime.setHours(8 + index, 0, 0, 0);
      
      const arrivalTime = new Date(departureTime);
      arrivalTime.setHours(arrivalTime.getHours() + Math.floor(route.duration));
      arrivalTime.setMinutes(arrivalTime.getMinutes() + (route.duration % 1) * 60);

      trips.push({
        origin: route.origin,
        destination: route.destination,
        departureTime: departureTime.toISOString(),
        arrivalTime: arrivalTime.toISOString(),
        price: (500 + Math.random() * 2000).toFixed(2),
        busId: buses[index % buses.length].id,
      });
    });

    await Trip.bulkCreate(trips);

    console.log('✅ Database seeded successfully!');
    console.log(`   - ${buses.length} buses created`);
    console.log(`   - ${trips.length} trips created`);
    console.log(`   - 2 users created`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

module.exports = { seedDatabase };
