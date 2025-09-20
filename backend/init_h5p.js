// MongoDB Initialization Script using Mongoose
// Usage: node init_h5p.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ObjectId } = require('mongodb');
const User = require('./models/User'); // make sure this path is correct

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri || uri.includes('<db_password>')) {
  console.error('❌ Invalid MongoDB URI. Please check your .env file or replace the password placeholder.');
  process.exit(1);
}

async function main() {
  try {
    await mongoose.connect(uri, {
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    console.log('✅ Connected to MongoDB Atlas via Mongoose');

    // Delete existing test users
    await User.deleteMany({ email: { $in: ['admin@h5p.com', 'teacher@h5p.com'] } });

    // Create users using the Mongoose model — password will be hashed automatically
    await User.create([
      {
        _id: new ObjectId('507f1f77bcf86cd799439011'),
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@h5p.com',
        password: 'StrongP@ssw0rd123',
        role: 'admin',
        isActive: true,
        phone: '+1234567890',
        classes: 'All Classes',
        subjects: 'Administration'
      },
      {
        _id: new ObjectId('507f1f77bcf86cd799439012'),
        firstName: 'Teacher',
        lastName: 'User',
        email: 'teacher@h5p.com',
        password: 'StrongP@ssw0rd123',
        role: 'teacher',
        isActive: true,
        phone: '+1234567890',
        classes: '2Bac SM-A',
        subjects: 'Mathematics'
      }
    ]);

    console.log('\n✅ Users inserted with hashed passwords via Mongoose!\n');
  } catch (err) {
    console.error('❌ Error initializing database:\n', err);
  } finally {
    await mongoose.disconnect();
  }
}

main();
