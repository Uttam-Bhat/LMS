import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaAngleDown, FaHome, FaUsers, FaBook, FaChalkboardTeacher, FaUserGraduate, FaFileAlt, FaChartBar, FaStream, FaLayerGroup, FaListAlt, FaBookOpen, FaThList, FaFolderOpen } from 'react-icons/fa';
import './Dashboard.css';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
                <FaHome />
                <span>Dashboard</span>
              </Link>
              <Link to="/admin/users" className={location.pathname === '/admin/users' ? 'active' : ''}>
                <FaUsers />
                <span>User Management</span>
              </Link>
              <div className={`menu-parent${menuOpen ? ' open' : ''}`}> 
                <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                  <FaLayerGroup style={{ marginRight: 8 }} />
                  <span>Menu</span>
                  <FaAngleDown className={`menu-arrow${menuOpen ? ' rotated' : ''}`} size={14} style={{ marginLeft: 'auto' }} />
                </button>
                {menuOpen && (
                  <div className="submenu">
                    <Link to="/admin/courses" className={location.pathname === '/admin/courses' ? 'active' : ''}>
                      <FaBook /> <span>Courses</span>
                    </Link>
                    <Link to="/admin/classes" className={location.pathname === '/admin/classes' ? 'active' : ''}>
                      <FaChalkboardTeacher /> <span>Classes</span>
                    </Link>
                    <Link to="/admin/stream" className={location.pathname === '/admin/stream' ? 'active' : ''}>
                      <FaStream /> <span>Stream</span>
                    </Link>
                    <Link to="/admin/subjects" className={location.pathname === '/admin/subjects' ? 'active' : ''}>
                      <FaBookOpen /> <span>Subjects</span>
                    </Link>
                    <Link to="/admin/chapters" className={location.pathname === '/admin/chapters' ? 'active' : ''}>
                      <FaListAlt /> <span>Chapters</span>
                    </Link>
                    <Link to="/admin/content" className={location.pathname === '/admin/content' ? 'active' : ''}>
                      <FaFolderOpen /> <span>Content</span>
                    </Link>
                  </div>
                )}
              </div>
              <Link to="/admin/exams" className={location.pathname === '/admin/exams' ? 'active' : ''}>
                <FaFileAlt />
                <span>Exams</span>
              </Link>
              <Link to="/admin/results" className={location.pathname === '/admin/results' ? 'active' : ''}>
                <FaChartBar />
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