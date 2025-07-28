import api from '../../services/authService';
import { useEffect, useState } from 'react';
import AddUserToCourseModal from './AddUserToCourseModal';
import './CourseManagement.css';
import CourseReportModal from './CourseReportModal';
import CreateCourseModal from './CreateCourseModal';
import DashboardLayout from './DashboardLayout';
import DeleteCourseModal from './DeleteCourseModal';
import EditCourseModal from './EditCourseModal';
import toast from 'react-hot-toast';

import { FaChartLine, FaEdit, FaPlus, FaTrashAlt, FaUserPlus } from 'react-icons/fa';

const CourseManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'edit' | 'report' | 'addUser' | 'delete'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]); 
   const [totalCourses, setTotalCourses] = useState(0);
   const [teachers, setTeachers] = useState([]);
   const [enrolledStudentCount, setEnrolledStudentCount] = useState(0);
   const [selectedCourseType, setSelectedCourseType] = useState('');

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/course/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const [courseRes, enrollRes] = await Promise.all([
        api.get('/course/display'),
        api.get('/enroll/enroll-display')
      ]);
      const enrollments = enrollRes.data || [];
      // Unique student count
      const uniqueStudentIds = Array.from(new Set(enrollments.map(e => String(e.st_id))));
      setEnrolledStudentCount(uniqueStudentIds.length);
      // Map backend fields to UI structure
      const mapped = courseRes.data.map(course => {
        const studentCount = enrollments.filter(e => String(e.course_info.cid) === String(course.courseId)).length;
        return {
          courseId: course.courseId,
          coursename: course.coursename || '',
          course_type: course.course_type || '',
          ass_teacher: course.ass_teacher || '',
          start_date: course.start_date || '',
          end_date: course.end_date || '',
          des: course.des || '',
          students: studentCount,
          completion: course.completion || 0,
          status: 'active',
        };
      });
      setCourses(mapped);
      setTotalCourses(mapped.length); // Update total courses count
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const openModal = (type, course) => {
    setModalType(type);
    setSelectedCourse(course);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const closeModal = () => {
    setModalType(null);
    setSelectedCourse(null);
  };

  const handleCourseUpdate = async (updatedData) => {
    try {
      // Update the course in the backend
      const response = await api.put(`/course/edit/${updatedData.courseId}`, updatedData);
      
      if (response.status === 200) {
        // Refresh both courses and teachers data to ensure everything is in sync
        await Promise.all([fetchCourses(), fetchTeachers()]);
        
        toast.success('Course updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update course:', error);
      toast.error('Failed to update course. Please try again.');
    }
  };

  const handleCourseDelete = async (courseId) => {
    try {
      // The actual deletion is handled in DeleteCourseModal
      // Here we just refresh the courses data
      await fetchCourses();
    } catch (error) {
      console.error('Failed to refresh courses after deletion:', error);
    }
  };

  const handleAddStudents = (students) => {
    // No toast here; handled in the modal
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const courseName = (course.coursename || '').toLowerCase();
    const teacherId = (course.ass_teacher || '').toLowerCase();
    const teacherName = (() => {
      const teacher = teachers.find(
        t => String(t.id || t._id) === String(course.ass_teacher)
      );
      return (teacher?.fullname || teacher?.name || '').toLowerCase();
    })();
    const searchTerm = searchQuery.toLowerCase();
    const matchesType = !selectedCourseType || (course.course_type && course.course_type.toLowerCase() === selectedCourseType.toLowerCase());
    return (
      (courseName.includes(searchTerm) || 
      teacherId.includes(searchTerm) || 
      teacherName.includes(searchTerm)) &&
      matchesType
    );
  });

  useEffect(() => {
    if (teachers.length && courses.length) {
    }
  }, [teachers, courses]);

  // Calculate dynamic average completion
  const averageCompletion = courses.length
    ? Math.round(courses.reduce((sum, c) => sum + (c.completion || 0), 0) / courses.length)
    : 0;

  const isMobile = window.innerWidth <= 900;

  return (
    <DashboardLayout>
      <div className="course-management">
        <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 32, gap: 18, position: 'relative' }}>
          <FaChartLine size={38} color="#2563eb" style={{ flexShrink: 0 }} />
          <div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 700, color: '#2563eb', margin: 0 }}>Course Management</h1>
            <div style={{ color: '#6b7280', fontSize: '1.08rem', marginTop: 2 }}>Create, manage and track your courses</div>
          </div>
          {!isMobile && (
            <button 
              className="create-course-btn"
              style={{ position: 'absolute', right: 0, top: 0 }}
              onClick={() => setShowCreateCourseModal(true)}
            >
              <FaPlus />
              Create New Course
            </button>
          )}
        </div>
        {isMobile && (
          <button 
            className="create-course-btn"
            style={{ width: '90%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.1rem auto', fontSize: '1.08rem', padding: '1.1rem 0', borderRadius: 14, boxSizing: 'border-box', boxShadow: '0 2px 12px rgba(30,34,90,0.10)', gap: '0.7rem' }}
            onClick={() => setShowCreateCourseModal(true)}
          >
            <FaPlus />
            Create New Course
          </button>
        )}

        <div className="course-stats">
          <div className="stat-card">
            <div className="stat-icon active">
              <i className="fas fa-book"></i>
            </div>
            <div className="stat-content">
              <h3>Active Courses</h3>
              <p>{totalCourses}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon teachers">
              <i className="fas fa-chalkboard-teacher"></i>
            </div>
            <div className="stat-content">
              <h3>Total Teachers</h3>
              <p>{teachers.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon students">
              <i className="fas fa-user-graduate"></i>
            </div>
            <div className="stat-content">
              <h3>Enrolled Students</h3>
              <p>{enrolledStudentCount}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completion">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="stat-content">
              <h3>Average Completion</h3>
              <p>{averageCompletion}%</p>
            </div>
          </div>
        </div>

        <div className="courses-container">
          <div className="courses-header" style={isMobile ? { 
            flexDirection: 'column', 
            alignItems: 'stretch', 
            gap: '1rem',
            padding: '0 16px'
          } : {}}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12,
              flexDirection: isMobile ? 'column' : 'row',
              width: isMobile ? '100%' : 'auto'
            }}>
              <div className="search-box" style={{ 
                position: 'relative', 
                width: isMobile ? '100%' : 300,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
                <i className="fas fa-search" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', fontSize: 18 }}></i>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={handleSearch}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    border: '1px solid #e1e1e1',
                    borderRadius: 8,
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              {/* Course type dropdown filter */}
              <select
                value={selectedCourseType}
                onChange={e => setSelectedCourseType(e.target.value)}
                style={{
                  padding: '0.7rem 1.2rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: '1rem',
                  background: '#f9fafb',
                  color: '#1a1a1a',
                  outline: 'none',
                  minWidth: isMobile ? '100%' : 160,
                  marginLeft: isMobile ? 0 : 8,
                  marginTop: isMobile ? 8 : 0,
                  boxSizing: 'border-box'
                }}
              >
                <option value=''>All Course Types</option>
                {[...new Set(courses.map(c => c.course_type).filter(Boolean))].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile: course cards, Desktop: grid */}
          {isMobile ? (
            <div className="users-cards-container">
              {filteredCourses.map(course => (
                <div key={course.courseId} className="user-card">
                  <div className="user-card-header">
                    <div className="user-card-info">
                      <div className="user-card-name">{course.coursename}</div>
                      <div className="user-card-email">{(() => {
                        const teacher = teachers.find(
                          t => String(t.id || t._id) === String(course.ass_teacher)
                        );
                        return teacher?.fullname || teacher?.name || course.ass_teacher;
                      })()}</div>
                    </div>
                    <span className={`role-badge ${course.status}`}>{course.status.charAt(0).toUpperCase() + course.status.slice(1)}</span>
                  </div>
                  <div className="user-card-row">
                    <span className="user-card-label">Students:</span>
                    <span>{course.students}</span>
                  </div>
                  <div className="user-card-row">
                    <span className="user-card-label">Start:</span>
                    <span>{course.start_date}</span>
                  </div>
                  <div className="user-card-row">
                    <span className="user-card-label">End:</span>
                    <span>{course.end_date}</span>
                  </div>
                  <div className="user-card-row">
                    <span className="user-card-label">Description:</span>
                    <span>{course.des}</span>
                  </div>
                  {/* Only show this action row for mobile cards */}
                  {isMobile && (
                    <div className="user-card-row">
                      <span className="user-card-label">Actions:</span>
                      <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button className="edit-btn" title="Edit course" onClick={() => openModal('edit', course)}>
                          <FaEdit />
                        </button>
                        <button className="assign-btn" title="Add User" onClick={() => openModal('addUser', course)}>
                          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22 }}>
                            <FaUserPlus />
                          </span>
                        </button>
                        <button className="delete-btn" title="Delete course" onClick={() => openModal('delete', course)}>
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="courses-grid">
              {filteredCourses.map(course => (
                <div key={course.courseId} className="course-card">
                  <div className="course-header">
                    <h3>{course.coursename}</h3>
                    <span className={`status-badge ${course.status}`}>
                      {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                    </span>
                  </div>
                  <div className="course-info">
                    <div className="info-item">
                      <i className="fas fa-chalkboard-teacher"></i>
                      <span>{(() => {
                        const teacher = teachers.find(
                          t => String(t.id || t._id) === String(course.ass_teacher)
                        );
                        return teacher?.fullname || teacher?.name || course.ass_teacher;
                      })()}</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-users"></i>
                      <span>{course.students} Students</span>
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
                    <button className="action-btn edit" title="Edit course" onClick={() => openModal('edit', course)}>
                      <FaEdit />
                    </button>
                    <button className="action-btn assign" title="Add User" onClick={() => openModal('addUser', course)}>
                      <FaUserPlus />
                    </button>
                    <button className="action-btn delete" title="Delete course" onClick={() => openModal('delete', course)}>
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showCreateCourseModal && (
  <CreateCourseModal 
    onClose={() => setShowCreateCourseModal(false)} 
    onCourseAdded={async (newCourse) => {
      await fetchCourses(); // Refresh courses data
    }}
  />
)}
        {/* Edit Course Modal */}
        {modalType === 'edit' && selectedCourse && (
          <EditCourseModal 
            onClose={closeModal}
            course={selectedCourse}
            onUpdate={handleCourseUpdate}
          />
        )}

        {/* Add User to Course Modal */}
        {modalType === 'addUser' && selectedCourse && (
          <AddUserToCourseModal 
            onClose={closeModal}
            course={selectedCourse}
            onUpdate={handleAddStudents}
          />
        )}

        {/* Course Report Modal */}
        {modalType === 'report' && selectedCourse && (
          <CourseReportModal 
            onClose={closeModal}
            course={selectedCourse}
          />
        )}

        {/* Delete Course Modal */}
        {modalType === 'delete' && selectedCourse && (
          <DeleteCourseModal 
            onClose={closeModal}
            course={selectedCourse}
            onDelete={handleCourseDelete}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CourseManagement; 