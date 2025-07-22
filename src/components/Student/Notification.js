import React, { useEffect, useState } from 'react';
import './StudentDashboard.css';
import StudentLayout from './StudentLayout';
import api from '../../services/authService';
import { FaUserShield, FaUsers, FaBell } from 'react-icons/fa';

// Notification bell with badge for navbar (to be used in StudentLayout)
const NotificationBell = ({ count }) => (
  <div style={{ position: 'relative', display: 'inline-block' }}>
    <FaBell size={22} style={{ color: '#2563eb' }} />
    {count > 0 && (
      <span style={{ position: 'absolute', top: -7, right: -7, background: '#d32f2f', color: '#fff', borderRadius: '50%', fontSize: 12, fontWeight: 700, padding: '2px 6px', minWidth: 18, textAlign: 'center', boxShadow: '0 1px 4px #d32f2f33' }}>{count}</span>
    )}
  </div>
);

const Notification = () => {
  const [tab, setTab] = useState('direct');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [unseenCount, setUnseenCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get current student info
        const userEmail = localStorage.getItem('user_email');
        const userRes = await api.get('/admin/users');
        const userList = Array.isArray(userRes.data) ? userRes.data : [userRes.data];
        const user = userList.find(u => u.email === userEmail);
        if (!user) { setLoading(false); return; }
        const studentRes = await api.get('/student/student-display');
        const studentList = Array.isArray(studentRes.data) ? studentRes.data : [studentRes.data];
        const studentObj = studentList.find(s => s.user_info.id === user.id);
        setStudent(studentObj);
        // Fetch all messages
        const msgRes = await api.get('/message/msg-all');
        setMessages(Array.isArray(msgRes.data) ? msgRes.data : []);
        // For now, unseen = all messages for this student
        let directMsgs = [], classMsgs = [];
        if (studentObj && msgRes.data.length > 0) {
          const myId = studentObj.user_info.id;
          const myClassId = studentObj.user_info.class_info.cls_id;
          const myStreamId = studentObj.user_info.class_info.stream_info.sid;
          directMsgs = msgRes.data.filter(m => m.id === myId);
          classMsgs = msgRes.data.filter(m => m.cls_id === myClassId && m.sid === myStreamId);
        }
        setUnseenCount(directMsgs.length + classMsgs.length);
      } catch (err) {
        setMessages([]);
        setUnseenCount(0);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter messages for direct and class notifications
  let directMsgs = [], classMsgs = [];
  if (student && messages.length > 0) {
    const myId = student.user_info.id;
    const myClassId = student.user_info.class_info.cls_id;
    const myStreamId = student.user_info.class_info.stream_info.sid;
    directMsgs = messages.filter(m => m.id === myId);
    classMsgs = messages.filter(m => m.cls_id === myClassId && m.sid === myStreamId);
  }

  const renderMessages = (list, type) => (
    <div className="notifications-list">
      {list.length === 0 ? (
        <div className="no-notifications">No notifications yet.</div>
      ) : (
        list.map((n, idx) => (
          <div key={n.m_id || idx} className={`notification-card admin`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 28, color: type === 'direct' ? '#2563eb' : '#059669', marginRight: 8 }}>
                {type === 'direct' ? <FaUserShield /> : <FaUsers />}
              </div>
              <div className="notification-content" style={{ flex: 1 }}>
                <div className="notification-header">
                  <span className="notification-sender">
                    Admin
                  </span>
                  <span className="notification-time">{n.created_at ? new Date(n.created_at).toLocaleString() : ''}</span>
                </div>
                <div className="notification-message" style={{ fontWeight: 500, fontSize: '1.08rem', color: '#222', marginTop: 4 }}>
                  {n.msg || <span style={{ color: '#d32f2f' }}>[No message]</span>}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <StudentLayout notificationCount={unseenCount}>
      <div className="dashboard-main-content">
        <div className="notification-page">
          <div className="page-header">
            <div className="header-content">
              <h1>Notifications</h1>
              <p>Stay updated with important messages from your admin</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            <button
              onClick={() => setTab('direct')}
              style={{ background: tab === 'direct' ? '#2563eb' : '#e5e7eb', color: tab === 'direct' ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }}
            >
              Direct Notifications
            </button>
            <button
              onClick={() => setTab('class')}
              style={{ background: tab === 'class' ? '#2563eb' : '#e5e7eb', color: tab === 'class' ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }}
            >
              Class Notifications
            </button>
          </div>
          {loading ? (
            <div style={{ color: '#2563eb', fontWeight: 600, fontSize: '1.1rem', marginTop: 32 }}>Loading notifications...</div>
          ) : (
            tab === 'direct' ? renderMessages(directMsgs, 'direct') : renderMessages(classMsgs, 'class')
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default Notification;
export { NotificationBell };

