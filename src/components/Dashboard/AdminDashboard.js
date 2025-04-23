import React from 'react';
import DashboardLayout from './DashboardLayout';
import './Dashboard.css';

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="dashboard-welcome">
        <h1>Welcome to LAMS Admin Dashboard</h1>
        <p>Manage your learning assessment system from here</p>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <i className="fas fa-users"></i>
            <div className="stat-content">
              <h3>Total Users</h3>
              <p>250</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-book"></i>
            <div className="stat-content">
              <h3>Active Courses</h3>
              <p>12</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-file-alt"></i>
            <div className="stat-content">
              <h3>Exams Created</h3>
              <p>45</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-chart-line"></i>
            <div className="stat-content">
              <h3>Results Processed</h3>
              <p>156</p>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-button">
              <i className="fas fa-plus"></i>
              Create New Course
            </button>
            <button className="action-button">
              <i className="fas fa-user-plus"></i>
              Add New User
            </button>
            <button className="action-button">
              <i className="fas fa-file-medical"></i>
              Create Exam
            </button>
            <button className="action-button">
              <i className="fas fa-chart-bar"></i>
              View Reports
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard; 