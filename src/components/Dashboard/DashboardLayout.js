import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  FaAngleDown, FaHome, FaUsers, FaBook, FaChalkboardTeacher, FaUserGraduate, FaFileAlt,
  FaChartBar, FaStream, FaLayerGroup, FaListAlt, FaBookOpen, FaThList, FaFolderOpen, FaUserCircle, FaEnvelope, FaBars
} from 'react-icons/fa';
import './Dashboard.css';
import { Toaster } from 'react-hot-toast';
import api from '../../services/authService';
import AvatarUpload from '../AvatarUpload';
import toast from 'react-hot-toast';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(location.pathname.startsWith('/admin/users'));
  const [profilePhoto, setProfilePhoto] = useState(() => localStorage.getItem('admin_profile_photo'));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // Add state for mobile subnavs
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Admin profile photo upload/remove logic for mobile sidebar
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    // Fetch admin profile for photo upload/remove
    const fetchProfile = async () => {
      const userEmail = localStorage.getItem('user_email');
      if (!userEmail) return;
      const userRes = await api.get('/admin/users');
      const userList = Array.isArray(userRes.data) ? userRes.data : [userRes.data];
      const adminObj = userList.find(u => u.email === userEmail && u.user_type === 'admin');
      if (adminObj) {
        const profileRes = await api.get(`/profile/user/${adminObj.id}`);
        setProfile(profileRes.data);
      }
    };
    fetchProfile();
  }, []);
  const userId = (() => {
    const userEmail = localStorage.getItem('user_email');
    if (!userEmail) return null;
    const userList = JSON.parse(localStorage.getItem('admin_users') || '[]');
    const adminObj = userList.find(u => u.email === userEmail && u.user_type === 'admin');
    return adminObj ? adminObj.id : null;
  })();
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('user_id', userId);
    try {
      if (profile && profile.p_id) {
        await api.put(`/profile/profile-update/${userId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/profile/profile-add', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      toast.success('Profile photo updated!');
      const res = await api.get(`/profile/user/${userId}`);
      setProfile(res.data);
      if (res.data && res.data.photo_url) {
        const backendUrl = 'http://localhost:3000';
        const newPhotoUrl = backendUrl + res.data.photo_url + `?t=${Date.now()}`;
        localStorage.setItem('admin_profile_photo', newPhotoUrl);
        window.dispatchEvent(new Event('profilePhotoUpdated'));
      } else {
        localStorage.removeItem('admin_profile_photo');
        window.dispatchEvent(new Event('profilePhotoUpdated'));
      }
    } catch (err) {
      toast.error('Failed to upload photo');
    }
    setUploading(false);
  };
  const handlePhotoDelete = async () => {
    if (!userId) return;
    setUploading(true);
    try {
      await api.put(`/profile/photo-delete/${userId}`);
      toast.success('Profile photo removed!');
      const res = await api.get(`/profile/user/${userId}`);
      setProfile(res.data);
      localStorage.removeItem('admin_profile_photo');
      window.dispatchEvent(new Event('profilePhotoUpdated'));
    } catch (err) {
      toast.error('Failed to remove photo');
    }
    setUploading(false);
  };

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

  // Only apply mobile styles for hamburger and main content if isMobile
  const isMobile = window.innerWidth <= 900;
  const userName = 'User'; // Placeholder, replace with actual user name if available
  const userRole = 'Super Admin'; // Placeholder, replace with actual role if available

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-left" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <h1 className="logo">LAMS</h1>
          </div>
          <div className="header-right" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {/* On mobile, show hamburger at right, hide profile photo */}
            {isMobile ? (
              <span
                className="mobile-hamburger"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)', // vertically center in header
                  zIndex: 1200,
                  background: '#fff',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px #2563eb22',
                  padding: 8,
                  cursor: 'pointer',
                  border: '1.5px solid #e1e1e1',
                  display: 'inline-flex',
                }}
                onClick={() => {
                  setMobileSidebarOpen(!mobileSidebarOpen);
                  if (mobileSidebarOpen) navigate('/admin'); // return to home when closing
                }}
              >
                <FaBars size={24} color="#2563eb" />
              </span>
            ) : (
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
            )}
          </div>
        </header>
        {/* Mobile Sidebar Overlay */}
        {isMobile && mobileSidebarOpen && (
          <div
            style={{
              position: 'fixed',
              top: 60,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(30,34,90,0.18)',
              zIndex: 2000,
              display: 'flex',
              flexDirection: 'column',
            }}
            // Remove onClick to prevent closing when clicking outside
          >
            <aside
              style={{
                position: 'fixed',
                top: 60,
                left: 0,
                right: 0,
                width: '100vw',
                maxWidth: 'none',
                margin: 0,
                borderRadius: 0,
                boxShadow: 'none',
                zIndex: 999,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '80vh',
                maxHeight: '80vh',
                height: '80vh',
                position: 'relative',
                overflowY: 'auto',
                background: 'transparent',
              }}
              // Remove onClick={e => e.stopPropagation()}
            >
              {/* Card-like inner content */}
              <div style={{
                width: '92vw',
                maxWidth: 400,
                margin: '0 auto',
                borderRadius: '18px',
                boxShadow: '0 8px 32px rgba(30,34,90,0.12)',
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 18,
                minHeight: '80vh',
                maxHeight: '80vh',
                height: '80vh',
                overflowY: 'auto',
                padding: 0,
              }}>
                {/* Profile photo, name, role, logout, settings */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 18, boxSizing: 'border-box', padding: '2rem 0.5rem 1.5rem 0.5rem', borderBottom: '1.5px solid #e5e7eb' }}>
                  {/* AvatarUpload for mobile profile photo upload/remove */}
                  <AvatarUpload
                    photoUrl={profile && profile.photo_url ? profile.photo_url : profilePhoto}
                    initials={userName ? userName[0] : 'A'}
                    onPhotoChange={handlePhotoChange}
                    onPhotoDelete={handlePhotoDelete}
                    uploading={uploading}
                  />
                  <div style={{ fontWeight: 700, fontSize: 19, color: '#2563eb', marginBottom: 3, textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>{userName}</div>
                  <div style={{ fontWeight: 500, fontSize: 15, color: '#6b7280', marginBottom: 10, textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>{userRole}</div>
                  <button onClick={() => { navigate('/admin/settings'); setMobileSidebarOpen(false); }} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, fontSize: 17, marginBottom: 10, cursor: 'pointer', width: '100%', textAlign: 'center', boxSizing: 'border-box', padding: 0 }}>Settings</button>
                  <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#e11d48', fontWeight: 600, fontSize: 17, cursor: 'pointer', width: '100%', textAlign: 'center', boxSizing: 'border-box', padding: 0 }}>Logout</button>
                </div>
                {/* Main nav links, with expandable subnavs */}
                <nav className="sidebar-nav" style={{ width: '100%' }}>
                  <div className="nav-section" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''} onClick={() => setMobileSidebarOpen(false)} style={{ padding: '0.95rem 1.2rem', borderRadius: 8 }}>
                      <FaHome /><span>Dashboard</span>
                    </Link>
                    {/* User Management (expandable) */}
                    <div className={`menu-parent${mobileUserMenuOpen ? ' open' : ''}`}> 
                      <button className="menu-toggle" onClick={() => setMobileUserMenuOpen(!mobileUserMenuOpen)} style={{ padding: '0.95rem 1.2rem', borderRadius: 8 }}>
                        <FaUsers style={{ marginRight: 8 }} />
                        <span>User Management</span>
                        <FaAngleDown className={`menu-arrow${mobileUserMenuOpen ? ' rotated' : ''}`} size={14} style={{ marginLeft: 'auto' }} />
                      </button>
                      {mobileUserMenuOpen && (
                        <div className="submenu">
                          <Link to="/admin/users/all" className={location.pathname === '/admin/users/all' ? 'active' : ''} onClick={() => setMobileSidebarOpen(false)} style={{ padding: '0.85rem 1.2rem', borderRadius: 8 }}><FaUserCircle /><span>All Users</span></Link>
                          <Link to="/admin/users/students" className={location.pathname === '/admin/users/students' ? 'active' : ''} onClick={() => setMobileSidebarOpen(false)} style={{ padding: '0.85rem 1.2rem', borderRadius: 8 }}><FaUserGraduate /><span>Students</span></Link>
                        </div>
                      )}
                    </div>
                    {/* Menu (expandable) */}
                    <div className={`menu-parent${mobileMenuOpen ? ' open' : ''}`}> 
                      <button className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ padding: '0.95rem 1.2rem', borderRadius: 8 }}>
                        <FaLayerGroup style={{ marginRight: 8 }} />
                        <span>Menu</span>
                        <FaAngleDown className={`menu-arrow${mobileMenuOpen ? ' rotated' : ''}`} size={14} style={{ marginLeft: 'auto' }} />
                      </button>
                      {mobileMenuOpen && (
                        <div className="submenu">
                          <Link to="/admin/courses" className={location.pathname.includes('/admin/courses') ? 'active' : ''} onClick={() => setMobileSidebarOpen(false)} style={{ padding: '0.85rem 1.2rem', borderRadius: 8 }}><FaBook /><span>Courses</span></Link>
                          <Link to="/admin/classes" className={location.pathname.includes('/admin/classes') ? 'active' : ''} onClick={() => setMobileSidebarOpen(false)} style={{ padding: '0.85rem 1.2rem', borderRadius: 8 }}><FaChalkboardTeacher /><span>Classes</span></Link>
                          <Link to="/admin/stream" className={location.pathname.includes('/admin/stream') ? 'active' : ''} onClick={() => setMobileSidebarOpen(false)} style={{ padding: '0.85rem 1.2rem', borderRadius: 8 }}><FaStream /><span>Stream</span></Link>
                          <Link to="/admin/subjects" className={location.pathname.includes('/admin/subjects') ? 'active' : ''} onClick={() => setMobileSidebarOpen(false)} style={{ padding: '0.85rem 1.2rem', borderRadius: 8 }}><FaBookOpen /><span>Subjects</span></Link>
                          <Link to="/admin/chapters" className={location.pathname.includes('/admin/chapters') ? 'active' : ''} onClick={() => setMobileSidebarOpen(false)} style={{ padding: '0.85rem 1.2rem', borderRadius: 8 }}><FaListAlt /><span>Chapters</span></Link>
                          <Link to="/admin/content" className={location.pathname.includes('/admin/content') ? 'active' : ''} onClick={() => setMobileSidebarOpen(false)} style={{ padding: '0.85rem 1.2rem', borderRadius: 8 }}><FaFolderOpen /><span>Content</span></Link>
                        </div>
                      )}
                    </div>
                    <Link to="/admin/exams" className={location.pathname === '/admin/exams' ? 'active' : ''} onClick={() => setMobileSidebarOpen(false)} style={{ padding: '0.95rem 1.2rem', borderRadius: 8 }}>
                      <FaFileAlt /><span>Exams</span>
                    </Link>
                    <Link to="/admin/results" className={location.pathname === '/admin/results' ? 'active' : ''} onClick={() => setMobileSidebarOpen(false)} style={{ padding: '0.95rem 1.2rem', borderRadius: 8 }}>
                      <FaChartBar /><span>Results</span>
                    </Link>
                    <Link to="/admin/send-message" className={location.pathname === '/admin/send-message' ? 'active' : ''} onClick={() => setMobileSidebarOpen(false)} style={{ padding: '0.95rem 1.2rem', borderRadius: 8 }}>
                      <FaEnvelope /><span>Send Notification</span>
                    </Link>
                  </div>
                </nav>
              </div>
            </aside>
          </div>
        )}
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="dashboard-sidebar">
            <nav className="sidebar-nav">
              <div className="nav-section">
                {/* Use <Link> for Dashboard nav so it gets 'active' class and blue color */}
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
        )}
        <main
          className="dashboard-main"
          style={isMobile ? {
            marginLeft: 0,
            padding: '70px 0.2rem 1.2rem 0.2rem', // less left/right padding
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100vw',
            maxWidth: '100vw',
            overflowX: 'hidden',
            minHeight: 'calc(100vh - 60px)',
          } : {
            paddingTop: 70, // 70px top for header
          }}
        >
          {React.isValidElement(children)
            ? React.cloneElement(children, { onProfilePhotoChange: setProfilePhoto })
            : children}
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
