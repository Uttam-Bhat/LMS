import React from 'react';
import DashboardLayout from './DashboardLayout';

const admin = {
  name: 'Admin User',
  email: 'admin@example.com',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
};

const AdminProfile = () => (
  <DashboardLayout>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f6f8fb' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #e0e7ef', padding: '2.5rem 3rem', minWidth: 350, maxWidth: 400, textAlign: 'center' }}>
        <img src={admin.avatar} alt="Profile" style={{ width: 110, height: 110, borderRadius: '50%', marginBottom: 18, objectFit: 'cover', border: '4px solid #2563eb' }} />
        <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 6 }}>{admin.name}</h2>
        <div style={{ color: '#377dff', fontSize: '1.08rem', marginBottom: 8 }}>{admin.email}</div>
      </div>
    </div>
  </DashboardLayout>
);

export default AdminProfile; 