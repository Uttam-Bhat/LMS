import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import { FaChevronRight, FaChevronDown, FaBookOpen, FaListAlt, FaBook, FaBell, FaChalkboardTeacher, FaChartBar, FaFolderOpen, FaBars, FaHome, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import AvatarUpload from '../AvatarUpload';
import api from '../../services/authService';
import toast from 'react-hot-toast';

const StudentLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [courseMenuOpen, setCourseMenuOpen] = useState(location.pathname.startsWith('/student/available-courses') || location.pathname.startsWith('/student/my-courses'));
  const [profilePhoto, setProfilePhoto] = useState(() => localStorage.getItem('student_profile_photo'));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileCourseMenuOpen, setMobileCourseMenuOpen] = useState(false);
  
  // Student profile photo upload/remove logic for mobile sidebar
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetch student profile for photo upload/remove
    const fetchProfile = async () => {
      const userEmail = localStorage.getItem('user_email');
      if (!userEmail) return;
      try {
        const userRes = await api.get('/admin/users');
        const userList = Array.isArray(userRes.data) ? userRes.data : [userRes.data];
        const studentObj = userList.find(u => u.email === userEmail && u.user_type === 'student');
        if (studentObj) {
          const profileRes = await api.get(`/profile/user/${studentObj.id}`);
          setProfile(profileRes.data);
        }
      } catch (error) {
        console.error('Error fetching student profile:', error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    // Listen for student profile photo updates
    const handleProfilePhotoUpdated = () => {
      setProfilePhoto(localStorage.getItem('student_profile_photo'));
    };
    window.addEventListener('studentProfilePhotoUpdated', handleProfilePhotoUpdated);
    return () => {
      window.removeEventListener('studentProfilePhotoUpdated', handleProfilePhotoUpdated);
    };
  }, []);

  const handleLogout = () => {
    // Add logout logic here
    navigate('/');
  };

  // Close course menu when another main nav is clicked
  const handleMainNavClick = (nav) => {
    if (nav !== 'course') setCourseMenuOpen(false);
  };

  // Handle photo change for mobile sidebar
  const handlePhotoChange = async (file) => {
    if (!profile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      await api.put(`/profile/user/${profile.id}/photo`, formData);
      const updatedProfile = await api.get(`/profile/user/${profile.id}`);
      setProfile(updatedProfile.data);
      localStorage.setItem('student_profile_photo', updatedProfile.data.photo_url);
      setProfilePhoto(updatedProfile.data.photo_url);
      window.dispatchEvent(new Event('studentProfilePhotoUpdated'));
      toast.success('Profile photo updated successfully! 📸');
    } catch (error) {
      console.error('Error updating profile photo:', error);
      toast.error('Failed to update profile photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle photo delete for mobile sidebar
  const handlePhotoDelete = async () => {
    if (!profile) return;
    setUploading(true);
    try {
      await api.delete(`/profile/user/${profile.id}/photo`);
      setProfile({ ...profile, photo_url: null });
      localStorage.removeItem('student_profile_photo');
      setProfilePhoto(null);
      window.dispatchEvent(new Event('studentProfilePhotoUpdated'));
      toast.success('Profile photo removed successfully! 🗑️');
    } catch (error) {
      console.error('Error removing profile photo:', error);
      toast.error('Failed to remove profile photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Only apply mobile styles for hamburger and main content if isMobile
  const isMobile = window.innerWidth <= 900;
  const userName = 'Student'; // Placeholder, replace with actual user name if available
  const userRole = 'Student'; // Placeholder, replace with actual role if available

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo">Student</h1>
        </div>
        <div className="header-right">
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
                if (mobileSidebarOpen) navigate('/student'); // return to home when closing
              }}
            >
              <FaBars size={24} color="#2563eb" />
            </span>
          ) : (
            <div className="profile-dropdown">
              <button 
                className="profile-button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
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
            height: 'calc(100vh - 60px)',
            background: 'rgba(30,34,90,0.18)',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <aside
            style={{
              width: '90vw',
              maxWidth: 350,
              maxHeight: '85vh',
              margin: '0 auto',
              borderRadius: '18px',
              boxShadow: '0 8px 32px rgba(30,34,90,0.12)',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              overflowY: 'auto',
              padding: '1rem 0',
              position: 'relative',
            }}
          >
            {/* Profile photo, name, role, logout, settings */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '100%', 
              marginBottom: 16, 
              boxSizing: 'border-box', 
              padding: '1.5rem 1rem 1rem 1rem', 
              borderBottom: '1.5px solid #e5e7eb' 
            }}>
              {/* AvatarUpload for mobile profile photo upload/remove */}
              <AvatarUpload
                photoUrl={profile && profile.photo_url ? profile.photo_url : profilePhoto}
                initials={userName ? userName[0] : 'S'}
                onPhotoChange={handlePhotoChange}
                onPhotoDelete={handlePhotoDelete}
                uploading={uploading}
              />
              <div style={{ fontWeight: 700, fontSize: 18, color: '#2563eb', marginBottom: 3, textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>{userName}</div>
              <div style={{ fontWeight: 500, fontSize: 14, color: '#6b7280', marginBottom: 8, textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>{userRole}</div>
              
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#e11d48', fontWeight: 600, fontSize: 16, cursor: 'pointer', width: '100%', textAlign: 'center', boxSizing: 'border-box', padding: 0 }}>Logout</button>
            </div>
            {/* Main nav links, with expandable subnavs */}
            <nav className="sidebar-nav" style={{ width: '100%', flex: 1, overflowY: 'auto' }}>
              <div className="nav-section" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '0 1rem' }}>
                <Link to="/student" className={location.pathname === '/student' ? 'active' : ''} onClick={() => setMobileSidebarOpen(false)} style={{ padding: '0.8rem 1rem', borderRadius: 8 }}>
                  <FaHome /><span>Dashboard</span>
                </Link>
                {/* Course (expandable) */}
                <div className="menu-parent">
                  <button className="menu-toggle" onClick={() => setMobileCourseMenuOpen(!mobileCourseMenuOpen)} style={{ padding: '0.8rem 1rem', borderRadius: 8 }}>
                    <FaBook style={{ marginRight: 8 }} />
                    <span>Course</span>
                    <FaChevronDown className={`menu-arrow${mobileCourseMenuOpen ? ' rotated' : ''}`} size={14} style={{ marginLeft: 'auto' }} />
                  </button>
                  {mobileCourseMenuOpen && (
                    <div className="submenu">
                      <Link to="/student/available-courses" className={location.pathname === '/student/available-courses' ? 'active' : ''} onClick={() => setMobileSidebarOpen(false)} style={{ padding: '0.7rem 1rem', borderRadius: 8 }}><FaBookOpen /><span>Available Courses</span></Link>
                      <Link to="/student/my-courses" className={location.pathname === '/student/my-courses' ? 'active' : ''} onClick={() => setMobileSidebarOpen(false)} style={{ padding: '0.7rem 1rem', borderRadius: 8 }}><FaListAlt /><span>My Courses</span></Link>
                    </div>
                  )}
                </div>
                <Link to="/student/materials" className={location.pathname === '/student/materials' ? 'active' : ''} onClick={() => setMobileSidebarOpen(false)} style={{ padding: '0.8rem 1rem', borderRadius: 8 }}>
                  <FaFolderOpen /><span>Materials</span>
                </Link>
                <Link to="/student/exam" className={location.pathname === '/student/exam' ? 'active' : ''} onClick={() => setMobileSidebarOpen(false)} style={{ padding: '0.8rem 1rem', borderRadius: 8 }}>
                  <FaChalkboardTeacher /><span>Exam</span>
                </Link>
                <Link to="/student/notifications" className={location.pathname === '/student/notifications' ? 'active' : ''} onClick={() => setMobileSidebarOpen(false)} style={{ padding: '0.8rem 1rem', borderRadius: 8 }}>
                  <FaBell /><span>Notifications</span>
                </Link>
                <Link to="/student/result" className={location.pathname === '/student/result' ? 'active' : ''} onClick={() => setMobileSidebarOpen(false)} style={{ padding: '0.8rem 1rem', borderRadius: 8 }}>
                  <FaChartBar /><span>Result</span>
                </Link>
              </div>
            </nav>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
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
      )}

      {/* Mobile Main Content */}
      {isMobile && (
        <main
          className="dashboard-main"
          style={{
            marginLeft: 0,
            padding: '70px 0.2rem 1.2rem 0.2rem', // less left/right padding
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100vw',
            maxWidth: '100vw',
            overflowX: 'hidden',
            minHeight: 'calc(100vh - 60px)',
          }}
        >
          {children}
        </main>
      )}
    </div>
  );
};

export default StudentLayout; 