import axios from 'axios';
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

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/course/teachers');
      setTeachers(response.data);
      console.log("Fetched data:", response.data);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/course/display');
      // Map backend fields to UI structure
      const mapped = response.data.map(course => ({
        courseId: course.courseId,
        coursename: course.coursename || '',
        course_type: course.course_type || '',
        ass_teacher: course.ass_teacher || '',
        start_date: course.start_date || '',
        end_date: course.end_date || '',
        des: course.des || '',
        students: course.students || 0,
        completion: course.completion || 0,
        status: 'active',
      }));
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
      const response = await axios.put(`http://localhost:3000/api/course/edit/${updatedData.courseId}`, updatedData);
      
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
    console.log('Students added to course:', students);
    // Here you would typically update the backend
    // For now, we'll just show an alert
    toast.success(`${students.length} student(s) added to ${selectedCourse.coursename}`);
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
    
    return courseName.includes(searchTerm) || 
           teacherId.includes(searchTerm) || 
           teacherName.includes(searchTerm);
  });

  useEffect(() => {
    if (teachers.length && courses.length) {
      console.log('Teachers:', teachers);
      console.log('Courses:', courses);
    }
  }, [teachers, courses]);

  return (
    <DashboardLayout>
      <div className="course-management">
        <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <FaChartLine size={38} color="#2563eb" style={{ flexShrink: 0 }} />
            <div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 700, color: '#2563eb', margin: 0 }}>Course Management</h1>
              <div style={{ color: '#6b7280', fontSize: '1.08rem', marginTop: 2 }}>Create, manage and track your courses</div>
            </div>
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
                    <span>{
                      (() => {
                        const teacher = teachers.find(
                          t => String(t.id || t._id) === String(course.ass_teacher)
                        );
                        return teacher?.fullname || teacher?.name || course.ass_teacher;
                      })()
                    }</span>
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
                  <button className="action-btn delete" title="Delete course" onClick={() => openModal('delete', course)}>
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
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