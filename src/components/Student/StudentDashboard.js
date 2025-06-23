import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Course from './Course';
import Exam from './Exam';
import './StudentDashboard.css';
import StudentLayout from './StudentLayout';

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
            <i className="fas fa-book"></i>
            <div className="stat-content">
              <h3>Courses</h3>
              <p>5</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-file-alt"></i>
            <div className="stat-content">
              <h3>Exam Compeleted</h3>
              <p>2</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-chart-line"></i>
            <div className="stat-content">
              <h3>Result</h3>
              <p>1</p>
            </div>
          </div>
        </div>
      </div>
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <div className="quick-action-card">
            <div className="quick-action-icon">
              <i className="fas fa-book"></i>
            </div>
            <h3>Enroll Course</h3>
            <p>Join to the new course</p>
            <button 
              className="quick-action-btn"
              onClick={() => setShowCourse(true)}
            >
              Enroll
            </button>
          </div>
          <div className="quick-action-card">
            <div className="quick-action-icon">
              <i className="fas fa-file-alt"></i>
            </div>
            <h3>Write Exam</h3>
            <p>Attempt to write the exam</p>
            <button 
              className="quick-action-btn"
              onClick={() => setShowExam(true)}
            >
              Attempt
            </button>
          </div>
        </div>
        {showCourse && (
          <Course onClose={() => setShowCourse(false)} />
        )}
        {showExam && (
          <Exam onClose={() => setShowExam(false)} />
        )}
      </div>
    </StudentLayout>
  );
};
export default StudentDashboard;