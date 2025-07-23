import React from 'react';

export default function DashboardPage() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard - Statistiques</h2>
      <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
        <div style={{
          flex: 1,
          backgroundColor: '#2563eb',
          color: 'white',
          padding: 20,
          borderRadius: 8,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <h3>Utilisateurs actifs</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>12</p>
        </div>

        <div style={{
          flex: 1,
          backgroundColor: '#10b981',
          color: 'white',
          padding: 20,
          borderRadius: 8,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <h3>Connexions aujourd'hui</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>42</p>
        </div>

        <div style={{
          flex: 1,
          backgroundColor: '#f59e0b',
          color: 'white',
          padding: 20,
          borderRadius: 8,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <h3>Alertes sécurité</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>3</p>
        </div>
      </div>
    </div>
  );
}
