import axios from 'axios';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './CreateUserModal.css';
const CreateUserModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fullName:'',
    username: '',
    email: '',
    password: '',
    loginType: '',
  });

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
      const response = await axios.post('http://localhost:3000/api/register', {
        fullname: formData.fullName,
        username: formData.username,
        email: formData.email,
        user_type: formData.loginType,
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('User created:', response.data);
      alert('User added successfully!');
      onClose();
    } catch (error) {
      console.error('Add user failed:', error);
      alert(error.response?.data?.message || 'User registration failed!');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="create-user-modal">
        <div className="modal-header">
          <h2>Add New User</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter Full Name"
              required
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="loginType">Login Type</label>
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
          </div>

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

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="add-btn">
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal; 