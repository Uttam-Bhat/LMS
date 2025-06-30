import axios from 'axios';
import { useEffect, useState } from 'react';
import './StudentDashboard.css';
import StudentLayout from './StudentLayout';

const AvailableCourses = () => {
  const [courses, setCourses] = useState([]);
  const [applied, setApplied] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all');
  const [teachers, setTeachers] = useState([]);

  // ✅ Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/course/display');
        const formattedCourses = response.data.map(course => ({
          id: course.courseId,
          name: course.coursename || 'Untitled',
          description: course.des || 'No description available',
          course_type: course.course_type || 'N/A',
          teacherId: course.ass_teacher ?? null, // use null if undefined
        }));
        setCourses(formattedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  // ✅ Fetch teachers from backend
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/course/teachers');
        setTeachers(response.data);
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  // ✅ Filter courses
  const filteredCourses = courses.filter(course => {
    const teacher = teachers.find(t => String(t.id) === String(course.teacherId));
    const teacherName = teacher?.fullname || '';

    const matchesSearch =
      (course.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (teacherName || '').toLowerCase().includes(search.toLowerCase()) ||
      (course.description || '').toLowerCase().includes(search.toLowerCase());

    const matchesView = view === 'all' || view === 'active';
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
            <div style={{ color: '#6b7a90', fontSize: '1.1rem' }}>No courses found.</div>
          ) : (
            filteredCourses.map(course => {
              const teacher = teachers.find(t => String(t.id) === String(course.teacherId));
              const teacherName = teacher?.fullname || 'Not Assigned';

              return (
                <div key={course.id} className="course-card">
                  <div className="course-header">
                    <h3>{course.name}</h3>
                    <span className="status-badge active">Active</span>
                  </div>
                  <div className="course-info">
                    <div className="info-item">
                      <i className="fas fa-chalkboard-teacher"></i>
                      <span>{teacherName}</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-layer-group"></i>
                      <span>{course.course_type}</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-info-circle"></i>
                      <span>{course.description}</span>
                    </div>
                  </div>
                  <div className="course-actions">
                    <button
                      className="student-action-btn apply"
                      title="Apply for course"
                      onClick={() => handleApply(course.id)}
                      disabled={applied.includes(course.id)}
                    >
                      {applied.includes(course.id) ? 'Applied' : 'Apply'}
                    </button>
                    <button
                      className="student-action-btn view"
                      title="View course details"
                      onClick={() => alert('View course details')}
                    >
                      View
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

export default AvailableCourses;
