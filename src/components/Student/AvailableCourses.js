import axios from 'axios';
import { useEffect, useState } from 'react';
import './StudentDashboard.css';
import StudentLayout from './StudentLayout';
import { FaBookOpen } from 'react-icons/fa';

const AvailableCourses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [search, setSearch] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [enrollLoading, setEnrollLoading] = useState(null); // courseId or null
  const [successMsg, setSuccessMsg] = useState('');
  const [enrollError, setEnrollError] = useState('');

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

  // ✅ Fetch enrolled courses for this student
  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        const studentId = localStorage.getItem('student_id');
        const response = await axios.get('http://localhost:3000/api/enroll/enroll-display');
        // Filter for this student
        const enrolledIds = response.data
          .filter(e => String(e.student_id) === String(studentId))
          .map(e => String(e.course_id));
        setEnrolled(enrolledIds);
      } catch (error) {
        setEnrolled([]);
      }
    };
    fetchEnrolled();
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

  const handleEnroll = async (courseId) => {
    const studentId = localStorage.getItem('student_id');
    console.log('ENROLL DEBUG:', { studentId, courseId }); // Debug log
    if (!studentId) {
      console.error('Student ID not found in localStorage.');
      setEnrollError('Student ID not found. Please log in again.');
      return;
    }
    setEnrollLoading(courseId);
    setEnrollError('');
    try {
      await axios.post('http://localhost:3000/api/enroll/enroll-add', {
        student_id: studentId,
        course_id: courseId
      });
      setEnrolled(prev => [...prev.map(String), String(courseId)]);
      setSuccessMsg('Enrolled successfully!');
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      console.error('Failed to enroll:', err);
      setEnrollError('Failed to enroll. Please try again.');
    } finally {
      setEnrollLoading(null);
    }
  };

  return (
    <StudentLayout>
      <div className="dashboard-main-content">
        {/* Header */}
        <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 32, justifyContent: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, width: 'fit-content' }}>
            <FaBookOpen size={38} color="#2563eb" style={{ flexShrink: 0 }} />
            <div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 700, color: '#2563eb', margin: 0 }}>Available Courses</h1>
              <div style={{ color: '#6b7280', fontSize: '1.08rem', marginTop: 2 }}>Browse and enroll in new courses</div>
            </div>
          </div>
        </div>

        {/* Success/Error Message */}
        {(successMsg || enrollError) && (
          <div style={{ background: successMsg ? '#d1fae5' : '#ffeaea', color: successMsg ? '#059669' : '#d32f2f', padding: '0.7rem 1.2rem', borderRadius: 8, marginBottom: 18, fontWeight: 600, fontSize: '1.08rem', boxShadow: successMsg ? '0 2px 8px #05966922' : '0 2px 8px #d32f2f22' }}>
            {successMsg || enrollError}
          </div>
        )}

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
              const isEnrolled = enrolled.map(String).includes(String(course.courseId));

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
                      title={isEnrolled ? 'Already enrolled' : 'Enroll in course'}
                      onClick={() => handleEnroll(course.courseId)}
                      disabled={isEnrolled || enrollLoading === course.courseId}
                      style={{ background: isEnrolled ? '#e0e7ef' : undefined, color: isEnrolled ? '#2563eb' : undefined, cursor: isEnrolled ? 'not-allowed' : undefined }}
                    >
                      {isEnrolled ? 'Enrolled' : (enrollLoading === course.courseId ? 'Enrolling...' : 'Enroll')}
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
