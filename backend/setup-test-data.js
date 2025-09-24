const mongoose = require('mongoose');
const User = require('./models/User');
const Log = require('./models/Log');
const Content = require('./models/Content');
require('dotenv').config();

async function createTestData() {
  try {
    // Check if we already have data
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('Test data already exists, skipping creation');
      return;
    }

    console.log('Creating test data...');

    // Create test teacher user
    const teacher = new User({
      firstName: "Asmae",
      lastName: "Teacher",
      email: "asmae.teacher@example.com",
      phone: "+1234567890",
      classes: "Mathematics, Physics",
      subjects: "Advanced Calculus, Quantum Physics",
      password: "password123",
      photo: "/uploads/profile/1758563292277-158808321.png",
      role: "teacher",
      isActive: true
    });

    await teacher.save();
    console.log('✅ Created teacher user:', teacher.email);

    // Create test admin user
    const admin = new User({
      firstName: "System",
      lastName: "Admin",
      email: "admin@example.com",
      phone: "+1234567891",
      classes: "Administration",
      subjects: "System Management",
      password: "password123",
      role: "admin",
      isActive: true
    });

    await admin.save();
    console.log('✅ Created admin user:', admin.email);

    // Create test content
    const content1 = new Content({
      title: "Introduction to Calculus",
      description: "Basic concepts of differential and integral calculus",
      type: "Lesson",
      tags: ["mathematics", "calculus", "basics"],
      files: ["/uploads/content/1758480315330-408562835.pdf"],
      createdBy: teacher._id
    });

    await content1.save();
    console.log('✅ Created content:', content1.title);

    const content2 = new Content({
      title: "Physics Lab Experiment",
      description: "Newton's laws of motion experiment",
      type: "Project",
      tags: ["physics", "experiment", "newton"],
      files: ["/uploads/content/1758561070732-246506514.png"],
      createdBy: teacher._id
    });

    await content2.save();
    console.log('✅ Created content:', content2.title);

    const content3 = new Content({
      title: "Chemistry Quiz",
      description: "Periodic table and chemical reactions",
      type: "Quiz",
      tags: ["chemistry", "periodic table", "reactions"],
      files: [],
      createdBy: teacher._id
    });

    await content3.save();
    console.log('✅ Created content:', content3.title);

    // Create test logs
    const log1 = new Log({
      user: teacher._id,
      action: "Logged in",
      content: "User login",
      type: "Authentication",
      metadata: {},
      ipAddress: "127.0.0.1",
      userAgent: "Mozilla/5.0"
    });

    await log1.save();
    console.log('✅ Created log entry');

    const log2 = new Log({
      user: teacher._id,
      action: "Created content",
      content: "Introduction to Calculus",
      type: "Content",
      metadata: {
        description: "Basic concepts of differential and integral calculus",
        tags: ["mathematics", "calculus", "basics"],
        fileCount: 1
      },
      ipAddress: "127.0.0.1",
      userAgent: "Mozilla/5.0"
    });

    await log2.save();
    console.log('✅ Created log entry');

    console.log('\n🎉 Test data created successfully!');

  } catch (error) {
    console.error('❌ Error creating test data:', error);
  }
}

async function setupDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-service');
    console.log('✅ Connected to MongoDB');

    // Create test data if needed
    await createTestData();

    // Check users
    const users = await User.find({});
    console.log(`\n👥 Total Users: ${users.length}`);
    const teachers = users.filter(user => user.role === 'teacher');
    console.log(`👩‍🏫 Teachers: ${teachers.length}`);
    const admins = users.filter(user => user.role === 'admin');
    console.log(`👨‍💼 Admins: ${admins.length}`);

    if (teachers.length > 0) {
      console.log('\n👩‍🏫 Teachers:');
      teachers.forEach(teacher => {
        console.log(`  - ${teacher.firstName} ${teacher.lastName} (${teacher.email})`);
      });
    }

    // Check logs
    const logs = await Log.find({}).populate('user', 'firstName lastName email role');
    console.log(`\n📋 Total Logs: ${logs.length}`);

    if (logs.length > 0) {
      console.log('\n📋 Recent Logs (last 10):');
      logs.slice(-10).forEach(log => {
        const userName = log.user ? `${log.user.firstName} ${log.user.lastName}` : 'Unknown User';
        console.log(`  - ${userName}: ${log.action} (${log.type}) - ${log.timestamp}`);
      });
    }

    // Check content
    const contents = await Content.find({}).populate('createdBy', 'firstName lastName email');
    console.log(`\n📚 Total Content: ${contents.length}`);

    if (contents.length > 0) {
      console.log('\n📚 Recent Content (last 5):');
      contents.slice(-5).forEach(content => {
        const creator = content.createdBy ? `${content.createdBy.firstName} ${content.createdBy.lastName}` : 'Unknown';
        console.log(`  - "${content.title}" (${content.type}) by ${creator}`);
      });
    }

  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the setup
setupDatabase();
