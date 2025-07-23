import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  FaAngleDown, FaHome, FaUsers, FaBook, FaChalkboardTeacher, FaUserGraduate, FaFileAlt,
  FaChartBar, FaStream, FaLayerGroup, FaListAlt, FaBookOpen, FaThList, FaFolderOpen, FaUserCircle, FaEnvelope
} from 'react-icons/fa';
import './Dashboard.css';
import { Toaster } from 'react-hot-toast';
import api from '../../services/authService';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(location.pathname.startsWith('/admin/users'));
  const [profilePhoto, setProfilePhoto] = useState(() => localStorage.getItem('admin_profile_photo'));

  useEffect(() => {
    // Try to get admin info from localStorage
    const userEmail = localStorage.getItem('user_email');
    if (!userEmail) return;
    api.get('/admin/users').then(userRes => {
      const userList = Array.isArray(userRes.data) ? userRes.data : [userRes.data];
      const adminObj = userList.find(u => u.email === userEmail && u.user_type === 'admin');
      if (adminObj) {
        api.get(`/profile/user/${adminObj.id}`).then(profileRes => {
          if (profileRes.data && profileRes.data.photo_url) {
            const backendUrl = 'http://localhost:3000';
            const newPhotoUrl = backendUrl + profileRes.data.photo_url + `?t=${Date.now()}`;
            setProfilePhoto(newPhotoUrl);
            localStorage.setItem('admin_profile_photo', newPhotoUrl);
          } else {
            setProfilePhoto(null);
            localStorage.removeItem('admin_profile_photo');
          }
        }).catch(() => { setProfilePhoto(null); localStorage.removeItem('admin_profile_photo'); });
      }
    }).catch(() => { setProfilePhoto(null); localStorage.removeItem('admin_profile_photo'); });

    // Listen for profile photo updates
    const handleProfilePhotoUpdated = () => {
      setProfilePhoto(localStorage.getItem('admin_profile_photo'));
    };
    window.addEventListener('profilePhotoUpdated', handleProfilePhotoUpdated);
    return () => {
      window.removeEventListener('profilePhotoUpdated', handleProfilePhotoUpdated);
    };
  }, []);

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
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="logo">LAMS</h1>
          </div>
          <div className="header-right">
            <div className="profile-dropdown">
              <button className="profile-button" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                {profilePhoto ? (
                  <img
                    src={profilePhoto + (profilePhoto.includes('?') ? `&t=${Date.now()}` : `?t=${Date.now()}`)}
                    alt="Profile"
                    style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563eb', background: '#fff' }}
                  />
                ) : (
                  <i className="fas fa-user-circle"></i>
                )}
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
                <div className={`menu-parent${userMenuOpen ? ' open' : ''}`}> 
                  <button className="menu-toggle" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                    <FaUsers style={{ marginRight: 8 }} />
                    <span>User Management</span>
                    <FaAngleDown className={`menu-arrow${userMenuOpen ? ' rotated' : ''}`} size={14} style={{ marginLeft: 'auto' }} />
                  </button>
                  {userMenuOpen && (
                    <div className="submenu">
                      <Link to="/admin/users/all" className={location.pathname === '/admin/users/all' ? 'active' : ''}><FaUserCircle /><span>All Users</span></Link>
                      <Link to="/admin/users/students" className={location.pathname === '/admin/users/students' ? 'active' : ''}><FaUserGraduate /><span>Students</span></Link>
                    </div>
                  )}
                </div>

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
                <Link to="/admin/send-message" className={location.pathname === '/admin/send-message' ? 'active' : ''}>
                  <FaEnvelope /><span>Send Notification</span>
                </Link>
              </div>
            </nav>
          </aside>

          {/* Pass setProfilePhoto to children if it's a valid React element */}
          <main className="dashboard-main">
            {React.isValidElement(children)
              ? React.cloneElement(children, { onProfilePhotoChange: setProfilePhoto })
              : children}
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
