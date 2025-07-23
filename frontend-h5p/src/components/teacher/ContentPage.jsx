import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContentPage.css';

export default function ContentPage({ onLogout }) {
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedLessons = JSON.parse(localStorage.getItem('lessons')) || [];
    setLessons(storedLessons);
  }, []);

  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  const lessonCount = lessons.length;

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
       {/* Toolbar buttons */}
<div className="content-toolbar" style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px'
}}>
  {/* Left-side buttons: Tag, Move, Share */}
  <div style={{ display: 'flex', gap: '10px' }}>
    <button className="btn btn-secondary">Tag</button>
    <button className="btn btn-secondary">Move</button>
    <button className="btn btn-secondary">Share</button>
  </div>

  {/* Right-side buttons: Download, Delete, Save */}
  <div style={{ display: 'flex', gap: '10px' }}>
    <div className="dropdown">
      <button className="btn btn-download">Download ▼</button>
      {/* Future dropdown menu */}
    </div>
    <button className="btn btn-delete">Delete</button>
    <button className="btn btn-save">Save</button>
  </div>
</div>

      </main>
    </div>
  );
}
