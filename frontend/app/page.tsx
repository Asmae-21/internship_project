'use client';
import LoginForm from "./Login/Components/LoginForm";

export default function HomePage() {
  const handleLogin = (role: string) => {
    console.log('Logged in as:', role);
    
    // Route users based on their role
    if (role === 'admin') {
      window.location.href = "/Admin/admin-dashboard";
    } else if (role === 'teacher') {
      window.location.href = "/Teacher/Dashboard";
    } else {
      console.error('Unknown role:', role);
      // Default to teacher dashboard if role is unknown
      window.location.href = "/Teacher/Dashboard";
    }
  };

  return <LoginForm onLogin={handleLogin} />;
}
