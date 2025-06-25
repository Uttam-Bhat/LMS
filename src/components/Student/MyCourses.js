import React from 'react';
import StudentLayout from './StudentLayout';

const mockEnrolledCourses = [
  { id: 1, name: 'Mathematics', description: 'Basic Math Course', teacher: 'Mr. Smith', status: 'Active' },
  { id: 2, name: 'Physics', description: 'Intro to Physics', teacher: 'Ms. Johnson', status: 'Completed' },
];

const MyCourses = () => {
  return (
    <StudentLayout>
      <div style={{padding: '2.5rem 2rem', background: '#f6f8fb', minHeight: '100vh'}}>
        <h1 style={{fontSize: '1.7rem', fontWeight: 700, color: '#377dff', marginBottom: 0}}>My Courses</h1>
        <p style={{color: '#5b6b7a', fontSize: '1.1rem', marginBottom: '2.2rem'}}>Your enrolled courses</p>
        <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap'}}>
          {mockEnrolledCourses.length === 0 ? (
            <div style={{color: '#6b7a90', fontSize: '1.1rem'}}>You are not enrolled in any courses yet.</div>
          ) : (
            mockEnrolledCourses.map(course => (
              <div key={course.id} style={{background: '#fff', borderRadius: '12px', minWidth: 320, maxWidth: 350, flex: '1 1 320px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(30,34,90,0.06)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <div>
                  <div style={{fontWeight: 600, fontSize: '1.18rem', marginBottom: 8}}>{course.name}</div>
                  <div style={{color: '#6b7a90', fontSize: '0.98rem', marginBottom: 8}}>{course.description}</div>
                  <div style={{color: '#2563eb', fontSize: '0.97rem', marginBottom: 8}}>Teacher: {course.teacher}</div>
                  <div style={{color: course.status === 'Active' ? '#1dbf73' : '#a259ff', fontWeight: 500, fontSize: '0.97rem', marginBottom: 8}}>{course.status}</div>
                </div>
                <button
                  style={{marginTop: 16, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontWeight: 500, fontSize: '1rem', cursor: 'pointer'}}
                  onClick={() => alert('View course details')}
                >
                  View
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default MyCourses; 