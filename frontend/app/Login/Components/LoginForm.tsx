"use client"; // ← à inclure si tu utilises le dossier /app
import { useState } from "react";
import "./LoginForm.css";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      console.log('Attempting login to:', `${apiUrl}/api/auth/login`);
      
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
        // Removed credentials: 'include' as we're using token-based auth
      });
      
      const data = await response.json();
      console.log('Login response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      if (!data.token || !data.role) {
        throw new Error('Invalid response from server: missing token or role');
      }
      
      // Store token and user information in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      console.log('User role:', data.role);
      console.log('User info stored:', data.user);

      // Call the onLogin function with the user role from the response
      onLogin(data.role);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <div className="overlay">
          <h1>Welcome to your Interactive Lesson Platform !</h1>
          <p>
            Built to help our teachers deliver powerful learning experiences.
            Empowering teachers with interactive content tools.
          </p>
        </div>
      </div>

      <div className="right-panel">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Sign In</h2>
         <h3>Email Address</h3>
          <input
         
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
         <h3>Password</h3>
          <input
            type="password"
            placeholder="Input your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <a href="#" className="forgot-password">
            Forgot password?
          </a>

          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <div className="separator">or</div>

          <button type="button" className="social-btn google">
            Sign In With Google
          </button>
          <button type="button" className="social-btn facebook">
            Sign In With Facebook
          </button>

          <p className="disclaimer">
            Protected by reCAPTCHA and subject to the Google{" "}
            <a href="#">Privacy Policy</a> and{" "}
            <a href="#">Terms of Service</a>.
          </p>
        </form>
      </div>
    </div>
  );
}
