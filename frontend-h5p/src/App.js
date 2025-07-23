import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '@fontsource/outfit';
import '@fontsource/outfit/300.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/700.css';
import './App.css';

import AdminDashboard   from './components/admin/AdminDashboard';
import DashboardPage    from './components/admin/DashboardPage';
import UsersPage        from './components/admin/UsersPage';
import LogsPage         from './components/admin/LogsPage';
import SettingsPage     from './components/admin/SettingsPage';

import TeacherDashboard from './components/teacher/TeacherDashboard';
import ContentPage      from './components/teacher/ContentPage'; // utilisé pour les deux routes

import LoginForm        from './components/LoginForm';

function App() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const handleLogin  = (r) => setRole(r);
  const handleLogout = () => {
    setRole(null);
    navigate('/login');
  };

  /*----------- non connecté -----------*/
  if (!role) return <LoginForm onLogin={handleLogin} />;

  /*----------- espace TEACHER -----------*/
  if (role === 'teacher') {
    return (
      <Routes>
        {/* 🔹 Page indépendante */}
        <Route path="/teacher/create" element={<ContentPage />} />

        {/* 🔹 Dashboard + sous-pages */}
        <Route path="/teacher/*" element={<TeacherDashboard onLogout={handleLogout} />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="content" element={<ContentPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/teacher" />} />
      </Routes>
    );
  }

  /*----------- espace ADMIN -----------*/
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminDashboard onLogout={handleLogout} />}>
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="logs" element={<LogsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" />} />
    </Routes>
  );
}

export default App;
