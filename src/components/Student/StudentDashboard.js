import StudentLayout from './StudentLayout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Course from './Course';
import Exam from './Exam';
import Result from './Result';

const StudentDashboard = () => {
  const [showCourse, setShowCourse] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const navigate = useNavigate();

  return (
    <StudentLayout>
      <div className="dashboard-welcome">
        <h1>Welcome Student</h1>
        <p>Manage your learning assessment system from here</p>
        <div className="dashboard-stats">
          <div className="stat-card">
            <i className="fas fa-active"></i>
            <div className="stat-content">
              <h3>Courses</h3>
              <p>5</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-file-alt"></i>
            <div className="stat-content">
              <h3>Exam Completed</h3>
              <p>2</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-chart-line"></i>
            <div className="stat-content">
              <h3>Results Processed</h3>
              <p>156</p>
            </div>
          </div>
        </div>
      </div>
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <div className="quick-action-card">
            <div className="quick-action-icon">
              <i className="fas fa-plus-circle"></i>
            </div>
            <h3>Create Course</h3>
            <p>Add a new course to the system</p>
            <button 
              className="quick-action-btn"
              onClick={() => setShowCourse(true)}
            >
              Create Now
            </button>
          </div>
          <div className="quick-action-card">
            <div className="quick-action-icon">
              <i className="fas fa-user-plus"></i>
            </div>
            <h3>Add User</h3>
            <p>Register a new user account</p>
            <button 
              className="quick-action-btn"
              onClick={() => setShowExam(true)}
            >
              Add User
            </button>
          </div>
          <div className="quick-action-card">
            <div className="quick-action-icon">
              <i className="fas fa-file-medical"></i>
            </div>
            <h3>Create Exam</h3>
            <p>Create a new examination</p>
            <button 
              className="quick-action-btn"
              onClick={() => setShowResult(true)}
            >
              Create Exam
            </button>
          </div>
        </div>
        {showCourse && (
          <Course onClose={() => setShowCourse(false)} />
        )}
        {showExam && (
          <Exam onClose={() => setShowExam(false)} />
        )}
        {showResult && (
          <Result onClose={() => setShowResult(false)} />
        )}
      </div>
    </StudentLayout>
  );
};
export default StudentDashboard;