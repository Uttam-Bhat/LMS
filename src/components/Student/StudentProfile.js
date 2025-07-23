import React, { useEffect, useState } from 'react';
import StudentLayout from './StudentLayout';
import api from '../../services/authService';
import AvatarUpload from '../AvatarUpload';
import toast from 'react-hot-toast';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=Student&background=2563eb&color=fff&size=128';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const userEmail = localStorage.getItem('user_email');
        const userRes = await api.get('/admin/users');
        const userList = Array.isArray(userRes.data) ? userRes.data : [userRes.data];
        const user = userList.find(u => u.email === userEmail);
        if (!user) { setLoading(false); return; }
        const studentRes = await api.get('/student/student-display');
        const studentList = Array.isArray(studentRes.data) ? studentRes.data : [studentRes.data];
        const studentObj = studentList.find(s => s.user_info.id === user.id);
        setStudent(studentObj);
        // Fetch profile info
        const profileRes = await api.get(`/profile/user/${user.id}`);
        setProfile(profileRes.data);
      } catch (err) {
        setStudent(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, []);

  if (loading) {
    return (
      <StudentLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f6f8fb' }}>
          <div style={{ color: '#2563eb', fontSize: '1.2rem' }}>Loading profile...</div>
        </div>
      </StudentLayout>
    );
  }

  if (!student) {
    return (
      <StudentLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f6f8fb' }}>
          <div style={{ color: '#d32f2f', fontSize: '1.2rem' }}>Student profile not found.</div>
        </div>
      </StudentLayout>
    );
  }

  const userInfo = student.user_info;
  const classInfo = userInfo.class_info;
  const userId = userInfo.id;
  const fullname = userInfo.fullname;
  const initials = fullname
    ? fullname.split(' ').map(n => n[0]).join('').toUpperCase()
    : '';
  const backendUrl = 'http://localhost:3000';
  const photoUrl = profile && profile.photo_url ? backendUrl + profile.photo_url : null;

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
        localStorage.setItem('student_profile_photo', newPhotoUrl);
        window.dispatchEvent(new Event('studentProfilePhotoUpdated'));
      } else {
        localStorage.removeItem('student_profile_photo');
        window.dispatchEvent(new Event('studentProfilePhotoUpdated'));
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
      localStorage.removeItem('student_profile_photo');
      window.dispatchEvent(new Event('studentProfilePhotoUpdated'));
    } catch (err) {
      toast.error('Failed to remove photo');
    }
    setUploading(false);
  };

  return (
    <StudentLayout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f6f8fb' }}>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #e0e7ef', padding: '2.5rem 3rem', minWidth: 350, maxWidth: 400, textAlign: 'center' }}>
          <AvatarUpload
            photoUrl={photoUrl}
            initials={initials}
            onPhotoChange={handlePhotoChange}
            onPhotoDelete={handlePhotoDelete}
            uploading={uploading}
          />
          <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 6 }}>{userInfo.fullname}</h2>
          <div style={{ color: '#377dff', fontSize: '1.08rem', marginBottom: 8 }}>{userInfo.email}</div>
          <div style={{ color: '#5b6b7a', fontSize: '1.05rem', marginBottom: 4 }}>Class: {classInfo.class_name}</div>
          <div style={{ color: '#5b6b7a', fontSize: '1.05rem', marginBottom: 4 }}>Section: {classInfo.section}</div>
          <div style={{ color: '#5b6b7a', fontSize: '1.05rem', marginBottom: 4 }}>Stream: {classInfo.stream_info?.sname}</div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentProfile; 