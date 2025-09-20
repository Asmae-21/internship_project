// For Node.js v18 or later, use the native fetch
// For earlier versions, use this import:
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

async function testUserCreation() {
  try {
    // Create form data
    const form = new FormData();
    form.append('firstName', 'Test');
    form.append('lastName', 'User');
    form.append('email', `test${Date.now()}@example.com`); // Unique email
    form.append('phone', '1234567890');
    form.append('classes', 'Test Class');
    form.append('subjects', 'Test Subject');
    form.append('password', 'TestPassword123!');
    
    // Add a test image if available
    // Uncomment if you have a test image
    // const imagePath = path.join(__dirname, 'test-image.jpg');
    // if (fs.existsSync(imagePath)) {
    //   form.append('photo', fs.createReadStream(imagePath));
    // }

    console.log('Sending request to create user...');
    
    // Send request
    const response = await fetch('http://localhost:4000/api/users', {
      method: 'POST',
      body: form,
    });

    // Parse response
    const result = await response.json();
    
    if (response.ok) {
      console.log('User created successfully!');
      console.log('User data:', result);
    } else {
      console.error('Failed to create user:', result);
    }
  } catch (error) {
    console.error('Error during test:', error);
  }
}

testUserCreation();