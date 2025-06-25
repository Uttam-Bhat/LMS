import React, { useState, useEffect } from 'react';
import { FaTimes, FaChartLine, FaUsers, FaGraduationCap, FaClock } from 'react-icons/fa';
import './CreateCourseModal.css';

const CourseReportModal = ({ onClose, course }) => {
  const [reportData, setReportData] = useState({
    totalStudents: 45,
    activeStudents: 38,
    completedStudents: 7,
    averageScore: 78.5,
    completionRate: 84.4,
    averageTimeSpent: '2.5 hours',
    recentActivity: [
      { date: '2024-01-15', activity: 'New student enrolled', count: 3 },
      { date: '2024-01-14', activity: 'Assignment submitted', count: 12 },
      { date: '2024-01-13', activity: 'Quiz completed', count: 8 },
      { date: '2024-01-12', activity: 'Video watched', count: 25 },
    ],
    topPerformers: [
      { name: 'Sarah Williams', score: 95, rank: 1 },
      { name: 'Mike Johnson', score: 92, rank: 2 },
      { name: 'David Brown', score: 89, rank: 3 },
      { name: 'Emily Davis', score: 87, rank: 4 },
      { name: 'James Wilson', score: 85, rank: 5 },
    ]
  });

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return '#2e7d32';
    if (percentage >= 60) return '#ef6c00';
    return '#f21818';
  };

  return (
    <div className="modal-overlay">
      <div className="create-course-modal" style={{ maxWidth: '900px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h2>Course Analysis Report</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div style={{ padding: '1rem 0' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#1877f2', borderBottom: '2px solid #e1e1e1', paddingBottom: '0.5rem' }}>
            {course?.name || 'Unknown Course'}
          </h3>

          {/* Key Metrics */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem', 
            marginBottom: '2rem' 
          }}>
            <div style={{
              background: '#e7f0fe',
              padding: '1rem',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <FaUsers style={{ fontSize: '2rem', color: '#1877f2', marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1877f2' }}>
                {reportData.totalStudents}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Students</div>
            </div>

            <div style={{
              background: '#e8f5e9',
              padding: '1rem',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <FaGraduationCap style={{ fontSize: '2rem', color: '#2e7d32', marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2e7d32' }}>
                {reportData.completionRate}%
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Completion Rate</div>
            </div>

            <div style={{
              background: '#fff3e0',
              padding: '1rem',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <FaChartLine style={{ fontSize: '2rem', color: '#ef6c00', marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef6c00' }}>
                {reportData.averageScore}%
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Average Score</div>
            </div>

            <div style={{
              background: '#f3e5f5',
              padding: '1rem',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <FaClock style={{ fontSize: '2rem', color: '#8e24aa', marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8e24aa' }}>
                {reportData.averageTimeSpent}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Avg. Time Spent</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Recent Activity */}
            <div>
              <h4 style={{ marginBottom: '1rem', color: '#333', borderBottom: '1px solid #e1e1e1', paddingBottom: '0.5rem' }}>
                Recent Activity
              </h4>
              <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {reportData.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #e1e1e1',
                      borderRadius: '6px',
                      marginBottom: '0.5rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <div style={{ fontWeight: '500', color: '#1a1a1a' }}>
                      {activity.activity}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      {activity.date} • {activity.count} students
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performers */}
            <div>
              <h4 style={{ marginBottom: '1rem', color: '#333', borderBottom: '1px solid #e1e1e1', paddingBottom: '0.5rem' }}>
                Top Performers
              </h4>
              <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {reportData.topPerformers.map((performer, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #e1e1e1',
                      borderRadius: '6px',
                      marginBottom: '0.5rem',
                      backgroundColor: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '500', color: '#1a1a1a' }}>
                        #{performer.rank} {performer.name}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        Score: {performer.score}%
                      </div>
                    </div>
                    <div style={{
                      background: index < 3 ? '#ffd700' : '#e1e1e1',
                      color: index < 3 ? '#333' : '#666',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {index < 3 ? '🏆' : '#'}{performer.rank}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Chart */}
          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#333', borderBottom: '1px solid #e1e1e1', paddingBottom: '0.5rem' }}>
              Course Progress Overview
            </h4>
            <div style={{
              background: 'white',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #e1e1e1'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontWeight: '500' }}>Overall Progress</span>
                <span style={{ fontWeight: 'bold', color: getProgressColor(reportData.completionRate) }}>
                  {reportData.completionRate}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '20px',
                backgroundColor: '#f0f0f0',
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${reportData.completionRate}%`,
                  height: '100%',
                  backgroundColor: getProgressColor(reportData.completionRate),
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginTop: '0.5rem',
                fontSize: '0.85rem',
                color: '#666'
              }}>
                <span>Active: {reportData.activeStudents}</span>
                <span>Completed: {reportData.completedStudents}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Close
          </button>
          <button type="button" className="create-btn" style={{ background: '#2e7d32' }}>
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseReportModal; 