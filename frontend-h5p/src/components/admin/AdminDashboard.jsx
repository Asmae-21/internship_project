import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt, FaUsers, FaLock, FaCog, FaSignOutAlt
} from 'react-icons/fa';
import './AdminDashboard.css';

export default function AdminDashboard({ onLogout }) {
  const { pathname } = useLocation();

  return (
    <div className="dashboard">
      <nav className="sidebar">
        <div className="sidebar-title">🌐 Admin Panel</div>

        <Link to="/admin">
          <button className={pathname === '/admin' ? 'active' : ''}>
            <FaTachometerAlt className="icon" />
            Dashboard
          </button>
        </Link>

        <Link to="/admin/users">
          <button className={pathname === '/admin/users' ? 'active' : ''}>
            <FaUsers className="icon" />
            User Management
          </button>
        </Link>

        <Link to="/admin/logs">
          <button className={pathname === '/admin/logs' ? 'active' : ''}>
            <FaLock className="icon" />
            Logs & Security
          </button>
        </Link>

        <Link to="/admin/settings">
          <button className={pathname === '/admin/settings' ? 'active' : ''}>
            <FaCog className="icon" />
            Platform Settings
          </button>
        </Link>

        <div style={{ flexGrow: 1 }} />

        <button className="logout-button" onClick={onLogout}>
          <FaSignOutAlt className="icon" />
          Log out
        </button>
      </nav>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
