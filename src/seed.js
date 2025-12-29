const { sequelize } = require('./config/db');
const Bus = require('./models/bus');
const Trip = require('./models/trip');
const Route = require('./models/route');
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
      {
        numberPlate: 'NA-1234',
        totalSeats: 45,
        company: 'City Express',
        type: 'XL',
      },
      {
        numberPlate: 'NB-5678',
        totalSeats: 50,
        company: 'Highway Star',
        type: 'AC',
      },
      {
        numberPlate: 'NC-9012',
        totalSeats: 40,
        company: 'Royal Travels',
        type: 'S',
      },
      {
        numberPlate: 'ND-3456',
        totalSeats: 48,
        company: 'Comfort Lines',
        type: 'N',
      },
    ]);

    // Create sample trips
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);

    const trips = [];
    const routeDefinitions = [
      {
        origin: 'Colombo',
        destination: 'Kandy',
        duration: 3,
        routeNumber: '01',
        stops: ['Colombo', 'Kiribathgoda', 'Nittambuwa', 'Warakapola', 'Kegalle', 'Mawanella', 'Peradeniya', 'Kandy'],
      },
      {
        origin: 'Colombo',
        destination: 'Galle',
        duration: 2.5,
        routeNumber: '02',
        stops: ['Colombo', 'Panadura', 'Kalutara', 'Aluthgama', 'Ambalangoda', 'Hikkaduwa', 'Galle'],
      },
      {
        origin: 'Kandy',
        destination: 'Jaffna',
        duration: 6,
        routeNumber: '03',
        stops: ['Kandy', 'Kurunegala', 'Dambulla', 'Vavuniya', 'Kilinochchi', 'Jaffna'],
      },
      {
        origin: 'Negombo',
        destination: 'Ella',
        duration: 7,
        routeNumber: '04',
        stops: ['Negombo', 'Peliyagoda', 'Pettah', 'Ratnapura', 'Balangoda', 'Wellawaya', 'Ella'],
      },
      {
        origin: 'Colombo',
        destination: 'Anuradhapura',
        duration: 4,
        routeNumber: '05',
        stops: ['Colombo', 'Puttalam', 'Chilaw', 'Nochchiyagama', 'Anuradhapura'],
      },
      {
        origin: 'Galle',
        destination: 'Matara',
        duration: 1.5,
        routeNumber: '06',
        stops: ['Galle', 'Weligama', 'Mirissa', 'Matara'],
      },
      {
        origin: 'Colombo',
        destination: 'Trincomalee',
        duration: 6.5,
        routeNumber: '07',
        stops: ['Colombo', 'Kurunegala', 'Dambulla', 'Habarana', 'Kantale', 'Trincomalee'],
      },
      {
        origin: 'Kandy',
        destination: 'Nuwara Eliya',
        duration: 2,
        routeNumber: '08',
        stops: ['Kandy', 'Peradeniya', 'Gampola', 'Pussellawa', 'Nuwara Eliya'],
      },
    ];

    // First create Route records. For each definition we create
    // four category-specific routes: XL, AC, S, N.
    const categories = ['XL', 'AC', 'S', 'N'];

    const createdRoutes = [];

    for (const def of routeDefinitions) {
      for (const category of categories) {
        const route = await Route.create({
          routeNumber: def.routeNumber,
          origin: def.origin,
          destination: def.destination,
          category,
          stops: def.stops,
        });
        createdRoutes.push({ def, route, category });
      }
    }

    createdRoutes.forEach(({ def, route, category }, index) => {
      const departureTime = new Date(tomorrow);
      departureTime.setHours(8 + (index % routeDefinitions.length), 0, 0, 0);

      const arrivalTime = new Date(departureTime);
      arrivalTime.setHours(arrivalTime.getHours() + Math.floor(def.duration));
      arrivalTime.setMinutes(arrivalTime.getMinutes() + (def.duration % 1) * 60);

      // Try to pick a bus that matches the category; fall back to first bus
      const matchingBus = buses.find((b) => b.type === category) || buses[0];

      trips.push({
        origin: route.origin,
        destination: route.destination,
        departureTime: departureTime.toISOString(),
        arrivalTime: arrivalTime.toISOString(),
        price: (500 + Math.random() * 2000).toFixed(2),
        routeNumber: route.routeNumber,
        stops: route.stops,
        routeId: route.id,
        busId: matchingBus.id,
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
