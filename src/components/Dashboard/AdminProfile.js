import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import api from '../../services/authService';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff&size=128';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const userEmail = localStorage.getItem('user_email');
        const userRes = await api.get('/admin/users');
        const userList = Array.isArray(userRes.data) ? userRes.data : [userRes.data];
        const adminObj = userList.find(u => u.email === userEmail && u.user_type === 'admin');
        setAdmin(adminObj);
      } catch (err) {
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f6f8fb' }}>
          <div style={{ color: '#2563eb', fontSize: '1.2rem' }}>Loading profile...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!admin) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f6f8fb' }}>
          <div style={{ color: '#d32f2f', fontSize: '1.2rem' }}>Admin profile not found.</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f6f8fb' }}>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #e0e7ef', padding: '2.5rem 3rem', minWidth: 350, maxWidth: 400, textAlign: 'center' }}>
          <img src={admin.avatar || DEFAULT_AVATAR} alt="Profile" style={{ width: 110, height: 110, borderRadius: '50%', marginBottom: 18, objectFit: 'cover', border: '4px solid #2563eb' }} />
          <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 6 }}>{admin.fullname || admin.name}</h2>
          <div style={{ color: '#377dff', fontSize: '1.08rem', marginBottom: 8 }}>{admin.email}</div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminProfile; 