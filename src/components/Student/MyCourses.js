import React, { useState } from 'react';
import StudentLayout from './StudentLayout';

const mockEnrolledCourses = [
  {
    id: 1,
    name: 'Mathematics',
    description: 'Basic Math Course covering algebra, geometry, and calculus.',
    teacher: 'Mr. Smith',
    status: 'Active',
    startDate: '2024-05-01',
    endDate: '2024-08-01',
    progress: 60,
    image: 'https://img.icons8.com/color/96/000000/math.png',
  },
  {
    id: 2,
    name: 'Physics',
    description: 'Intro to Physics: motion, energy, and waves.',
    teacher: 'Ms. Johnson',
    status: 'Completed',
    startDate: '2024-01-10',
    endDate: '2024-04-10',
    progress: 100,
    image: 'https://img.icons8.com/color/96/000000/physics.png',
  },
];

const MyCourses = () => {
  const [search, setSearch] = useState('');
  const filteredCourses = mockEnrolledCourses.filter(course =>
    course.name.toLowerCase().includes(search.toLowerCase()) ||
    course.description.toLowerCase().includes(search.toLowerCase()) ||
    course.teacher.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <StudentLayout>
      <div style={{padding: '2.5rem 2rem', background: '#f6f8fb', minHeight: '100vh'}}>
        {/* Header Section */}
        <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4}}>
          <img src="https://img.icons8.com/fluency/48/000000/classroom.png" alt="My Course" style={{width: 36, height: 36}} />
          <div>
            <div style={{fontSize: '2rem', fontWeight: 700, color: '#2563eb', letterSpacing: 0.5, lineHeight: 1}}>My Course</div>
            <div style={{color: '#377dff', fontSize: '1.05rem', fontWeight: 400, marginTop: 2}}>Manage and track your enrolled courses</div>
          </div>
        </div>
        {/* Search Bar */}
        <div style={{margin: '1.5rem 0 2.2rem 0'}}>
          <div style={{position: 'relative', width: '100%', maxWidth: 900}}>
            <span style={{position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', fontSize: 22}}>
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses by title, description, or instructor"
              style={{
                width: '100%',
                padding: '0.9rem 1.2rem 0.9rem 3.2rem',
                border: '1.5px solid #e2e8f0',
                borderRadius: 12,
                fontSize: '1.08rem',
                background: '#fff',
                color: '#222',
                outline: 'none',
                boxShadow: 'none',
                transition: 'border 0.2s',
              }}
            />
          </div>
        </div>
        {/* Course List */}
        <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'flex-start'}}>
          {filteredCourses.length === 0 ? (
            <div style={{color: '#6b7a90', fontSize: '1.1rem'}}>No courses found.</div>
          ) : (
            filteredCourses.map(course => (
              <div
                key={course.id}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  minWidth: 320,
                  maxWidth: 350,
                  flex: '1 1 320px',
                  padding: '1.7rem 1.3rem',
                  boxShadow: '0 4px 16px rgba(30,34,90,0.09)',
                  marginBottom: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'box-shadow 0.2s',
                  position: 'relative',
                }}
              >
                <img
                  src={course.image}
                  alt={course.name}
                  style={{ width: 64, height: 64, borderRadius: 12, marginBottom: 18, boxShadow: '0 2px 8px #e0e7ef' }}
                />
                <div style={{fontWeight: 700, fontSize: '1.22rem', marginBottom: 6, color: '#2563eb', textAlign: 'center'}}>{course.name}</div>
                <div style={{color: '#6b7a90', fontSize: '1.01rem', marginBottom: 10, textAlign: 'center'}}>{course.description}</div>
                <div style={{color: '#2563eb', fontSize: '0.97rem', marginBottom: 6, fontWeight: 500}}>Teacher: {course.teacher}</div>
                <div style={{color: course.status === 'Active' ? '#1dbf73' : '#a259ff', fontWeight: 600, fontSize: '0.97rem', marginBottom: 8}}>{course.status}</div>
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 8, fontSize: '0.97rem'}}>
                  <span style={{color: '#888'}}>Start: <b>{course.startDate}</b></span>
                  <span style={{color: '#888'}}>End: <b>{course.endDate}</b></span>
                </div>
                <div style={{width: '100%', marginBottom: 12}}>
                  <div style={{height: 8, background: '#e8eaf6', borderRadius: 6, overflow: 'hidden'}}>
                    <div style={{width: `${course.progress}%`, height: '100%', background: course.progress === 100 ? '#1dbf73' : '#2563eb', transition: 'width 0.4s'}}></div>
                  </div>
                  <div style={{fontSize: '0.93rem', color: '#666', marginTop: 2, textAlign: 'right'}}>{course.progress}% complete</div>
                </div>
                <button
                  style={{
                    marginTop: 10,
                    background: course.status === 'Active' ? '#2563eb' : '#a259ff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '0.7rem 1.3rem',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px #e0e7ef',
                    transition: 'background 0.2s',
                  }}
                  onClick={() => alert('View course details')}
                >
                  {course.status === 'Active' ? 'Continue' : 'View'}
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