import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      <div style={{padding: '2.5rem 2rem', background: '#f6f8fb', minHeight: '100vh'}}>
        <h1 style={{fontSize: '2rem', fontWeight: 700, color: '#377dff', marginBottom: 0}}>Welcome back, demo student!</h1>
        <p style={{color: '#5b6b7a', fontSize: '1.1rem', marginBottom: '2.2rem'}}>Here's what's happening with your learning journey</p>
        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap'}}>
          <div style={{background: '#eef5ff', borderRadius: '16px', padding: '1.2rem 2.2rem', minWidth: 180, flex: 1}}>
            <div style={{color: '#377dff', fontWeight: 600, marginBottom: 4}}>Enrolled Courses</div>
            <div style={{fontSize: '2rem', fontWeight: 700}}>0</div>
            <div style={{display: 'flex', alignItems: 'center', marginTop: 6}}><span style={{marginLeft: 4}}><i className="fas fa-book-open"></i></span></div>
          </div>
          <div style={{background: '#eafff3', borderRadius: '16px', padding: '1.2rem 2.2rem', minWidth: 180, flex: 1}}>
            <div style={{color: '#1dbf73', fontWeight: 600, marginBottom: 4}}>Average Score</div>
            <div style={{fontSize: '2rem', fontWeight: 700}}>0%</div>
            <div style={{display: 'flex', alignItems: 'center', marginTop: 6}}><span style={{marginLeft: 4}}><i className="fas fa-signal"></i></span></div>
          </div>
          <div style={{background: '#f7f3ff', borderRadius: '16px', padding: '1.2rem 2.2rem', minWidth: 180, flex: 1}}>
            <div style={{color: '#a259ff', fontWeight: 600, marginBottom: 4}}>Completed Exams</div>
            <div style={{fontSize: '2rem', fontWeight: 700}}>0</div>
            <div style={{display: 'flex', alignItems: 'center', marginTop: 6}}><span style={{marginLeft: 4}}><i className="fas fa-clipboard-list"></i></span></div>
          </div>
          <div style={{background: '#fff8e1', borderRadius: '16px', padding: '1.2rem 2.2rem', minWidth: 180, flex: 1}}>
            <div style={{color: '#ffb300', fontWeight: 600, marginBottom: 4}}>Passed Exams</div>
            <div style={{fontSize: '2rem', fontWeight: 700}}>0</div>
            <div style={{display: 'flex', alignItems: 'center', marginTop: 6}}><span style={{marginLeft: 4}}><i className="fas fa-check-circle"></i></span></div>
          </div>
        </div>
        <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap'}}>
          <div style={{background: '#fff', borderRadius: '12px', flex: 1, minWidth: 340, padding: '2.2rem 1.5rem', boxShadow: '0 2px 8px rgba(30,34,90,0.06)'}}>
            <div style={{fontWeight: 600, fontSize: '1.18rem', marginBottom: 8}}>Recent Content</div>
            <div style={{color: '#6b7a90', fontSize: '0.98rem', marginBottom: 16}}>Latest learning materials</div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 120}}>
              <span style={{fontSize: '2.5rem', color: '#b0b8c1', marginBottom: 8}}>+</span>
              <div style={{fontWeight: 600, color: '#222'}}>No content available</div>
              <div style={{color: '#6b7a90', fontSize: '0.98rem'}}>Check back later for new content.</div>
            </div>
          </div>
          <div style={{background: '#fff', borderRadius: '12px', flex: 1, minWidth: 340, padding: '2.2rem 1.5rem', boxShadow: '0 2px 8px rgba(30,34,90,0.06)'}}>
            <div style={{fontWeight: 600, fontSize: '1.18rem', marginBottom: 8}}>Upcoming Exams</div>
            <div style={{color: '#6b7a90', fontSize: '0.98rem', marginBottom: 16}}>Your next scheduled examinations</div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 120}}>
              <span style={{fontSize: '2.5rem', color: '#b0b8c1', marginBottom: 8}}><i className="fas fa-calendar-alt"></i></span>
              <div style={{fontWeight: 600, color: '#222'}}>No upcoming exams</div>
              <div style={{color: '#6b7a90', fontSize: '0.98rem'}}>Check back later for scheduled exams.</div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;