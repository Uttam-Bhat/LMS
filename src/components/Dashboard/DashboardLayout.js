import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  FaAngleDown, FaHome, FaUsers, FaBook, FaChalkboardTeacher, FaUserGraduate, FaFileAlt,
  FaChartBar, FaStream, FaLayerGroup, FaListAlt, FaBookOpen, FaThList, FaFolderOpen
} from 'react-icons/fa';
import './Dashboard.css';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const submenuPaths = ['/admin/courses', '/admin/classes', '/admin/stream', '/admin/subjects', '/admin/chapters', '/admin/content'];
  const [menuOpen, setMenuOpen] = useState(submenuPaths.includes(location.pathname));

  const handleLogout = () => {
    navigate('/');
  };

  const mockAdmin = {
    username: 'adminuser',
    email: 'admin@example.com',
    profilePhoto: '',
    password: '********',
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo">LAMS</h1>
        </div>
        <div className="header-right">
          <div className="profile-dropdown">
            <button className="profile-button" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <i className="fas fa-user-circle"></i>
            </button>
            {isProfileOpen && (
              <div className="dropdown-menu">
                <button onClick={() => { navigate('/admin/profile'); setIsProfileOpen(false); }}>Profile</button>
                <button onClick={() => { navigate('/admin/settings'); setIsProfileOpen(false); }}>Settings</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <div className="nav-section">
              <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                <FaHome /><span>Dashboard</span>
              </Link>
              <Link to="/admin/users" className={location.pathname === '/admin/users' ? 'active' : ''}>
                <FaUsers /><span>User Management</span>
              </Link>

              <div className={`menu-parent${menuOpen ? ' open' : ''}`}> 
                <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                  <FaLayerGroup style={{ marginRight: 8 }} />
                  <span>Menu</span>
                  <FaAngleDown className={`menu-arrow${menuOpen ? ' rotated' : ''}`} size={14} style={{ marginLeft: 'auto' }} />
                </button>

                {menuOpen && (
                  <div className="submenu">
                    <Link to="/admin/courses" className={location.pathname.includes('/admin/courses') ? 'active' : ''}><FaBook /><span>Courses</span></Link>
                    <Link to="/admin/classes" className={location.pathname.includes('/admin/classes') ? 'active' : ''}><FaChalkboardTeacher /><span>Classes</span></Link>
                    <Link to="/admin/stream" className={location.pathname.includes('/admin/stream') ? 'active' : ''}><FaStream /><span>Stream</span></Link>
                    <Link to="/admin/subjects" className={location.pathname.includes('/admin/subjects') ? 'active' : ''}><FaBookOpen /><span>Subjects</span></Link>
                    <Link to="/admin/chapters" className={location.pathname.includes('/admin/chapters') ? 'active' : ''}><FaListAlt /><span>Chapters</span></Link>
                    <Link to="/admin/content" className={location.pathname.includes('/admin/content') ? 'active' : ''}><FaFolderOpen /><span>Content</span></Link>
                  </div>
                )}
              </div>

              <Link to="/admin/exams" className={location.pathname === '/admin/exams' ? 'active' : ''}>
                <FaFileAlt /><span>Exams</span>
              </Link>
              <Link to="/admin/results" className={location.pathname === '/admin/results' ? 'active' : ''}>
                <FaChartBar /><span>Results</span>
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
