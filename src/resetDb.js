require('dotenv').config();
const { sequelize } = require('./config/db');
const { seedDatabase } = require('./seed');

async function resetDatabase() {
  try {
    console.log('🔄 Resetting database...');
    
    // Disable foreign key checks temporarily
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Force sync (drops and recreates tables)
    await sequelize.sync({ force: true });
    
    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('✅ Database reset complete');
    
    // Seed with sample data
    await seedDatabase();
    
    console.log('\n📝 Test Accounts Created:');
    console.log('   Customer: customer@test.com / customer123');
    console.log('   Admin: admin@test.com / Passw0rd');
    console.log('\n✨ Database is ready to use!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }
}

resetDatabase();
