import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Dashboard.css';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    // Add logout logic here
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo">LAMS</h1>
        </div>
        <div className="header-right">
          <div className="profile-dropdown">
            <button 
              className="profile-button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <i className="fas fa-user-circle"></i>
            </button>
            {isProfileOpen && (
              <div className="dropdown-menu">
                <a href="#profile">
                  <i className="fas fa-user"></i> Profile
                </a>
                <a href="#settings">
                  <i className="fas fa-cog"></i> Settings
                </a>
                <button onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <div className="nav-section">
              <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                <i className="fas fa-home"></i>
                <span>Dashboard</span>
              </Link>
              <Link to="/admin/users" className={location.pathname === '/admin/users' ? 'active' : ''}>
                <i className="fas fa-users"></i>
                <span>User Management</span>
              </Link>
              <Link to="/admin/teachers" className={location.pathname === '/admin/teachers' ? 'active' : ''}>
                <i className="fas fa-chalkboard-teacher"></i>
                <span>Teachers</span>
              </Link>
              <Link to="/admin/students" className={location.pathname === '/admin/students' ? 'active' : ''}>
                <i className="fas fa-user-graduate"></i>
                <span>Students</span>
              </Link>
              <Link to="/admin/courses" className={location.pathname === '/admin/courses' ? 'active' : ''}>
                <i className="fas fa-book"></i>
                <span>Courses</span>
              </Link>
              <Link to="/admin/exams" className={location.pathname === '/admin/exams' ? 'active' : ''}>
                <i className="fas fa-file-alt"></i>
                <span>Exams</span>
              </Link>
              <Link to="/admin/results" className={location.pathname === '/admin/results' ? 'active' : ''}>
                <i className="fas fa-chart-bar"></i>
                <span>Results</span>
              </Link>
            </div>
          </nav>
        </aside>

        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 