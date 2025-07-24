import React, { useEffect, useState } from 'react';
import StudentLayout from './StudentLayout';
import api from '../../services/authService';

const Result = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div style={{ padding: '2.5rem 2rem', background: '#f6f8fb', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#2563eb', marginBottom: 0 }}>My Results</h1>
        <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '2.2rem' }}>See your exam performance and progress</p>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #e0e7ef', padding: '2rem 2.5rem', minHeight: 220 }}>
          {loading ? (
            <div style={{ color: '#2563eb', fontWeight: 600, fontSize: '1.1rem' }}>Loading results...</div>
          ) : results.length === 0 ? (
            <div style={{ color: '#888', fontWeight: 600, fontSize: '1.1rem' }}>No results found.</div>
          ) : (
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
        </div>
      </div>
    </StudentLayout>
  );
};

export default Result;
