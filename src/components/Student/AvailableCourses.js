import axios from 'axios';
import { useEffect, useState } from 'react';
import './StudentDashboard.css';
import StudentLayout from './StudentLayout';

const AvailableCourses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [search, setSearch] = useState('');
  const [teachers, setTeachers] = useState([]);

  // ✅ Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/course/display');
        setCourses(response.data);
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
    const teacher = teachers.find(t => String(t.id) === String(course.ass_teacher));
    const teacherName = teacher?.fullname || '';
    const matchesSearch =
      (course.coursename || '').toLowerCase().includes(search.toLowerCase()) ||
      (teacherName || '').toLowerCase().includes(search.toLowerCase()) ||
      (course.des || '').toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handleEnroll = (id) => {
    setEnrolled(prev => [...prev, id]);
    alert('Enrolled in course!');
  };

  return (
    <StudentLayout>
      <div className="dashboard-main-content">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Available Courses</h1>
            <p>Browse and enroll in new courses</p>
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
        </div>

        {/* Courses Grid */}
        <div className="courses-grid">
          {filteredCourses.length === 0 ? (
            <div style={{ color: '#6b7a90', fontSize: '1.1rem' }}>No courses found.</div>
          ) : (
            filteredCourses.map(course => {
              const teacher = teachers.find(t => String(t.id) === String(course.ass_teacher));
              const teacherName = teacher?.fullname || 'Not Assigned';

              return (
                <div key={course.courseId} className="course-card">
                  <div className="course-header">
                    <h3>{course.coursename}</h3>
                    <span className="status-badge active">Active</span>
                  </div>
                  <div className="course-info">
                    <div className="info-item">
                      <i className="fas fa-chalkboard-teacher"></i>
                      <span>Teacher: {teacherName}</span>
                    </div>
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
                      className="student-action-btn apply"
                      title="Enroll in course"
                      onClick={() => handleEnroll(course.courseId)}
                      disabled={enrolled.includes(course.courseId)}
                    >
                      {enrolled.includes(course.courseId) ? 'Enrolled' : 'Enroll'}
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
