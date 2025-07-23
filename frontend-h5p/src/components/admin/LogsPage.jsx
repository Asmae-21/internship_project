import React, { useState } from 'react';

const initialLogs = [
  { id: 1, user: 'teacher1', action: 'login', date: '2025-07-14 10:00', blocked: false },
  { id: 2, user: 'teacher2', action: 'shared resource', date: '2025-07-14 10:05', blocked: false },
  { id: 3, user: 'teacher3', action: 'login', date: '2025-07-14 10:10', blocked: false },
];

export default function LogsPage() {
  const [logs, setLogs] = useState(initialLogs);

  // Fonction pour bloquer un utilisateur (simulé)
  const blockUser = (userId) => {
    setLogs((prevLogs) =>
      prevLogs.map((log) =>
        log.user === userId ? { ...log, blocked: true } : log
      )
    );
    alert(`Utilisateur ${userId} bloqué.`);
  };

  return (
    <div>
      <h2>Logs & Sécurité</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Action</th>
            <th>Date</th>
            <th>État</th>
            <th>Bloquer</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(({ id, user, action, date, blocked }) => (
            <tr key={id} style={{ backgroundColor: blocked ? '#f8d7da' : 'transparent' }}>
              <td>{user}</td>
              <td>{action}</td>
              <td>{date}</td>
              <td>{blocked ? 'Bloqué' : 'Actif'}</td>
              <td>
                {!blocked && (
                  <button onClick={() => blockUser(user)}>
                    Bloquer utilisateur
                  </button>
                )}
                {blocked && <span>Déjà bloqué</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
