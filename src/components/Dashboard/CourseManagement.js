import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import CreateCourseModal from './CreateCourseModal';
import EditCourseModal from './EditCourseModal';
import AddUserToCourseModal from './AddUserToCourseModal';
import CourseReportModal from './CourseReportModal';
import DeleteCourseModal from './DeleteCourseModal';
import './CourseManagement.css';
import { FaPlus, FaEdit, FaTrashAlt, FaUserPlus, FaChartLine } from 'react-icons/fa';

const CourseManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'edit' | 'report' | 'addUser' | 'delete'
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Sample data - replace with actual data from your backend
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: 'Introduction to Computer Science',
      teacher: 'John Doe',
      students: 45,
      completion: 75,
      status: 'active',
      courseType: 'certified',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      description: 'Learn the fundamentals of computer science and programming.'
    },
    {
      id: 2,
      name: 'Advanced Mathematics',
      teacher: 'Jane Smith',
      students: 32,
      completion: 60,
      status: 'active',
      courseType: 'professional',
      startDate: '2024-01-15',
      endDate: '2024-07-15',
      description: 'Advanced mathematical concepts and problem-solving techniques.'
    },
    {
      id: 3,
      name: 'Physics 101',
      teacher: 'Mike Johnson',
      students: 28,
      completion: 90,
      status: 'completed',
      courseType: 'non-certified',
      startDate: '2023-09-01',
      endDate: '2024-01-31',
      description: 'Basic physics principles and laboratory experiments.'
    }
  ]);

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

  const handleCourseUpdate = (updatedData) => {
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === selectedCourse.id 
          ? { ...course, ...updatedData }
          : course
      )
    );
  };

  const handleCourseDelete = (courseId) => {
    setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
  };

  const handleAddStudents = (students) => {
    console.log('Students added to course:', students);
    // Here you would typically update the backend
    // For now, we'll just show an alert
    alert(`${students.length} student(s) added to ${selectedCourse.name}`);
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