import React from 'react';
import StudentLayout from './StudentLayout';

const student = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  degree: 'B.Tech CSE',
  year: '3rd Year',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
};

const StudentProfile = () => (
  <StudentLayout>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f6f8fb' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #e0e7ef', padding: '2.5rem 3rem', minWidth: 350, maxWidth: 400, textAlign: 'center' }}>
        <img src={student.avatar} alt="Profile" style={{ width: 110, height: 110, borderRadius: '50%', marginBottom: 18, objectFit: 'cover', border: '4px solid #2563eb' }} />
        <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 6 }}>{student.name}</h2>
        <div style={{ color: '#377dff', fontSize: '1.08rem', marginBottom: 8 }}>{student.email}</div>
        <div style={{ color: '#5b6b7a', fontSize: '1.05rem', marginBottom: 4 }}>Degree: {student.degree}</div>
        <div style={{ color: '#5b6b7a', fontSize: '1.05rem', marginBottom: 4 }}>Year: {student.year}</div>
      </div>
    </div>
  </StudentLayout>
);

export default StudentProfile; 