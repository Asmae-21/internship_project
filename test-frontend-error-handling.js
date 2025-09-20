// This is a simple script to test the frontend error handling
// It simulates the JSON parsing error and checks if our solution works

// Function to simulate a fetch call that returns HTML instead of JSON
async function simulateErrorResponse() {
  // Create a mock response with HTML content
  const htmlResponse = `
<!DOCTYPE html>
<html>
<head>
  <title>Error Page</title>
</head>
<body>
  <h1>Server Error</h1>
  <p>The server encountered an error and could not complete your request.</p>
</body>
</html>
  `;

  // Create headers with content-type set to text/html
  const headers = new Headers();
  headers.append('content-type', 'text/html; charset=utf-8');

  // Create a mock Response object
  const mockResponse = {
    ok: false,
    status: 500,
    headers: headers,
    text: async () => htmlResponse,
    json: async () => {
      // This will throw the "Unexpected token '<'" error
      // when trying to parse HTML as JSON
      JSON.parse(htmlResponse);
    }
  };

  console.log('Testing error handling with HTML response...');

  try {
    // First, try the old approach (directly parsing as JSON)
    console.log('Testing old approach (direct JSON parsing):');
    if (!mockResponse.ok) {
      const errorData = await mockResponse.json();
      console.log('This should not be reached');
    }
  } catch (error) {
    console.log('✓ Old approach correctly throws an error:', error.message);
  }

  try {
    // Now, try our new approach (checking content type first)
    console.log('\nTesting new approach (content type checking):');
    if (!mockResponse.ok) {
      const contentType = mockResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await mockResponse.json();
        console.log('This should not be reached for HTML responses');
      } else {
        const errorText = await mockResponse.text();
        console.log('✓ New approach correctly handles HTML:', 
          errorText.substring(0, 50) + '...');
        console.log('✓ User would see a friendly error message instead of JSON parsing error');
      }
    }
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.log('× New approach still has an issue:', error.message);
  }
}

// Run the test
simulateErrorResponse();