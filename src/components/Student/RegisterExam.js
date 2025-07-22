import { useEffect, useState } from 'react';
import DashboardLayout from '../Student/StudentLayout';
import './StudentDashboard.css'; // Corrected path
import api from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const RegisterExam = () => {
  const [tab, setTab] = useState('register');
  const [subTab, setSubTab] = useState('available');
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem('user_email');
    if (!email) {
      toast.error('Session expired. Please log in again.');
      navigate('/login');
      return;
    }
    const fetchExamsForStudent = async () => {
      setLoading(true);
      try {
        const userRes = await api.get('/admin/users');
        const loggedInEmail = localStorage.getItem('user_email');
        const userList = Array.isArray(userRes.data) ? userRes.data : [userRes.data];
        const user = userList.find(u => u.email === loggedInEmail);
        if (!user) { setExams([]); setLoading(false); return; }
        const studentRes = await api.get('/student/student-display');
        const studentList = Array.isArray(studentRes.data) ? studentRes.data : [studentRes.data];
        const student = studentList.find(s => s.user_info.id === user.id);
        const studentClassName = student?.user_info?.class_info?.class_name;
        const studentStreamName = student?.user_info?.class_info?.stream_info?.sname;
        const examsRes = await api.get('/exam/display');
        const allExams = Array.isArray(examsRes.data) ? examsRes.data : [examsRes.data];
        console.log('studentClassName:', studentClassName);
        console.log('studentStreamName:', studentStreamName);
        console.log('allExams:', allExams.map(e => e.e_name));
        console.log('ALL EXAMS:', allExams);
        if (allExams.length > 0) {
          console.log('FIRST EXAM OBJECT:', allExams[0]);
        }
        const studentClassId = student?.user_info?.class_info?.cls_id;
        const studentStreamId = student?.user_info?.class_info?.stream_info?.sid;
        const studentSubjectId = student?.user_info?.class_info?.subject_id || null;
        // Get subjects for this student's class and stream
        const subjectsRes = await api.get('/subject/subject-display');
        const studentSubjects = subjectsRes.data.filter(subject => {
          const subjectClassId = subject.stream_info?.class_info?.cls_id;
          const subjectStreamId = subject.stream_info?.sid;
          return String(subjectClassId) === String(studentClassId) && String(subjectStreamId) === String(studentStreamId);
        });
        const studentSubjectIds = studentSubjects.map(subject => String(subject.su_id));
        // Filter exams by subject ID
        const filtered = allExams.filter(exam => {
          const examSubjectId = String(exam.su_id);
          return studentSubjectIds.includes(examSubjectId);
        });
        setExams(filtered);
      } catch (err) {
        setExams([]);
      }
      setLoading(false);
    };
    fetchExamsForStudent();
  }, [subTab]);

  return (
    <DashboardLayout>
      <div className="stream-management">
        <h1 style={{ color: '#2563eb', fontWeight: 700, fontSize: '2.5rem', marginBottom: 0 }}>
          My Exams
        </h1>
        <p style={{ color: '#2563eb', marginTop: 0 }}>
          Enroll, take, and view results of your exams
        </p>
        <div className="stream-filters" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #eee' }}>
            {['register', 'completed'].map(t => (
              <button
                key={t}
                className="stream-tab-btn"
                style={{
                  border: 'none',
                  background: 'none',
                  color: tab === t ? '#2563eb' : '#444',
                  fontWeight: tab === t ? 600 : 400,
                  borderBottom: tab === t ? '2px solid #2563eb' : 'none',
                  padding: '1rem 0',
                  fontSize: '1.1rem',
                  cursor: 'pointer'
                }}
                onClick={() => setTab(t)}
              >
                {t === 'register' && 'Register for Exam'}
                {t === 'completed' && 'Completed'}
              </button>
            ))}
          </div>
        </div>
        {tab === 'register' && (
          <>
            <div style={{ display: 'flex', gap: '2rem', margin: '1rem 0' }}>
              <button
                className="stream-tab-btn"
                style={{
                  background: subTab === 'available' ? '#e8f0fe' : 'none',
                  color: subTab === 'available' ? '#2563eb' : '#444',
                  fontWeight: subTab === 'available' ? 600 : 400,
                  border: 'none',
                  padding: '0.7rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                onClick={() => setSubTab('available')}
              >
                Register for Available Exam
              </button>
              <button
                className="stream-tab-btn"
                style={{
                  background: subTab === 'upcoming' ? '#e8f0fe' : 'none',
                  color: subTab === 'upcoming' ? '#2563eb' : '#444',
                  fontWeight: subTab === 'upcoming' ? 600 : 400,
                  border: 'none',
                  padding: '0.7rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                onClick={() => setSubTab('upcoming')}
              >
                Register for Upcoming Exam
              </button>
            </div>
            <div className="stream-table-container" style={{ minHeight: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', boxShadow: 'none' }}>
              {loading ? (
                <p>Loading...</p>
              ) : exams.length === 0 ? (
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <div style={{ fontSize: 60, color: '#a0aec0', marginBottom: 10 }}>🗂️</div>
                  <div style={{ fontWeight: 600, fontSize: 20 }}>No Available Exams</div>
                  <div style={{ color: '#666', marginTop: 5 }}>There are no available exams at the moment</div>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: 28,
                  width: '100%',
                  justifyContent: 'center',
                  margin: '0 auto',
                  maxWidth: 900
                }}>
                  {exams.map(exam => (
                    <div key={exam.e_id} style={{
                      background: '#fff',
                      borderRadius: 18,
                      boxShadow: '0 2px 12px rgba(30,34,90,0.10)',
                      padding: '1.7rem 1.3rem',
                      minHeight: 210,
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '1.13rem', marginBottom: 6 }}>{exam.e_name}</div>
                      <span style={{ position: 'absolute', top: 18, right: 18, background: '#d1fae5', color: '#059669', borderRadius: 12, fontWeight: 600, fontSize: 13, padding: '2px 14px' }}>Available</span>
                      <div style={{ color: '#5b6b7a', fontSize: '0.98rem', margin: '10px 0 2px 0' }}><i className="fas fa-calendar-alt"></i> {exam.e_date}</div>
                      <div style={{ color: '#5b6b7a', fontSize: '0.98rem', marginBottom: 2 }}><i className="fas fa-clock"></i> {exam.e_time}</div>
                      <div style={{ color: '#6b7280', fontSize: '0.97rem', marginBottom: 2 }}><i className="fas fa-hourglass-half"></i> {exam.duration}</div>
                      <div style={{ color: '#6b7280', fontSize: '0.97rem', marginBottom: 2 }}><i className="fas fa-file-alt"></i> Template: {exam.t_name}</div>
                      <div style={{ color: '#6b7280', fontSize: '0.97rem', marginBottom: 2 }}><i className="fas fa-info-circle"></i> {exam.des}</div>
                      <button style={{
                        marginTop: 14,
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 999,
                        padding: '0.6em 1.7em',
                        fontWeight: 600,
                        fontSize: '1.05rem',
                        cursor: 'pointer',
                        boxShadow: '0 1px 4px rgba(30,34,90,0.06)',
                        transition: 'background 0.18s, color 0.18s'
                      }}
                      onClick={() => { setSelectedExam(exam); setDialogOpen(true); }}
                      >
                        Take Test
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {dialogOpen && selectedExam && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(30,34,90,0.18)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(30,34,90,0.18)',
            padding: '2.5rem 2.5rem 2.5rem 2.5rem',
            minWidth: 340,
            maxWidth: 420,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
            <button onClick={() => setDialogOpen(false)} style={{ position: 'absolute', top: 16, right: 18, background: 'none', border: 'none', fontSize: 22, color: '#aaa', cursor: 'pointer' }}>&times;</button>
            <h2 style={{ color: '#2563eb', fontWeight: 700, fontSize: '1.35rem', marginBottom: 8 }}>{selectedExam.e_name}</h2>
            <div style={{ color: '#5b6b7a', fontSize: '1.05rem', marginBottom: 10 }}>Please read the instructions carefully before starting the test.</div>
            <ul style={{ color: '#374151', fontSize: '1.01rem', marginBottom: 18, paddingLeft: 18 }}>
              <li><b>Date:</b> {selectedExam.e_date}</li>
              <li><b>Time:</b> {selectedExam.e_time}</li>
              <li><b>Duration:</b> {selectedExam.duration}</li>
              <li><b>Template:</b> {selectedExam.t_name}</li>
              <li><b>Description:</b> {selectedExam.des}</li>
              <li><b>Subject:</b> {selectedExam.su_name || 'N/A'}</li>
              <li><b>Instructions:</b> Ensure a stable internet connection. Do not refresh or close the browser during the test. All answers will be auto-submitted when time is up.</li>
            </ul>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <button
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.7em 2.2em',
                  fontWeight: 700,
                  fontSize: '1.08rem',
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(30,34,90,0.10)',
                  transition: 'background 0.18s, color 0.18s',
                }}
                onClick={() => { setDialogOpen(false); window.location.href = `/student/exam/take/${selectedExam.e_id}`; }}
              >
                Take Test
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RegisterExam; 