import api from '../../services/authService';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './CreateUserModal.css';
import toast from 'react-hot-toast';

const CreateUserModal = ({ onClose = () => {}, editUser = null, onUpdate = () => {} }) => {
  const [formData, setFormData] = useState({
    fullname:'',
    username: '',
    email: '',
    password: '',
    loginType: '',
  });

  useEffect(() => {
    if (editUser) {
      setFormData({
        fullname: editUser.fullname || '',
        username: editUser.username || '',
        email: editUser.email || '',
        loginType: editUser.user_type || '',
      });
    } else {
      setFormData({
        fullname: '',
        username: '',
        email: '',
        loginType: '',
      });
    }
  }, [editUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        fullname: formData.fullname,
        username: formData.username,
        email: formData.email,
        user_type: formData.loginType,
         password: formData.password, 
      };
      if (!editUser) {
        payload.password = formData.password;
}
      console.log('Sending payload:', payload);
      
      if (editUser) {
        await api.put(`/admin/edit/${editUser.id}`, payload);
        toast.success('User updated successfully');
      } else {
        await api.post('/admin/register', payload);
        toast.success('User added successfully');
      }
      onUpdate(); // Refresh user list
      onClose();  // Close modal
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      console.error('Error status:', error.response?.status);
      console.error('Error details:', error.response);
      
      if (editUser) {
        toast.error(`Failed to update user: ${error.response?.data?.message || error.message}`);
      } else {
        toast.error(`Failed to add user: ${error.response?.data?.message || error.message}`);
      }
    }
  };
  return (
    <div className="modal-overlay">
      <div className="create-user-modal">
        <div className="modal-header">
          <h2>{editUser ? 'Edit User' : 'Add New User'}</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter Full Name"
              required
              readOnly={false}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
              readOnly={false}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
              readOnly={!!editUser}
            />
          </div>

          <div className="form-group">
            <label htmlFor="loginType">Login Type</label>
            {editUser ? (
              <input
                type="text"
                id="loginType"
                name="loginType"
                value={formData.loginType.charAt(0).toUpperCase() + formData.loginType.slice(1)}
                readOnly
              />
            ) : (
              <select
                id="loginType"
                name="loginType"
                value={formData.loginType}
                onChange={handleChange}
                required
              >
                <option value="">Select login type</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            )}
          </div>

          {!editUser && (
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="add-btn">
              {editUser ? 'Save Changes' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal; 