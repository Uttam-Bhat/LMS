import React, { useEffect, useState } from 'react';
import StudentLayout from './StudentLayout';
import api from '../../services/authService';

const Result = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = window.innerWidth <= 900;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const studentId = localStorage.getItem('student_id');
        if (!studentId) return setLoading(false);
        const res = await api.get(`/exam-result/results/${studentId}`);
        setResults(Array.isArray(res.data) ? res.data : [res.data]);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <StudentLayout>
      <div style={{ 
        padding: isMobile ? '1rem 0.8rem' : '2.5rem 2rem', 
        background: '#f6f8fb', 
        minHeight: '100vh',
        width: isMobile ? '90vw' : 'auto',
        boxSizing: 'border-box',
        margin: isMobile ? '0 auto' : '0',
        display: isMobile ? 'flex' : 'block',
        flexDirection: isMobile ? 'column' : 'block',
        alignItems: isMobile ? 'center' : 'block'
      }}>
        <div style={{
          textAlign: isMobile ? 'center' : 'left',
          marginBottom: isMobile ? '1.5rem' : '2.2rem',
          width: isMobile ? '100%' : 'auto'
        }}>
          <h1 style={{ 
            fontSize: isMobile ? '1.5rem' : '2rem', 
            fontWeight: 700, 
            color: '#2563eb', 
            marginBottom: isMobile ? '0.5rem' : 0 
          }}>My Results</h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: isMobile ? '0.9rem' : '1.1rem', 
            marginBottom: 0 
          }}>See your exam performance and progress</p>
        </div>
        
        <div style={{ 
          background: '#fff', 
          borderRadius: isMobile ? 12 : 16, 
          boxShadow: '0 2px 16px #e0e7ef', 
          padding: isMobile ? '1rem 1rem' : '2rem 2.5rem', 
          minHeight: isMobile ? 180 : 220,
          width: isMobile ? '100%' : 'auto'
        }}>
          {loading ? (
            <div style={{ 
              color: '#2563eb', 
              fontWeight: 600, 
              fontSize: isMobile ? '1rem' : '1.1rem',
              textAlign: isMobile ? 'center' : 'left'
            }}>Loading results...</div>
          ) : results.length === 0 ? (
            <div style={{ 
              color: '#888', 
              fontWeight: 600, 
              fontSize: isMobile ? '1rem' : '1.1rem',
              textAlign: isMobile ? 'center' : 'left'
            }}>No results found.</div>
          ) : (
            <>
              {/* Desktop Table View */}
              {!isMobile && (
                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(30,34,90,0.04)' }}>
                  <thead>
                    <tr style={{ background: '#f8fafd' }}>
                      <th style={{ padding: '14px 10px', color: '#2563eb', fontWeight: 700, fontSize: '1.05rem', borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>Exam</th>
                      <th style={{ padding: '14px 10px', color: '#2563eb', fontWeight: 700, fontSize: '1.05rem', borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>Date</th>
                      <th style={{ padding: '14px 10px', color: '#2563eb', fontWeight: 700, fontSize: '1.05rem', borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>Score</th>
                      <th style={{ padding: '14px 10px', color: '#2563eb', fontWeight: 700, fontSize: '1.05rem', borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>Correct</th>
                      <th style={{ padding: '14px 10px', color: '#2563eb', fontWeight: 700, fontSize: '1.05rem', borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>Wrong</th>
                      <th style={{ padding: '14px 10px', color: '#2563eb', fontWeight: 700, fontSize: '1.05rem', borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, idx) => (
                      <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#f8fafd' }}>
                        <td style={{ padding: '14px 10px' }}>{r.e_name}</td>
                        <td style={{ padding: '14px 10px' }}>{r.e_date}</td>
                        <td style={{ padding: '14px 10px', fontWeight: 700 }}>{r.score}%</td>
                        <td style={{ padding: '14px 10px' }}>{r.correct_answers}</td>
                        <td style={{ padding: '14px 10px' }}>{r.wrong_answers}</td>
                        <td style={{ padding: '14px 10px' }}>
                          <span style={{ background: r.score >= 40 ? '#eafff3' : '#ffeaea', color: r.score >= 40 ? '#16a34a' : '#d32f2f', fontWeight: 600, borderRadius: 8, padding: '4px 14px' }}>
                            {r.score >= 40 ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Mobile Card View */}
              {isMobile && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  width: '100%',
                  alignItems: 'center'
                }}>
                  {results.map((r, idx) => (
                    <div key={idx} style={{
                      background: '#fff',
                      borderRadius: 16,
                      padding: '1.5rem 1rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      border: '1px solid #e5e7eb',
                      width: '100%',
                      maxWidth: '350px',
                      boxSizing: 'border-box'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '1rem'
                      }}>
                        <h3 style={{
                          margin: 0,
                          fontSize: '1.3rem',
                          fontWeight: 700,
                          color: '#1a1a1a',
                          lineHeight: '1.3',
                          flex: 1,
                          marginRight: '0.5rem'
                        }}>
                          {r.e_name}
                        </h3>
                        <span style={{ 
                          background: r.score >= 40 ? '#eafff3' : '#ffeaea', 
                          color: r.score >= 40 ? '#16a34a' : '#d32f2f', 
                          fontWeight: 700, 
                          borderRadius: 8, 
                          padding: '0.5rem 1rem',
                          fontSize: '0.9rem',
                          whiteSpace: 'nowrap'
                        }}>
                          {r.score >= 40 ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                        fontSize: '1rem',
                        color: '#6b7280'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, color: '#374151' }}>Date:</span>
                          <span style={{ fontWeight: 500 }}>{r.e_date}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, color: '#374151' }}>Score:</span>
                          <span style={{ fontWeight: 700, color: '#2563eb', fontSize: '1.1rem' }}>{r.score}%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, color: '#374151' }}>Correct:</span>
                          <span style={{ color: '#16a34a', fontWeight: 600, fontSize: '1.1rem' }}>{r.correct_answers}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, color: '#374151' }}>Wrong:</span>
                          <span style={{ color: '#d32f2f', fontWeight: 600, fontSize: '1.1rem' }}>{r.wrong_answers}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default Result;
