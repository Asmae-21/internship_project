// Test script for chatbot API
import fetch from 'node-fetch';

async function testChatbot() {
  try {
    console.log('Testing chatbot API...');

    // First, we need to login to get a token
    console.log('\n1. Testing login...');
    const loginResponse = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'teacher@example.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      console.log('Login failed, trying to create a test user first...');

      // Try to create a test user
      const createUserResponse = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'Teacher',
          email: 'teacher@example.com',
          phone: '1234567890',
          classes: 'Math 101',
          subjects: 'Mathematics',
          password: 'password123'
        })
      });

      if (createUserResponse.ok) {
        console.log('Test user created successfully');
        // Try login again
        const retryLogin = await fetch('http://localhost:4000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'teacher@example.com',
            password: 'password123'
          })
        });

        if (retryLogin.ok) {
          const loginData = await retryLogin.json();
          console.log('Login successful');
          testChatbotWithToken(loginData.token);
        } else {
          console.log('Login still failed after creating user');
        }
      } else {
        console.log('Failed to create test user');
      }
    } else {
      const loginData = await loginResponse.json();
      console.log('Login successful');
      testChatbotWithToken(loginData.token);
    }

  } catch (error) {
    console.error('Error in test:', error);
  }
}

async function testChatbotWithToken(token) {
  console.log('\n2. Testing chatbot with help command...');

  try {
    const response = await fetch('http://localhost:4000/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        message: 'help'
      })
    });

    console.log('Response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('Chatbot response:', JSON.stringify(data, null, 2));
    } else {
      const errorData = await response.json();
      console.log('Error response:', errorData);
    }

    // Test quiz command
    console.log('\n3. Testing chatbot with quiz command...');
    const quizResponse = await fetch('http://localhost:4000/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        message: 'create a quiz'
      })
    });

    console.log('Quiz response status:', quizResponse.status);

    if (quizResponse.ok) {
      const quizData = await quizResponse.json();
      console.log('Quiz response type:', quizData.type);
      if (quizData.type === 'content') {
        console.log('Quiz title:', quizData.content.title);
        console.log('Quiz type:', quizData.content.type);
      }
    } else {
      const errorData = await quizResponse.json();
      console.log('Error response:', errorData);
    }

  } catch (error) {
    console.error('Error testing chatbot:', error);
  }
}

testChatbot();
