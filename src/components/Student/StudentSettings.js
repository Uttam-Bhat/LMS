import React, { useState } from 'react';
import StudentLayout from './StudentLayout';
import api from '../../services/authService';

const StudentSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await api.put('/user/update-password', {
        currentPassword,
        newPassword,
        confirmPassword
      });
      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    window.location.href = '/logout';
  };

  return (
    <StudentLayout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f6f8fb' }}>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #e0e7ef', padding: '2.5rem 3rem', minWidth: 350, maxWidth: 400 }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 18 }}>Settings</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={{ padding: '0.7rem', borderRadius: 8, border: '1px solid #e2e8f0' }} />
            <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ padding: '0.7rem', borderRadius: 8, border: '1px solid #e2e8f0' }} />
            <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ padding: '0.7rem', borderRadius: 8, border: '1px solid #e2e8f0' }} />
            {error && <div style={{ color: '#e11d48', fontSize: '0.98rem' }}>{error}</div>}
            {success && <div style={{ color: '#16a34a', fontSize: '0.98rem' }}>{success}</div>}
            <button type="submit" disabled={loading} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', marginTop: 8 }}>{loading ? 'Updating...' : 'Update Password'}</button>
          </form>
          <hr style={{ margin: '2rem 0' }} />
          <button onClick={handleLogout} style={{ background: '#e11d48', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', width: '100%' }}>Logout</button>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentSettings; 