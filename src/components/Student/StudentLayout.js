import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import { FaChevronRight, FaChevronDown, FaBookOpen, FaListAlt, FaBook, FaBell, FaChalkboardTeacher, FaChartBar, FaFolderOpen } from 'react-icons/fa';

const StudentLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [courseMenuOpen, setCourseMenuOpen] = useState(location.pathname.startsWith('/student/available-courses') || location.pathname.startsWith('/student/my-courses'));

  const handleLogout = () => {
    // Add logout logic here
    navigate('/');
  };

  // Close course menu when another main nav is clicked
  const handleMainNavClick = (nav) => {
    if (nav !== 'course') setCourseMenuOpen(false);
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
                <button onClick={() => { navigate('/student/profile'); setIsProfileOpen(false); }}>
                  <i className="fas fa-user"></i> Profile
                </button>
                <button onClick={() => { navigate('/student/settings'); setIsProfileOpen(false); }}>
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

      {/* Sidebar and Main Content */}
      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <div className="nav-section">
              <Link to="/student" className={location.pathname === '/student' ? 'active' : ''} onClick={() => handleMainNavClick('dashboard')}>
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
              <Link to="/student/materials" className={location.pathname === '/student/materials' ? 'active' : ''} onClick={() => handleMainNavClick('materials')}>
                <FaFolderOpen style={{marginRight:6}} />
                <span>Materials</span>
              </Link>
              <Link to="/student/exam" className={location.pathname === '/student/exam' ? 'active' : ''} onClick={() => handleMainNavClick('exam')}>
                <FaChalkboardTeacher style={{marginRight:6}} />
                <span>Exam</span>
              </Link>
              <Link to="/student/notifications" className={location.pathname === '/student/notifications' ? 'active' : ''} onClick={() => handleMainNavClick('notifications')}>
                <FaBell style={{marginRight:6}} />
                <span>Notifications</span>
              </Link>
              <Link to="/student/result" className={location.pathname === '/student/result' ? 'active' : ''} onClick={() => handleMainNavClick('result')}>
                <FaChartBar style={{marginRight:6}} />
                <span>Result</span>
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