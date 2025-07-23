import { useState } from 'react';
import './LoginForm.css';

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Erreur lors de la connexion');
        return;
      }

      // Save token if needed
      localStorage.setItem('token', data.token);

      // Notify parent component
      onLogin(data.role);
    } catch (err) {
      console.error('Login error:', err);
      alert('Erreur serveur');
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

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />

          <input
            type="password"
            placeholder="Input your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <a href="#" className="forgot-password">Forgot password?</a>

          <button type="submit" className="primary-btn">Sign In</button>

          <div className="separator">or</div>

          <button type="button" className="social-btn google">Sign In With Google</button>
          <button type="button" className="social-btn facebook">Sign In With Facebook</button>

          <p className="disclaimer">
            Protected by reCAPTCHA and subject to the Google <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a>.
          </p>
        </form>
      </div>
    </div>
  );
}
