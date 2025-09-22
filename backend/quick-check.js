const mongoose = require('mongoose');
const User = require('./models/User');
const Log = require('./models/Log');
const Content = require('./models/Content');

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-service');
    console.log('Connected to MongoDB');

    const users = await User.find({});
    console.log('Total Users:', users.length);

    const teachers = users.filter(u => u.role === 'teacher');
    console.log('Teachers:', teachers.length);

    const logs = await Log.find({}).populate('user', 'firstName lastName');
    console.log('Total Logs:', logs.length);

    const contents = await Content.find({}).populate('createdBy', 'firstName lastName');
    console.log('Total Content:', contents.length);

    if (teachers.length > 0) {
      console.log('\nTeachers:');
      teachers.forEach(t => console.log('-', t.firstName, t.lastName));
    }

    if (logs.length > 0) {
      console.log('\nRecent logs:');
      logs.slice(-5).forEach(l => {
        const user = l.user ? l.user.firstName + ' ' + l.user.lastName : 'Unknown';
        console.log('-', user, ':', l.action);
      });
    }

    await mongoose.connection.close();
  } catch (e) {
    console.error('Error:', e.message);
  }
}

check();
