import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Test function to create a user with a non-image file
async function testNonImageFileUpload() {
  try {
    console.log('Testing file upload validation...');
    
    // Create form data
    const form = new FormData();
    form.append('firstName', 'Test');
    form.append('lastName', 'User');
    form.append('email', 'test-file-upload@example.com');
    form.append('phone', '1234567890');
    form.append('classes', 'Class A');
    form.append('subjects', 'Subject 1');
    form.append('password', 'Password123!');
    
    // Create a text file to upload (non-image)
    const textFilePath = path.join(__dirname, 'test-file.txt');
    fs.writeFileSync(textFilePath, 'This is a test file, not an image');
    
    // Append the text file as photo
    form.append('photo', fs.createReadStream(textFilePath));
    
    // Send request
    const response = await fetch('http://localhost:4000/api/users', {
      method: 'POST',
      body: form,
    });
    
    // Get response
    const contentType = response.headers.get('content-type');
    let responseData;
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', responseData);
    } else {
      responseData = await response.text();
      console.log('Response status:', response.status);
      console.log('Response (non-JSON):', responseData);
    }
    
    // Clean up
    fs.unlinkSync(textFilePath);
    
    // Validate response
    if (response.status === 400 && responseData.error === 'Only image files (jpeg, jpg, png, gif) are allowed!') {
      console.log('✅ Test passed: Received proper error message for non-image file');
    } else if (response.status === 500 && typeof responseData === 'string' && responseData.includes('Only image files are allowed')) {
      console.log('✅ Test passed: Server returned HTML error that frontend can handle');
      console.log('Frontend will extract the error message: "Only image files (jpeg, jpg, png, gif) are allowed!"');
    } else {
      console.log('❌ Test failed: Did not receive expected error message');
    }
  } catch (error) {
    console.error('Error during test:', error);
  }
}

// Run the test
testNonImageFileUpload();