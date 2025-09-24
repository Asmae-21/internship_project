const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-service');

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-service');
    console.log('✅ Successfully connected to MongoDB!');

    // Test creating a simple user
    const User = mongoose.model('User', new mongoose.Schema({
      firstName: String,
      lastName: String,
      email: String,
      role: String
    }));

    const testUser = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'teacher'
    });

    await testUser.save();
    console.log('✅ Successfully created test user!');

    // Check if user exists
    const users = await User.find({});
    console.log(`📊 Total users in database: ${users.length}`);

    await mongoose.connection.close();
    console.log('🔌 Connection closed');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testConnection();
