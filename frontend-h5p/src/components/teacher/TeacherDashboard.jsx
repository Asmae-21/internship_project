import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherDashboard.css';
import { Outlet } from 'react-router-dom';


export default function TeacherDashboard({ onLogout }) {
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  /* Charge les leçons une seule fois */
  useEffect(() => {
    const storedLessons = JSON.parse(localStorage.getItem('lessons')) || [];
    setLessons(storedLessons);
  }, []);

  const lessonCount = lessons.length;

  // Date formatée pour aujourd'hui
   const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);


  return (
    <div className="teacher-dashboard">
      {/* -------- SIDEBAR -------- */}
      <aside className="sidebar">
        <h2>Logo</h2>

        <div className="menu-items">
          <ul>
            <li onClick={() => navigate('/teacher/dashboard')}>Dashboard</li>
            <li onClick={() => navigate('/teacher/create')}>Create New Content</li>
            <li onClick={() => navigate('/teacher/library')}>My Library</li>
            <li onClick={() => navigate('/teacher/upload')}>Upload My Content</li>
          </ul>
        </div>

        <div className="logout-section">
          <li>Settings</li>
          <li onClick={onLogout}>Log out</li>
        </div>
      </aside>

      {/* -------- CONTENU PRINCIPAL -------- */}
      <main className="main-content">

        {/* Carte Welcome */}
        <div className="welcome-card card">
          <h2>Welcome!</h2>
           <p> <strong>{formattedDate}</strong></p>
        </div>

        {/* Cartes rapides */}
        <div className="card-grid">
          <div className="card" onClick={() => navigate('/teacher/create')}>
            <h2>Create New Content</h2>
            <p>Start a new lesson</p>
          </div>

          <div className="card" onClick={() => navigate('/teacher/edit')}>
            <h2>My Library</h2>
            <p>Edit your existing lessons</p>
          </div>

          <div className="card" onClick={() => navigate('/teacher/library')}>
            <h2>Upload My Content</h2>
            <p>Total : <strong>{lessonCount}</strong></p>
          </div>
        </div>

        {/* Tableau des leçons */}
        <header>
          <h3>Recent Lessons</h3>
        </header>
        <table className="lesson-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Last update</th>
              <th>Type</th>
              <th>Access</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {lessons.map((l) => (
              <tr key={l.id}>
                <td>{l.title}</td>
                <td>{new Date(l.updatedAt || l.id).toLocaleDateString()}</td>
                <td>{l.type || 'Lesson'}</td>
                <td>{l.access || 'Private'}</td>
                <td>
                  <span className="note">1</span>
                  <span className="note">2</span>
                  <span className="note">3</span>
                </td>
              </tr>
            ))}

            {!lessons.length && (
              <tr>
                <td colSpan="5" className="empty">No lessons yet</td>
              </tr>
            )}
          </tbody>
        </table>
        <Outlet />
      </main>
    </div>
  );
}
