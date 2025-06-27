import React from 'react';
import './StudentDashboard.css';
import StudentLayout from './StudentLayout';

// Example mock notifications
const notifications = [
  {
    id: 1,
    sender: 'Admin',
    senderType: 'admin',
    avatar: 'https://img.icons8.com/color/48/000000/admin-settings-male.png',
    message: 'Welcome to the new semester! Check your courses and materials.',
    time: '2 hours ago',
  },
  {
    id: 2,
    sender: 'Ms. Johnson',
    senderType: 'teacher',
    avatar: 'https://img.icons8.com/color/48/000000/teacher.png',
    message: 'Assignment 1 for Mathematics is due next week. Please submit on time.',
    time: '1 day ago',
  },
  {
    id: 3,
    sender: 'Admin',
    senderType: 'admin',
    avatar: 'https://img.icons8.com/color/48/000000/admin-settings-male.png',
    message: 'System maintenance scheduled for this weekend.',
    time: '3 days ago',
  },
];

const Notification = () => {
  return (
    <StudentLayout>
      <div className="dashboard-main-content">
        <div className="notification-page">
          <div className="page-header">
            <div className="header-content">
              <h1>Notifications</h1>
              <p>Stay updated with important messages from your teachers and admin</p>
            </div>
          </div>
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">No notifications yet.</div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className={`notification-card ${n.senderType}`}>
                  <div className="notification-content">
                    <div className="notification-header">
                      <span className="notification-sender">{n.sender}</span>
                      <span className="notification-time">{n.time}</span>
                    </div>
                    <div className="notification-message">{n.message}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default Notification;
