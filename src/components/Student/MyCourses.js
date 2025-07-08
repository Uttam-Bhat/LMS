import React, { useState, useEffect } from 'react';
import StudentLayout from './StudentLayout';
import './StudentDashboard.css';
import { FaBook } from 'react-icons/fa';
import axios from 'axios';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all'); // all | active | completed
  const [cancelLoading, setCancelLoading] = useState(null); // er_id or null

  useEffect(() => {
    const fetchEnrollments = async () => {
      setLoading(true);
      try {
        const studentId = localStorage.getItem('student_id');
        const res = await axios.get('http://localhost:3000/api/enroll/enroll-display');
        // Filter for this student
        const filtered = res.data.filter(e => String(e.st_id) === String(studentId));
        setEnrollments(filtered);
      } catch (err) {
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  // Filtering
  const filteredCourses = enrollments.filter(enroll => {
    const course = enroll.course_info;
    const matchesSearch =
      (course.coursename || '').toLowerCase().includes(search.toLowerCase()) ||
      (course.des || '').toLowerCase().includes(search.toLowerCase());
    // You can add more filters for view if needed
    return matchesSearch;
  });

  const handleCancel = async (er_id) => {
    if (!window.confirm('Are you sure you want to cancel this enrollment?')) return;
    setCancelLoading(er_id);
    try {
      await axios.delete(`http://localhost:3000/api/enroll/enroll-delete/${er_id}`);
      setEnrollments(prev => prev.filter(e => e.er_id !== er_id));
    } catch (err) {
      alert('Failed to cancel enrollment.');
    } finally {
      setCancelLoading(null);
    }
  };

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

        {/* Search */}
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
        </div>

        {/* Courses Grid */}
        <div className="courses-grid">
          {loading ? (
            <div style={{ color: '#6b7a90', fontSize: '1.1rem' }}>Loading...</div>
          ) : filteredCourses.length === 0 ? (
            <div style={{ color: '#6b7a90', fontSize: '1.1rem' }}>No courses found.</div>
          ) : (
            filteredCourses.map(enroll => {
              const course = enroll.course_info;
              return (
                <div key={enroll.er_id} className="course-card">
                  <div className="course-header">
                    <h3>{course.coursename}</h3>
                    <span className="status-badge active">Active</span>
                  </div>
                  <div className="course-info">
                    <div className="info-item">
                      <i className="fas fa-layer-group"></i>
                      <span>Type: {course.course_type}</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-calendar-alt"></i>
                      <span>Start: {course.start_date}</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-calendar-check"></i>
                      <span>End: {course.end_date}</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-info-circle"></i>
                      <span>Description: {course.des}</span>
                    </div>
                  </div>
                  <div className="course-actions">
                    <button
                      className="student-action-btn view"
                      title="View Course"
                      onClick={() => alert('View course details')}
                    >
                      View
                    </button>
                    <button
                      className="student-action-btn cancel"
                      title="Cancel Enrollment"
                      onClick={() => handleCancel(enroll.er_id)}
                      disabled={cancelLoading === enroll.er_id}
                      style={{ marginLeft: 10, background: '#ffeaea', color: '#d32f2f', border: '1px solid #ffcdd2' }}
                    >
                      {cancelLoading === enroll.er_id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default MyCourses; 