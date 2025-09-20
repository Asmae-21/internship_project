// Import fetch as ESM
import fetch from 'node-fetch';

async function testApiEndpoint() {
  try {
    console.log('Testing API endpoint...');
    
    // Test GET /api/users endpoint
    const response = await fetch('http://localhost:4000/api/users');
    
    // Log the response status and headers
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    
    // Try to parse as JSON and log the result or error
    try {
      const data = await response.json();
      console.log('Response parsed as JSON successfully:', data);
    } catch (parseError) {
      console.error('Error parsing response as JSON:', parseError.message);
      
      // If JSON parsing fails, get the text content to see what was returned
      const textContent = await response.text();
      console.log('Response text content (first 500 chars):', textContent.substring(0, 500));
    }
  } catch (error) {
    console.error('Error making request:', error);
  }
}

testApiEndpoint();