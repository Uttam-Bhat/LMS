import React, { useEffect, useState } from 'react';
import StudentLayout from './StudentLayout';
import api from '../../services/authService';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=Student&background=2563eb&color=fff&size=128';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        setStudent(null);
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

  return (
    <StudentLayout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f6f8fb' }}>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #e0e7ef', padding: '2.5rem 3rem', minWidth: 350, maxWidth: 400, textAlign: 'center' }}>
          <img src={userInfo.avatar || DEFAULT_AVATAR} alt="Profile" style={{ width: 110, height: 110, borderRadius: '50%', marginBottom: 18, objectFit: 'cover', border: '4px solid #2563eb' }} />
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