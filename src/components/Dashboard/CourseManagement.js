import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import CreateCourseModal from './CreateCourseModal';
import './CourseManagement.css';
import { FaPlus, FaEdit, FaTrashAlt, FaUserPlus, FaChartLine } from 'react-icons/fa';

const CourseManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  
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
                  <button className="action-btn edit" title="Edit course">
                    <FaEdit />
                  </button>
                  <button className="action-btn assign" title="Assign teachers">
                    <FaUserPlus />
                  </button>
                  <button className="action-btn track" title="View progress">
                    <FaChartLine />
                  </button>
                  <button className="action-btn delete" title="Delete course">
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
      </div>
    </DashboardLayout>
  );
};

export default CourseManagement; 