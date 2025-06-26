import { useEffect, useState } from 'react';
import DashboardLayout from '../Student/StudentLayout';
import './StudentDashboard.css'; // Corrected path

const RegisterExam = () => {
  const [tab, setTab] = useState('register');
  const [subTab, setSubTab] = useState('available');
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch available exams here (replace with real API call)
    setLoading(false);
    setExams([]); // Replace with fetched data
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
            {['register', 'upcoming', 'inprogress', 'completed'].map(t => (
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
                {t === 'upcoming' && 'Upcoming'}
                {t === 'inprogress' && 'In Progress'}
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
            <div className="stream-table-container" style={{ minHeight: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {loading ? (
                <p>Loading...</p>
              ) : exams.length === 0 ? (
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <div style={{ fontSize: 60, color: '#a0aec0', marginBottom: 10 }}>🗂️</div>
                  <div style={{ fontWeight: 600, fontSize: 20 }}>No Available Exams</div>
                  <div style={{ color: '#666', marginTop: 5 }}>There are no available exams at the moment</div>
                </div>
              ) : (
                // Render exams table here
                <table className="stream-table">
                  {/* ... */}
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RegisterExam; 