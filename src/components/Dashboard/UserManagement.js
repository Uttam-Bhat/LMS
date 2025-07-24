import api from '../../services/authService';
import { useEffect, useState } from 'react';
import { FaPencilAlt, FaSearch, FaTrashAlt, FaUserCircle, FaUserPlus } from 'react-icons/fa';
import CreateUserModal from './CreateUserModal';
import './UserManagement.css';
import AssignStudentModal from './AssignStudentModal';
import toast from 'react-hot-toast';
import ConfirmDialog from './ConfirmDialog';
import StudentsManagement from './StudentsManagement';

const UserManagement = ({ activeSubPage = 'all-users' }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editUserData, setEditUserData] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningUser, setAssigningUser] = useState(null);
  const [assignedStudents, setAssignedStudents] = useState({});

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        setUsers(response.data);
        // Fetch assigned students and update assignedStudents state
        const studentRes = await api.get('/student/student-display');
        const assigned = {};
        (studentRes.data || []).forEach(stu => {
          if (stu.user_info && stu.user_info.id) {
            assigned[stu.user_info.id] = true;
          }
        });
        setAssignedStudents(assigned);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = activeFilter === 'all' || user.user_type === activeFilter;
    const matchesSearch = user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = (id) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/delete/${pendingDeleteId}`);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== pendingDeleteId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Error deleting user');
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  // Only show cards on mobile, table on desktop
  const isMobile = window.innerWidth <= 900;

  return (
    <>
      {activeSubPage === 'all-users' && (
        <div className="user-management">
          <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 32, gap: 18 }}>
            <FaUserPlus size={38} color="#2563eb" style={{ flexShrink: 0 }} />
            <div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 700, color: '#2563eb', margin: 0 }}>User Management</h1>
              <div style={{ color: '#6b7280', fontSize: '1.08rem', marginTop: 2 }}>Add, assign, and manage users</div>
            </div>
          </div>
          {/* Add New User button: below header on mobile, in header on desktop */}
          {isMobile ? (
            <button 
              className="add-user-btn"
              onClick={() => setShowCreateUserModal(true)}
            >
              <FaUserPlus />
              Add New User
            </button>
          ) : (
            <button 
              className="add-user-btn"
              style={{ position: 'absolute', right: 0, top: 0 }}
              onClick={() => setShowCreateUserModal(true)}
            >
              <FaUserPlus />
              Add New User
            </button>
          )}

          <div className="user-filters">
            <div className="search-box" style={{ position: 'relative', width: 300 }}>
              <span className="search-icon" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', fontSize: 18 }}><FaSearch /></span>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearch}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  border: '1px solid #e1e1e1',
                  borderRadius: 8,
                  fontSize: '0.95rem',
                }}
              />
            </div>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                All Users
              </button>
              <button
                className={`filter-btn ${activeFilter === 'teacher' ? 'active' : ''}`}
                onClick={() => handleFilterChange('teacher')}
              >
                Teachers
              </button>
              <button
                className={`filter-btn ${activeFilter === 'student' ? 'active' : ''}`}
                onClick={() => handleFilterChange('student')}
              >
                Students
              </button>
            </div>
          </div>

          {/* Responsive User Cards for Mobile - only render on mobile */}
          {isMobile && (
            <div className="users-cards-container">
              {filteredUsers.map(user => (
                <div className="user-card" key={user.id}>
                  <div className="user-card-header">
                    <FaUserCircle className="user-card-avatar" />
                    <div className="user-card-info">
                      <div className="user-card-name">{user.fullname}</div>
                      <div className="user-card-email">{user.email}</div>
                    </div>
                    <span className={`role-badge ${user.user_type || 'unknown'}`}>{(user.user_type || 'unknown').charAt(0).toUpperCase() + (user.user_type || 'unknown').slice(1)}</span>
                  </div>
                  <div className="user-card-row">
                    <span className="user-card-label">Actions:</span>
                    <div className="action-buttons">
                      <button className="edit-btn" title="Edit user" onClick={() => { setEditUserData(user); setShowCreateUserModal(true); }}>
                        <FaPencilAlt />
                      </button>
                      <button className="delete-btn" title="Delete user" onClick={() => handleDelete(user.id)}>
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                  {user.user_type === 'student' && (
                    <div className="user-card-row">
                      <span className="user-card-label">Assign:</span>
                      {assignedStudents[user.id] ? (
                        <button className="assigned-btn" disabled>Assigned</button>
                      ) : (
                        <button className="assign-btn" onClick={() => { setAssigningUser(user); setShowAssignModal(true); }} disabled={assignedStudents[user.id]}>
                          Assign
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Desktop Table - only render on desktop */}
          {!isMobile && (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                    {filteredUsers.some(u => u.user_type === 'student') && <th>Assign</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <FaUserCircle />
                          <span>{user.fullname}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.user_type || 'unknown'}`}>
                          {(user.user_type || 'unknown').charAt(0).toUpperCase() + (user.user_type || 'unknown').slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="edit-btn" title="Edit user" onClick={() => { setEditUserData(user); setShowCreateUserModal(true); }}>
                            <FaPencilAlt />
                          </button>
                          <button className="delete-btn" title="Delete user" onClick={() => handleDelete(user.id)}>
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                      {user.user_type === 'student' ? (
                        assignedStudents[user.id] ? (
                          <td><button className="assigned-btn" disabled>Assigned</button></td>
                        ) : (
                          <td><button className="assign-btn" onClick={() => { setAssigningUser(user); setShowAssignModal(true); }} disabled={assignedStudents[user.id]}>Assign</button></td>
                        )
                      ) : (
                        <td><span style={{ color: '#b0b0b0', fontSize: '1.2em' }}>-</span></td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(showCreateUserModal || editUserData) && (
            <CreateUserModal
              onClose={() => {
                setShowCreateUserModal(false);
                setEditUserData(null);
              }}
              editUser={editUserData}
              onUpdate={async () => {
                try {
                  const response = await api.get('/admin/users');
                  setUsers(response.data);
                } catch (err) {
                  console.error('Failed to refresh users:', err);
                }
              }}
            />
          )}

          {showAssignModal && assigningUser && (
            <AssignStudentModal
              user={assigningUser}
              onClose={() => { setShowAssignModal(false); setAssigningUser(null); }}
              onAssigned={(_success, _message) => {
                setShowAssignModal(false);
                setAssigningUser(null);
                // Refresh users and assigned students
                (async () => {
                  try {
                    const response = await api.get('/admin/users');
                    setUsers(response.data);
                    const studentRes = await api.get('/student/student-display');
                    const assigned = {};
                    (studentRes.data || []).forEach(stu => {
                      if (stu.user_info && stu.user_info.id) {
                        assigned[stu.user_info.id] = true;
                      }
                    });
                    setAssignedStudents(assigned);
                  } catch {}
                })();
              }}
            />
          )}

          <ConfirmDialog
            open={confirmOpen}
            title="Delete User?"
            message="Are you sure you want to delete this user? This action cannot be undone."
            onConfirm={confirmDelete}
            onCancel={() => { setConfirmOpen(false); setPendingDeleteId(null); }}
          />

        </div>
      )}
      {activeSubPage === 'students' && (
        <StudentsManagement />
      )}
    </>
  );
};

export default UserManagement; 