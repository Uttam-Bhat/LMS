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

  const mockAdmin = {
    username: 'adminuser',
    email: 'admin@example.com',
    profilePhoto: '', // Use a placeholder if empty
    password: '********',
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
          <div className="create-course-modal" style={{ maxWidth: 400, padding: '2rem 2.5rem', borderRadius: 16, boxShadow: '0 6px 32px rgba(0,0,0,0.12)' }}>
            <div className="modal-header" style={{ borderBottom: 'none', marginBottom: 0 }}>
              <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.3rem', color: '#1877f2' }}>Profile</h2>
              <button className="close-button" onClick={() => setShowProfileModal(false)}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
              <img
                src={mockAdmin.profilePhoto || 'https://ui-avatars.com/api/?name=Admin&background=1877f2&color=fff&size=128'}
                alt="Profile"
                style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '3px solid #1877f2', marginBottom: 12 }}
              />
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontWeight: 600, width: 90 }}>Username:</span> <span style={{ color: '#333' }}>{mockAdmin.username}</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontWeight: 600, width: 90 }}>Email:</span> <span style={{ color: '#333' }}>{mockAdmin.email}</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontWeight: 600, width: 90 }}>Password:</span> <input type="password" value={mockAdmin.password} readOnly style={{ border: 'none', background: 'transparent', fontSize: '1rem', color: '#333', width: 120 }} /></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay">
          <div className="create-course-modal" style={{ maxWidth: 400, padding: '2rem 2.5rem', borderRadius: 16, boxShadow: '0 6px 32px rgba(0,0,0,0.12)' }}>
            <div className="modal-header" style={{ borderBottom: 'none', marginBottom: 0 }}>
              <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.3rem', color: '#1877f2' }}>Settings</h2>
              <button className="close-button" onClick={() => setShowSettingsModal(false)}>×</button>
            </div>
            <PasswordUpdateForm onClose={() => setShowSettingsModal(false)} />
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

function PasswordUpdateForm({ onClose }) {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    if (!current || !newPass || !confirm) {
      setError('All fields are required.');
      return;
    }
    if (newPass.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPass !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setMsg('Password updated successfully!');
    setCurrent(''); setNewPass(''); setConfirm('');
    setTimeout(onClose, 1200);
  };
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1rem 0', marginTop: 8 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontWeight: 500, marginBottom: 2 }}>Current Password</label>
        <input type="password" value={current} onChange={e => setCurrent(e.target.value)} required style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid #e1e1e1' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontWeight: 500, marginBottom: 2 }}>New Password</label>
        <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} required style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid #e1e1e1' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontWeight: 500, marginBottom: 2 }}>Confirm New Password</label>
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid #e1e1e1' }} />
      </div>
      {msg && <div style={{ color: 'green', fontWeight: 500, textAlign: 'center' }}>{msg}</div>}
      {error && <div style={{ color: 'red', fontWeight: 500, textAlign: 'center' }}>{error}</div>}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: 8 }}>
        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
        <button type="submit" className="create-btn">Update Password</button>
      </div>
    </form>
  );
}

export default DashboardLayout; 