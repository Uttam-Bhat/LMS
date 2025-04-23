import React, { useState } from 'react';
import './UserManagement.css';
import { FaUserPlus, FaSearch, FaUserCircle, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import DashboardLayout from './DashboardLayout';

const UserManagement = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const users = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'teacher', accessLevel: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'teacher', accessLevel: 'editor' },
    { id: 3, name: 'Mike Johnson', email: 'mike.j@example.com', role: 'student', accessLevel: 'viewer' },
    { id: 4, name: 'Sarah Williams', email: 'sarah.w@example.com', role: 'student', accessLevel: 'viewer' },
  ];

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = activeFilter === 'all' || user.role === activeFilter;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="user-management">
        <div className="page-header">
          <h1>User Management</h1>
          <button className="add-user-btn">
            <FaUserPlus />
            Add New User
          </button>
        </div>

        <div className="user-filters">
          <div className="search-box">
            <FaSearch />
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
                <th>Access Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <FaUserCircle />
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td>
                    <select className="access-level-select" defaultValue={user.accessLevel}>
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
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
      </div>
    </DashboardLayout>
  );
};

export default UserManagement; 