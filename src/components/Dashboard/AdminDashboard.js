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

        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <div className="quick-action-card">
              <div className="quick-action-icon">
                <i className="fas fa-plus-circle"></i>
              </div>
              <h3>Create Course</h3>
              <p>Add a new course to the system</p>
              <button className="quick-action-btn">Create Now</button>
            </div>
            <div className="quick-action-card">
              <div className="quick-action-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <h3>Add User</h3>
              <p>Register a new user account</p>
              <button className="quick-action-btn">Add User</button>
            </div>
            <div className="quick-action-card">
              <div className="quick-action-icon">
                <i className="fas fa-file-medical"></i>
              </div>
              <h3>Create Exam</h3>
              <p>Create a new examination</p>
              <button className="quick-action-btn">Create Exam</button>
            </div>
            <div className="quick-action-card">
              <div className="quick-action-icon">
                <i className="fas fa-chart-bar"></i>
              </div>
              <h3>View Reports</h3>
              <p>Access detailed analytics</p>
              <button className="quick-action-btn">View Reports</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard; 