const { sequelize, testConnection } = require('../config/database');
const { User } = require('../models');
require('dotenv').config();

(async () => {
  try {
    await testConnection();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@example.com' } });
    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      console.log('📧 Email: admin@example.com');
      await sequelize.close();
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      isApproved: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change the password after first login!');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await sequelize.close();
    process.exit(1);
  }
})();

