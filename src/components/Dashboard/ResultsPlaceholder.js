import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import './ExamManagement.css';

// Placeholder for chart (replace with Chart.js or similar if available)
const BarChartPlaceholder = ({ data, labels }) => (
  <div style={{ width: '100%', height: 220, background: '#f3f6fa', borderRadius: 12, display: 'flex', alignItems: 'flex-end', gap: 18, padding: 24, margin: '1.5rem 0' }}>
    {data.map((val, idx) => (
      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ height: `${val * 2}px`, width: 32, background: '#2563eb', borderRadius: 8, marginBottom: 8, transition: 'height 0.3s' }}></div>
        <div style={{ fontSize: 13, color: '#444', fontWeight: 600 }}>{labels[idx]}</div>
        <div style={{ fontSize: 12, color: '#888' }}>{val}%</div>
      </div>
    ))}
  </div>
);

const sampleStudents = [
  {
    name: 'John Doe',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=2563eb&color=fff&size=64',
    results: [
      { exam: 'Math Final', score: 92, status: 'Passed' },
      { exam: 'Physics Midterm', score: 85, status: 'Passed' },
    ],
  },
  {
    name: 'Jane Smith',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=2563eb&color=fff&size=64',
    results: [
      { exam: 'Chemistry Quiz', score: 68, status: 'Failed' },
      { exam: 'Math Final', score: 74, status: 'Passed' },
    ],
  },
  {
    name: 'Mike Johnson',
    avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=2563eb&color=fff&size=64',
    results: [
      { exam: 'Physics Midterm', score: 55, status: 'Failed' },
    ],
  },
];

const adminStats = [
  { label: 'Total Exams', value: 45 },
  { label: 'Total Students', value: 360 },
  { label: 'Average Score', value: '78%' },
  { label: 'Pass Rate', value: '92%' },
];

const ResultsPlaceholder = () => {
  const [expanded, setExpanded] = useState(null);
  // For bar chart: average score per exam
  const chartLabels = ['Math Final', 'Physics Midterm', 'Chemistry Quiz'];
  const chartData = [83, 70, 68];

  return (
    <DashboardLayout>
      <div className="exam-management">
        <div className="page-header">
          <h1>Results & Reports (Admin)</h1>
        </div>
        <div className="exam-sections">
          <div className="exam-section-card">
            <div className="section-header">
              <h2>Summary</h2>
            </div>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {adminStats.map(stat => (
                <div key={stat.label} className="stat-card" style={{ minWidth: 180, background: '#f3f6fa', borderRadius: 12, boxShadow: '0 2px 8px #e0e7ef' }}>
                  <div className="stat-content">
                    <h3 style={{ color: '#2563eb', fontWeight: 700 }}>{stat.label}</h3>
                    <p style={{ fontSize: 22, fontWeight: 700 }}>{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <BarChartPlaceholder data={chartData} labels={chartLabels} />
          </div>
          <div className="exam-section-card" style={{ marginTop: '2rem' }}>
            <div className="section-header">
              <h2>Student Results</h2>
            </div>
            <div style={{ margin: '1.5rem 0', borderRadius: 12, background: '#f8fafc', boxShadow: '0 2px 8px #e0e7ef', padding: '1.5rem 2rem' }}>
              {sampleStudents.map((student, idx) => (
                <div key={idx} style={{ marginBottom: 18, borderBottom: '1px solid #e5e7eb', paddingBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    <img src={student.avatar} alt={student.name} style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #2563eb' }} />
                    <div style={{ fontWeight: 700, fontSize: '1.13rem', color: '#2563eb' }}>{student.name}</div>
                    <button
                      style={{ marginLeft: 'auto', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '0.4em 1.2em', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}
                      onClick={() => setExpanded(expanded === idx ? null : idx)}
                    >
                      {expanded === idx ? 'Hide Results' : 'Show Results'}
                    </button>
                  </div>
                  {expanded === idx && (
                    <div style={{ marginTop: 16 }}>
                      <table className="users-table" style={{ background: '#fff', borderRadius: 8 }}>
                        <thead>
                          <tr>
                            <th>Exam</th>
                            <th>Score</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {student.results.map((result, i) => (
                            <tr key={i}>
                              <td>{result.exam}</td>
                              <td style={{ fontWeight: 700 }}>{result.score}%</td>
                              <td>
                                <span className={`status-badge ${result.status === 'Passed' ? 'active' : 'draft'}`}>{result.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResultsPlaceholder; 