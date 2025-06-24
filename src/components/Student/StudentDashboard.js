import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Course from './Course';
import Exam from './Exam';
import StudentLayout from './StudentLayout';
import styles from './StudentDashboard.module.css';

const StudentDashboard = () => {
  // Example student info (replace with real data as needed)
  const student = {
    name: 'John',
    degree: 'B.Tech CSE',
    year: '3rd Year',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  };
  const [showCourse, setShowCourse] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const navigate = useNavigate();

  return (
    <StudentLayout>
      <div className={styles.dashboardMain}>
        <div className={styles.headerRow}>
          <h1 className={styles.welcome}>Welcome, {student.name}!</h1>
          <div className={styles.subInfo}>{student.degree} {student.year}</div>
        </div>
        <div className={styles.cardsGridSingleRow}>
          <div className={styles.card}>
            <i className="fas fa-book"></i>
            <div>
              <div className={styles.cardTitle}>My Courses</div>
              <div className={styles.cardDesc}>5 Active Courses</div>
            </div>
          </div>
          <div className={styles.card}>
            <i className="fas fa-flask"></i>
            <div>
              <div className={styles.cardTitle}>Upcoming Exams</div>
              <div className={styles.cardDesc}>Math – June 25</div>
            </div>
          </div>
          <div className={styles.card}>
            <i className="fas fa-chart-line"></i>
            <div>
              <div className={styles.cardTitle}>My Performance</div>
              <div className={styles.cardDesc}><b>GPA: 8.5</b></div>
              <div className={styles.cardSubDesc}>New Exam: A Grade</div>
            </div>
          </div>
          <div className={styles.cardClickable} onClick={() => navigate('/student/Notifications')} tabIndex={0} role="button">
            <i className="fas fa-bell"></i>
            <div>
              <div className={styles.cardTitle}>Notifications</div>
              <div className={styles.cardDesc}>1 new message</div>
            </div>
          </div>
        </div>
        <div className={styles.quickActionsSection}>
          <h2 className={styles.quickActionsTitle}>Quick Actions</h2>
          <div className={styles.quickActionsGrid}>
            <div className={styles.quickActionCard}>
              <i className="fas fa-book"></i>
              <div>
                <div className={styles.quickActionTitle}>Enroll Course</div>
                <div className={styles.quickActionDesc}>Join a new course</div>
                <button className={styles.quickActionBtn} onClick={() => setShowCourse(true)}>
                  Enroll
                </button>
              </div>
            </div>
            <div className={styles.quickActionCard}>
              <i className="fas fa-file-alt"></i>
              <div>
                <div className={styles.quickActionTitle}>Apply Exam</div>
                <div className={styles.quickActionDesc}>Attempt an exam</div>
                <button className={styles.quickActionBtn} onClick={() => setShowExam(true)}>
                  Apply
                </button>
              </div>
            </div>
          </div>
          {showCourse && (
            <Course onClose={() => setShowCourse(false)} />
          )}
          {showExam && (
            <Exam onClose={() => setShowExam(false)} />
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;