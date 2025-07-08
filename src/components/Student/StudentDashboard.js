import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Exam from './Exam';
import StudentLayout from './StudentLayout';
import styles from './StudentDashboard.module.css';
import axios from 'axios';

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
  const [upcomingExams, setUpcomingExams] = useState([]);

  useEffect(() => {
    const fetchExamsForStudent = async () => {
      try {
        const userRes = await axios.get('http://localhost:3000/api/admin/users');
        const loggedInEmail = localStorage.getItem('user_email');
        const userList = Array.isArray(userRes.data) ? userRes.data : [userRes.data];
        const user = userList.find(u => u.email === loggedInEmail);
        if (!user) { setUpcomingExams([]); return; }
        const studentRes = await axios.get('http://localhost:3000/api/student/student-display');
        const studentList = Array.isArray(studentRes.data) ? studentRes.data : [studentRes.data];
        const student = studentList.find(s => s.user_info.id === user.id);
        const studentClassName = student?.user_info?.class_info?.class_name;
        const studentStreamName = student?.user_info?.class_info?.stream_info?.sname;
        const examsRes = await axios.get('http://localhost:3000/api/exam/display');
        const allExams = Array.isArray(examsRes.data) ? examsRes.data : [examsRes.data];
        console.log('studentClassName:', studentClassName);
        console.log('studentStreamName:', studentStreamName);
        console.log('allExams:', allExams.map(e => e.e_name));
        const normalize = str => (str || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
        const filtered = allExams.filter(
          exam =>
            exam.e_name &&
            normalize(exam.e_name).includes(normalize(studentClassName)) &&
            normalize(exam.e_name).includes(normalize(studentStreamName))
        );
        setUpcomingExams(filtered);
      } catch (err) {
        setUpcomingExams([]);
      }
    };
    fetchExamsForStudent();
  }, []);

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
          <div className="student-dashboard-upcoming-box" style={{ background: 'none', boxShadow: 'none', padding: 0, maxWidth: '100%', margin: '0 auto 32px auto', textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '1.35rem', marginBottom: 4, color: '#222' }}>Upcoming Exams</div>
            <div style={{ color: '#6b7280', fontSize: '1.08rem', marginBottom: 18 }}>Your next scheduled examinations</div>
            {upcomingExams.length === 0 ? (
              <>
                <div style={{ fontSize: 54, color: '#b0b7c3', marginBottom: 10 }}>
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div style={{ fontWeight: 600, fontSize: 20 }}>No upcoming exams</div>
                <div style={{ color: '#6b7280', marginTop: 5 }}>Check back later for scheduled exams.</div>
              </>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 24,
                justifyContent: 'center',
                margin: '0 auto',
                maxWidth: 500
              }}>
                {upcomingExams.map(exam => (
                  <div key={exam.e_id} style={{
                    background: '#fff',
                    borderRadius: 18,
                    boxShadow: '0 2px 12px rgba(30,34,90,0.10)',
                    padding: '1.5rem 1.1rem',
                    minHeight: 180,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    aspectRatio: '1 / 1',
                    position: 'relative'
                  }}>
                    <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '1.08rem', marginBottom: 6 }}>{exam.e_name}</div>
                    <span style={{ position: 'absolute', top: 16, right: 16, background: '#d1fae5', color: '#059669', borderRadius: 12, fontWeight: 600, fontSize: 13, padding: '2px 14px' }}>Upcoming</span>
                    <div style={{ color: '#5b6b7a', fontSize: '0.98rem', margin: '10px 0 2px 0' }}>{exam.e_date} &bull; {exam.e_time}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.97rem', marginBottom: 2 }}>Duration: {exam.duration}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.97rem', marginBottom: 2 }}>Template: {exam.t_name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;