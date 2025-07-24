import React from 'react';
import './CreateCourseModal.css';
import { MultiPieChart } from './ResultsPlaceholder';

const PieChart = ({ value = 0, label = '' }) => {
  const radius = 40;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = Math.max(0, Math.min(100, value));
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 12 }}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e7f0fe"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#2563eb"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.3em"
          fontSize="1.1em"
          fontWeight="bold"
          fill="#2563eb"
        >
          {value.toFixed(1)}%
        </text>
      </svg>
      <div style={{ marginTop: 8, fontWeight: 600, color: '#2563eb', textAlign: 'center' }}>{label}</div>
    </div>
  );
};

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
            <h3 style={{ color: '#2563eb', marginBottom: 16 }}>Results Distribution Per Exam</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <MultiPieChart data={chartData} labels={chartLabels} />
            </div>
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