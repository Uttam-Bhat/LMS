import React, { useState } from 'react';
import StudentLayout from './StudentLayout';
import './StudentDashboard.css';
import { FaBook } from 'react-icons/fa';

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
  const [view, setView] = useState('all'); // all | active | completed

  // Stats
  const totalCourses = mockEnrolledCourses.length;
  const activeCourses = mockEnrolledCourses.filter(c => c.status === 'Active').length;
  const completedCourses = mockEnrolledCourses.filter(c => c.status === 'Completed').length;

  // Filtering
  const filteredCourses = mockEnrolledCourses.filter(course => {
    const matchesSearch =
      course.name.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase()) ||
      course.teacher.toLowerCase().includes(search.toLowerCase());
    const matchesView =
      view === 'all' ||
      (view === 'active' && course.status === 'Active') ||
      (view === 'completed' && course.status === 'Completed');
    return matchesSearch && matchesView;
  });

  return (
    <StudentLayout>
      <div className="dashboard-main-content">
        {/* Header */}
        <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 32, justifyContent: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, width: 'fit-content' }}>
            <FaBook size={38} color="#2563eb" style={{ flexShrink: 0 }} />
            <div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 700, color: '#2563eb', margin: 0 }}>My Courses</h1>
              <div style={{ color: '#6b7280', fontSize: '1.08rem', marginTop: 2 }}>Manage and track your enrolled courses</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="course-stats">
          <div className="stat-card">
            <div className="stat-icon active">
              <i className="fas fa-book"></i>
            </div>
            <div className="stat-content">
              <h3>Total Enrolled</h3>
              <p>{totalCourses}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon teachers">
              <i className="fas fa-play-circle"></i>
            </div>
            <div className="stat-content">
              <h3>Active</h3>
              <p>{activeCourses}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completion">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <h3>Completed</h3>
              <p>{completedCourses}</p>
            </div>
          </div>
        </div>

        {/* Search and View Options */}
        <div className="courses-header">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="view-options">
            <button className={`view-btn${view === 'all' ? ' active' : ''}`} onClick={() => setView('all')}>All</button>
            <button className={`view-btn${view === 'active' ? ' active' : ''}`} onClick={() => setView('active')}>Active</button>
            <button className={`view-btn${view === 'completed' ? ' active' : ''}`} onClick={() => setView('completed')}>Completed</button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="courses-grid">
          {filteredCourses.length === 0 ? (
            <div style={{color: '#6b7a90', fontSize: '1.1rem'}}>No courses found.</div>
          ) : (
            filteredCourses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-header">
                  <h3>{course.name}</h3>
                  <span className={`status-badge ${course.status.toLowerCase()}`}>{course.status}</span>
                </div>
                <div className="course-info">
                  <div className="info-item">
                    <i className="fas fa-chalkboard-teacher"></i>
                    <span>{course.teacher}</span>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-info-circle"></i>
                    <span>{course.description}</span>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-calendar-alt"></i>
                    <span>Start: {course.startDate}</span>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-calendar-check"></i>
                    <span>End: {course.endDate}</span>
                  </div>
                </div>
                <div className="completion-bar">
                  <div className="completion-track">
                    <div 
                      className="completion-fill" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <span className="completion-text">{course.progress}% Completed</span>
                </div>
                <div className="course-actions">
                  <button
                    className="student-action-btn view"
                    title={course.status === 'Active' ? 'Continue Course' : 'View Course'}
                    onClick={() => alert('View course details')}
                  >
                    {course.status === 'Active' ? 'Continue' : 'View'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default MyCourses; 