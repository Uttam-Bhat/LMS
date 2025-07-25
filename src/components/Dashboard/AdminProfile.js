import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import api from '../../services/authService';
import AvatarUpload from '../AvatarUpload';
import toast from 'react-hot-toast';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff&size=128';

const AdminProfile = ({ onProfilePhotoChange }) => {
  const [admin, setAdmin] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const userEmail = localStorage.getItem('user_email');
        const userRes = await api.get('/admin/users');
        const userList = Array.isArray(userRes.data) ? userRes.data : [userRes.data];
        console.log('DEBUG: userEmail from localStorage:', userEmail);
        console.log('DEBUG: userList from /admin/users:', userList);
        const adminObj = userList.find(u => u.email === userEmail && u.user_type === 'admin');
        console.log('DEBUG: found adminObj:', adminObj);
        setAdmin(adminObj);
        if (adminObj) {
          const profileRes = await api.get(`/profile/user/${adminObj.id}`);
          setProfile(profileRes.data);
        }
      } catch (err) {
        setAdmin(null);
        setProfile(null);
        console.error('DEBUG: Error in fetchAdmin:', err);
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

  const userId = admin.id;
  const fullname = admin.fullname || admin.name;
  const initials = fullname
    ? fullname.split(' ').map(n => n[0]).join('').toUpperCase()
    : '';
  const backendUrl = 'http://localhost:3000';
  const cacheBuster = profile && profile.photo_url ? `?t=${Date.now()}` : '';
  const photoUrl = profile && profile.photo_url ? backendUrl + profile.photo_url + cacheBuster : null;

  // Handle photo upload
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('user_id', userId);
    try {
      if (profile && profile.p_id) {
        await api.put(`/profile/profile-update/${userId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/profile/profile-add', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      toast.success('Profile photo updated!');
      const res = await api.get(`/profile/user/${userId}`);
      setProfile(res.data);
      // Save to localStorage and dispatch event
      if (res.data && res.data.photo_url) {
        const backendUrl = 'http://localhost:3000';
        const newPhotoUrl = backendUrl + res.data.photo_url + `?t=${Date.now()}`;
        localStorage.setItem('admin_profile_photo', newPhotoUrl);
        window.dispatchEvent(new Event('profilePhotoUpdated'));
      } else {
        localStorage.removeItem('admin_profile_photo');
        window.dispatchEvent(new Event('profilePhotoUpdated'));
      }
    } catch (err) {
      toast.error('Failed to upload photo');
    }
    setUploading(false);
  };

  // Handle photo delete
  const handlePhotoDelete = async () => {
    setUploading(true);
    try {
      await api.put(`/profile/photo-delete/${userId}`);
      toast.success('Profile photo removed!');
      const res = await api.get(`/profile/user/${userId}`);
      setProfile(res.data);
      // Remove from localStorage and dispatch event
      localStorage.removeItem('admin_profile_photo');
      window.dispatchEvent(new Event('profilePhotoUpdated'));
    } catch (err) {
      toast.error('Failed to remove photo');
    }
    setUploading(false);
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f6f8fb' }}>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #e0e7ef', padding: '2.5rem 3rem', minWidth: 350, maxWidth: 400, textAlign: 'center' }}>
          <AvatarUpload
            photoUrl={photoUrl}
            initials={initials}
            onPhotoChange={handlePhotoChange}
            onPhotoDelete={handlePhotoDelete}
            uploading={uploading}
          />
          <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 6 }}>{fullname}</h2>
          <div style={{ color: '#377dff', fontSize: '1.08rem', marginBottom: 8 }}>{admin.email}</div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminProfile; 