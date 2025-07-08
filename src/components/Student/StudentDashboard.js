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
        <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          {/* Recent Content Card */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(30,34,90,0.07)',
            padding: '2.5rem 2vw',
            marginBottom: '1.5rem',
            width: '100%',
            maxWidth: '100%',
            minHeight: 220,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            boxSizing: 'border-box',
          }}>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#2563eb', marginBottom: 6 }}>Recent Content</div>
            <div style={{ color: '#6b7a90', fontSize: '1.05rem', marginBottom: 16 }}>Latest learning materials</div>
            <div style={{ fontWeight: 600, color: '#222', fontSize: '1.08rem', marginBottom: 6 }}>No content available</div>
            <div style={{ color: '#6b7a90', fontSize: '1rem' }}>Check back later for new content.</div>
          </div>
          {/* Upcoming Exams Card */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(30,34,90,0.07)',
            padding: '2.5rem 2vw',
            marginBottom: '1.5rem',
            width: '100%',
            maxWidth: '100%',
            minHeight: 220,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            boxSizing: 'border-box',
          }}>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#059669', marginBottom: 6 }}>Upcoming Exams</div>
            <div style={{ color: '#6b7280', fontSize: '1.05rem', marginBottom: 18 }}>Your next scheduled examinations</div>
            {upcomingExams.length === 0 ? (
              <div style={{ color: '#6b7280', fontSize: '1rem', marginTop: 12 }}>No upcoming exams. Check back later for scheduled exams.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%' }}>
                {upcomingExams.map((exam) => (
                  <div key={exam.e_id} style={{
                    background: '#f8fafc',
                    borderRadius: 10,
                    boxShadow: '0 1px 4px rgba(30,34,90,0.04)',
                    padding: '1.5rem 2vw',
                    width: '100%',
                    maxWidth: '100%',
                    minHeight: 120,
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    boxSizing: 'border-box',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '1.08rem', marginBottom: 6 }}>{exam.e_name}</div>
                      <div style={{ color: '#374151', fontSize: '1.01rem', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <i className="far fa-calendar-alt" style={{ marginRight: 4 }}></i> {exam.e_date}
                        <i className="far fa-clock" style={{ margin: '0 4px' }}></i> {exam.e_time}
                        <span style={{ marginLeft: 14 }}><i className="fas fa-hourglass-half" style={{ marginRight: 4 }}></i> {exam.duration}</span>
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '0.99rem', marginTop: 6 }}>Template: {exam.t_name}</div>
                    </div>
                    <span style={{
                      background: '#d1fae5',
                      color: '#059669',
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 14,
                      padding: '4px 18px',
                      marginLeft: 18,
                    }}>Upcoming</span>
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