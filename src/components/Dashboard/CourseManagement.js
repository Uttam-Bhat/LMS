import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import CreateCourseModal from './CreateCourseModal';
import './CourseManagement.css';
import { FaPlus, FaEdit, FaTrashAlt, FaUserPlus, FaChartLine } from 'react-icons/fa';

const CourseManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'edit' | 'report' | 'addUser' | 'delete'
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Sample data - replace with actual data from your backend
  const courses = [
    {
      id: 1,
      name: 'Introduction to Computer Science',
      teacher: 'John Doe',
      students: 45,
      completion: 75,
      status: 'active'
    },
    {
      id: 2,
      name: 'Advanced Mathematics',
      teacher: 'Jane Smith',
      students: 32,
      completion: 60,
      status: 'active'
    },
    {
      id: 3,
      name: 'Physics 101',
      teacher: 'Mike Johnson',
      students: 28,
      completion: 90,
      status: 'completed'
    }
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (type, course) => {
    setModalType(type);
    setSelectedCourse(course);
  };
  const closeModal = () => {
    setModalType(null);
    setSelectedCourse(null);
  };

  return (
    <DashboardLayout>
      <div className="course-management">
        <div className="page-header">
          <div className="header-content">
            <h1>Course Management</h1>
            <p>Create, manage and track your courses</p>
          </div>
          <button 
            className="create-course-btn"
            onClick={() => setShowCreateCourseModal(true)}
          >
            <FaPlus />
            Create New Course
          </button>
        </div>

        <div className="course-stats">
          <div className="stat-card">
            <div className="stat-icon active">
              <i className="fas fa-book"></i>
            </div>
            <div className="stat-content">
              <h3>Active Courses</h3>
              <p>12</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon teachers">
              <i className="fas fa-chalkboard-teacher"></i>
            </div>
            <div className="stat-content">
              <h3>Total Teachers</h3>
              <p>24</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon students">
              <i className="fas fa-user-graduate"></i>
            </div>
            <div className="stat-content">
              <h3>Enrolled Students</h3>
              <p>360</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completion">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="stat-content">
              <h3>Average Completion</h3>
              <p>78%</p>
            </div>
          </div>
        </div>

        <div className="courses-container">
          <div className="courses-header">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="view-options">
              <button className="view-btn active">All Courses</button>
              <button className="view-btn">Active</button>
              <button className="view-btn">Completed</button>
            </div>
          </div>

          <div className="courses-grid">
            {filteredCourses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-header">
                  <h3>{course.name}</h3>
                  <span className={`status-badge ${course.status}`}>
                    {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                  </span>
                </div>
                <div className="course-info">
                  <div className="info-item">
                    <i className="fas fa-chalkboard-teacher"></i>
                    <span>{course.teacher}</span>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-users"></i>
                    <span>{course.students} Students</span>
                  </div>
                </div>
                <div className="completion-bar">
                  <div className="completion-track">
                    <div 
                      className="completion-fill" 
                      style={{ width: `${course.completion}%` }}
                    ></div>
                  </div>
                  <span className="completion-text">{course.completion}% Completed</span>
                </div>
                <div className="course-actions">
                  <button className="action-btn edit" title="Edit course" onClick={() => openModal('edit', course)}>
                    <FaEdit />
                  </button>
                  <button className="action-btn assign" title="Add User" onClick={() => openModal('addUser', course)}>
                    <FaUserPlus />
                  </button>
                  <button className="action-btn track" title="View Report" onClick={() => openModal('report', course)}>
                    <FaChartLine />
                  </button>
                  <button className="action-btn delete" title="Delete course" onClick={() => openModal('delete', course)}>
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showCreateCourseModal && (
          <CreateCourseModal onClose={() => setShowCreateCourseModal(false)} />
        )}
        {/* Action Modals */}
        {modalType && selectedCourse && (
          <div className="modal-overlay">
            <div className="create-course-modal">
              <div className="modal-header">
                <h2>
                  {modalType === 'edit' && 'Edit Course'}
                  {modalType === 'report' && 'Course Report'}
                  {modalType === 'addUser' && 'Add User to Course'}
                  {modalType === 'delete' && 'Delete Course'}
                </h2>
                <button className="close-button" onClick={closeModal}>×</button>
              </div>
              <div style={{ padding: '1rem 0' }}>
                {modalType === 'edit' && <p>Edit course: {selectedCourse.name}</p>}
                {modalType === 'report' && <p>Report for course: {selectedCourse.name}</p>}
                {modalType === 'addUser' && <p>Add user to course: {selectedCourse.name}</p>}
                {modalType === 'delete' && <p>Are you sure you want to delete course: {selectedCourse.name}?</p>}
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={closeModal}>Close</button>
                {modalType === 'delete' && <button type="button" className="create-btn" onClick={closeModal}>Delete</button>}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CourseManagement; 