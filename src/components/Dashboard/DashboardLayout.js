import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Dashboard.css';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

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
                <button onClick={() => { setShowProfileModal(true); setIsProfileOpen(false); }}>
                  <i className="fas fa-user"></i> Profile
                </button>
                <button onClick={() => { setShowSettingsModal(true); setIsProfileOpen(false); }}>
                  <i className="fas fa-cog"></i> Settings
                </button>
                <button onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="create-course-modal">
            <div className="modal-header">
              <h2>Profile</h2>
              <button className="close-button" onClick={() => setShowProfileModal(false)}>×</button>
            </div>
            <div style={{ padding: '1rem 0' }}>
              <p>This is your profile information. (Customize as needed.)</p>
            </div>
          </div>
        </div>
      )}
      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay">
          <div className="create-course-modal">
            <div className="modal-header">
              <h2>Settings</h2>
              <button className="close-button" onClick={() => setShowSettingsModal(false)}>×</button>
            </div>
            <div style={{ padding: '1rem 0' }}>
              <p>Settings content goes here. (Customize as needed.)</p>
            </div>
          </div>
        </div>
      )}

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