import React, { useState } from 'react';
import StudentLayout from './StudentLayout';
import './StudentDashboard.css';

const mockCourses = [
  { id: 1, name: 'Mathematics', description: 'Basic Math Course', teacher: 'Mr. Smith' },
  { id: 2, name: 'Physics', description: 'Intro to Physics', teacher: 'Ms. Johnson' },
  { id: 3, name: 'Chemistry', description: 'Organic Chemistry', teacher: 'Dr. Brown' },
];

const AvailableCourses = () => {
  const [applied, setApplied] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all'); // all | active | completed

  // Filtering
  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch =
      course.name.toLowerCase().includes(search.toLowerCase()) ||
      course.teacher.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());
    // For demo, all courses are 'active' (no completed logic)
    const matchesView = view === 'all' || (view === 'active');
    return matchesSearch && matchesView;
  });

  const handleApply = (id) => {
    setApplied(prev => [...prev, id]);
    alert('Applied for course!');
  };

  return (
    <StudentLayout>
      <div className="dashboard-main-content">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Available Courses</h1>
            <p>Browse and apply for new courses</p>
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
                  <span className="status-badge active">Active</span>
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
                </div>
                <div className="course-actions">
                  <button
                    className="action-btn apply"
                    title="Apply for course"
                    onClick={() => handleApply(course.id)}
                    disabled={applied.includes(course.id)}
                  >
                    {applied.includes(course.id) ? 'Applied' : 'Apply'}
                  </button>
                  <button
                    className="action-btn view"
                    title="View course details"
                    onClick={() => alert('View course details')}
                  >
                    View
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

export default AvailableCourses; 