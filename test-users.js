const fetch = require('node-fetch');

async function testUsers() {
  try {
    console.log('Testing users API...');
    const response = await fetch('http://localhost:4000/api/users');
    const users = await response.json();

    console.log(`Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
      console.log(`   Photo: ${user.photo || 'No photo'}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.isActive}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error testing users:', error.message);
  }
}

testUsers();
