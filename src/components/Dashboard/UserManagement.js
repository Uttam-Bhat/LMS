import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaPencilAlt, FaSearch, FaTrashAlt, FaUserCircle, FaUserPlus } from 'react-icons/fa';
import CreateUserModal from './CreateUserModal';
import DashboardLayout from './DashboardLayout';
import './UserManagement.css';

const UserManagement = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/users');
      setUsers(response.data); // Expecting array of user objects
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
    const matchesFilter = activeFilter === 'all' || user.role === activeFilter;
    const matchesSearch = user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="user-management">
        <div className="page-header">
          <h1>User Management</h1>
          <button 
            className="add-user-btn"
            onClick={() => setShowCreateUserModal(true)}
          >
            <FaUserPlus />
            Add New User
          </button>
        </div>

        <div className="user-filters">
          <div className="search-box">
            <span className="search-icon"><FaSearch /></span>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
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

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
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
                <span className={`role-badge ${user.role || 'unknown'}`}>
                     {user.user_type ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Unknown'}
              </span>
            </td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn" title="Edit user">
                        <FaPencilAlt />
                      </button>
                      <button className="delete-btn" title="Delete user">
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showCreateUserModal && (
          <CreateUserModal onClose={() => setShowCreateUserModal(false)} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserManagement; 