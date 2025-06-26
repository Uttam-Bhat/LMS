import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import { FaChevronRight, FaChevronDown, FaBookOpen, FaListAlt } from 'react-icons/fa';

const StudentLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [courseMenuOpen, setCourseMenuOpen] = useState(false);

  const handleLogout = () => {
    // Add logout logic here
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo">Student</h1>
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
              <Link to="/student" className={location.pathname === '/student' ? 'active' : ''}>
                <i className="fas fa-home"></i>
                <span>Dashboard</span>
              </Link>
              <div className={`menu-parent${courseMenuOpen ? ' open' : ''}`}> 
                <button className={`menu-toggle${courseMenuOpen ? ' active' : ''}`} onClick={() => setCourseMenuOpen(!courseMenuOpen)}>
                  <i className="fas fa-users"></i>
                  <span style={{marginLeft:8}}>Course</span>
                  {courseMenuOpen ? <FaChevronDown style={{marginLeft:'auto'}} /> : <FaChevronRight style={{marginLeft:'auto'}} />}
                </button>
                {courseMenuOpen && (
                  <div className="submenu">
                    <Link to="/student/available-courses" className={location.pathname === '/student/available-courses' ? 'active' : ''}>
                      <FaBookOpen style={{marginRight:6}} /> Available Courses
                    </Link>
                    <Link to="/student/my-courses" className={location.pathname === '/student/my-courses' ? 'active' : ''}>
                      <FaListAlt style={{marginRight:6}} /> My Courses
                    </Link>
                  </div>
                )}
              </div>
              <Link to="/student/exam" className={location.pathname === '/student/exam' ? 'active' : ''}>
                <i className="fas fa-chalkboard-teacher"></i>
                <span>Exam</span>
              </Link>
              <Link to="/student/notifications" className={location.pathname === '/student/notifications' ? 'active' : ''}>
                <i className="fa-solid fa-bell"></i>
                <span>Notifications</span>
              </Link>
              <Link to="/student/result" className={location.pathname === '/student/result' ? 'active' : ''}>
                <i className="fa-solid fa-square-poll-vertical"></i>
                <span>Result</span>
              </Link>
              <Link to="/student/Logout" className={location.pathname === '/student/Logout' ? 'active' : ''}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <span>Logout</span>
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

export default StudentLayout; 