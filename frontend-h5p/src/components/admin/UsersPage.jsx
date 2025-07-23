import React, { useState } from 'react';
import './UsersPage.css';

export default function UsersPage() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice Dupont', email: 'alice@example.com' },
    { id: 2, name: 'Bob Martin',  email: 'bob@example.com'   },
  ]);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);            // ← user being edited
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  /* ---------- filtering ---------- */
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------- handlers ---------- */
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  /* add user */
  const handleAdd = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return alert('All fields are required!');
    const newUser = {
      id: users.length ? users[users.length - 1].id + 1 : 1,
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
    };
    setUsers([...users, newUser]);
    closeModal();
  };

  /* edit user */
  const handleEdit = e => {
    e.preventDefault();
    if (!form.name || !form.email) return alert('All fields are required!');
    setUsers(users.map(u =>
      u.id === editUser.id ? { ...u, name: form.name.trim(), email: form.email.trim() } : u
    ));
    closeModal();
  };

  const openAddModal  = () => { setEditUser(null); setForm({ name:'', email:'', password:'' }); setShowModal(true); };
  const openEditModal = user => { setEditUser(user); setForm({ name:user.name, email:user.email, password:'' }); setShowModal(true); };
  const closeModal    = () => { setShowModal(false); setEditUser(null); setForm({ name:'', email:'', password:'' }); };

  const handleDelete = id =>
    window.confirm('Delete this user?') &&
    setUsers(users.filter(u => u.id !== id));

  return (
    <div style={{ padding: 20 }}>
      <h2>User Management</h2>

      {/* search */}
      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 12, padding: 8, width: '100%', maxWidth: 400 }}
      />

      {/* add button */}
      <button className="add-teacher" onClick={openAddModal}>Add a Teacher</button>

      {/* ------------ modal ------------ */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editUser ? 'Edit User' : 'Create New Teacher'}</h3>
            <form onSubmit={editUser ? handleEdit : handleAdd}>
              <input name="name"  placeholder="Full Name" value={form.name}  onChange={handleChange} required />
              <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
              {!editUser && (
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
              )}
              <div className="modal-actions">
                <button type="button" className="cancel-btn"  onClick={closeModal}>Cancel</button>
                <button type="submit" className="submit-btn">{editUser ? 'Save' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------ table ------------ */}
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ background:'#2563eb', color:'#fff' }}>
            <th style={{ padding:10 }}>Name</th>
            <th style={{ padding:10 }}>Email</th>
            <th style={{ padding:10, textAlign:'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr><td colSpan="3" style={{ textAlign:'center', padding:12 }}>No users found</td></tr>
          ) : filteredUsers.map(u => (
            <tr key={u.id}>
              <td style={{ padding:10 }}>{u.name}</td>
              <td style={{ padding:10 }}>{u.email}</td>
              <td style={{ padding:10, textAlign:'center' }}>
                <button
                  onClick={() => openEditModal(u)}
                  style={{ marginRight:8, background:'#3b82f6', border:'none', padding:'6px 12px', borderRadius:4 }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  style={{ background:'#ef4444', color:'#fff', border:'none', padding:'6px 12px', borderRadius:4 }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
