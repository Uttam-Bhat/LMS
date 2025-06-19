import React from 'react';
import DashboardLayout from './DashboardLayout';
import './ExamManagement.css';

const ResultsPlaceholder = () => {
  // Sample admin data
  const adminStats = [
    { label: 'Total Exams', value: 45 },
    { label: 'Total Students', value: 360 },
    { label: 'Average Score', value: '78%' },
    { label: 'Pass Rate', value: '92%' },
  ];
  const recentResults = [
    { name: 'John Doe', exam: 'Math Final', score: '92%', status: 'Passed' },
    { name: 'Jane Smith', exam: 'Physics Midterm', score: '85%', status: 'Passed' },
    { name: 'Mike Johnson', exam: 'Chemistry Quiz', score: '68%', status: 'Failed' },
  ];

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
                <div key={stat.label} className="stat-card" style={{ minWidth: 180 }}>
                  <div className="stat-content">
                    <h3>{stat.label}</h3>
                    <p>{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="exam-section-card" style={{ marginTop: '2rem' }}>
            <div className="section-header">
              <h2>Recent Results</h2>
            </div>
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Exam</th>
                  <th>Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentResults.map((result, idx) => (
                  <tr key={idx}>
                    <td>{result.name}</td>
                    <td>{result.exam}</td>
                    <td>{result.score}</td>
                    <td>
                      <span className={`status-badge ${result.status === 'Passed' ? 'active' : 'draft'}`}>{result.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResultsPlaceholder; 