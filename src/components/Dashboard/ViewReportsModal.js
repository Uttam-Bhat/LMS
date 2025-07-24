import React from 'react';
import './CreateCourseModal.css';
import { BarChartPlaceholder } from './ResultsPlaceholder';

const ViewReportsModal = ({ onClose, chartData = [], chartLabels = [] }) => (
  <div className="modal-overlay">
    <div className="create-course-modal">
      <div className="modal-header">
        <h2>View Reports</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div style={{ padding: '1rem 0' }}>
        {chartData.length > 0 && chartLabels.length > 0 ? (
          <>
            <h3 style={{ color: '#2563eb', marginBottom: 16 }}>Average Score Per Exam</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f9fafb', borderRadius: 8 }}>
              <thead>
                <tr style={{ background: '#e7f0fe' }}>
                  <th style={{ padding: '0.7rem 1rem', textAlign: 'left', color: '#2563eb', fontWeight: 700 }}>Exam Name</th>
                  <th style={{ padding: '0.7rem 1rem', textAlign: 'left', color: '#2563eb', fontWeight: 700 }}>Average Score (%)</th>
                </tr>
              </thead>
              <tbody>
                {chartLabels.map((label, idx) => (
                  <tr key={label}>
                    <td style={{ padding: '0.7rem 1rem', borderBottom: '1px solid #e5e7eb' }}>{label}</td>
                    <td style={{ padding: '0.7rem 1rem', borderBottom: '1px solid #e5e7eb', fontWeight: 600 }}>{chartData[idx].toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>No analytics data available.</p>
        )}
      </div>
      <div className="modal-footer">
        <button type="button" className="cancel-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
);

export default ViewReportsModal; 