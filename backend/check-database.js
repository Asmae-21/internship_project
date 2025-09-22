const mongoose = require('mongoose');
const User = require('./models/User');
const Log = require('./models/Log');
const Content = require('./models/Content');
require('dotenv').config();

async function checkDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-service');
    console.log('Connected to MongoDB');

    // Check users
    const users = await User.find({});
    console.log(`\nTotal Users: ${users.length}`);
    const teachers = users.filter(user => user.role === 'teacher');
    console.log(`Teachers: ${teachers.length}`);
    const admins = users.filter(user => user.role === 'admin');
    console.log(`Admins: ${admins.length}`);

    if (teachers.length > 0) {
      console.log('\nTeachers:');
      teachers.forEach(teacher => {
        console.log(`- ${teacher.firstName} ${teacher.lastName} (${teacher.email})`);
      });
    }

    // Check logs
    const logs = await Log.find({}).populate('user', 'firstName lastName email role');
    console.log(`\nTotal Logs: ${logs.length}`);

    if (logs.length > 0) {
      console.log('\nRecent Logs (last 10):');
      logs.slice(-10).forEach(log => {
        const userName = log.user ? `${log.user.firstName} ${log.user.lastName}` : 'Unknown User';
        console.log(`- ${userName}: ${log.action} (${log.type}) - ${log.timestamp}`);
      });
    }

    // Check content
    const contents = await Content.find({}).populate('createdBy', 'firstName lastName email');
    console.log(`\nTotal Content: ${contents.length}`);

    if (contents.length > 0) {
      console.log('\nRecent Content (last 5):');
      contents.slice(-5).forEach(content => {
        const creator = content.createdBy ? `${content.createdBy.firstName} ${content.createdBy.lastName}` : 'Unknown';
        console.log(`- "${content.title}" (${content.type}) by ${creator}`);
      });
    }

    // Test the teacher stats calculation
    console.log('\n=== Testing Teacher Stats Calculation ===');
    const now = new Date();
    const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Last 30 days

    const teacherStats = await Promise.all(
      teachers.map(async (teacher) => {
        const activityCount = await Log.countDocuments({
          user: teacher._id,
          createdAt: { $gte: startDate, $lte: now }
        });

        return {
          teacher: teacher,
          activityCount: activityCount
        };
      })
    );

    console.log('\nTeacher Activity (Last 30 days):');
    teacherStats.forEach(stat => {
      console.log(`- ${stat.teacher.firstName} ${stat.teacher.lastName}: ${stat.activityCount} activities`);
    });

  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the check
checkDatabase();
