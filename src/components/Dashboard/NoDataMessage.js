import React from 'react';
import { FaInbox, FaUsers, FaBook, FaFileAlt, FaStream, FaLayerGroup, FaListAlt, FaFolderOpen } from 'react-icons/fa';

const NoDataMessage = ({ type = 'general', message, icon }) => {
  const getIcon = () => {
    if (icon) return icon;
    
    const iconMap = {
      users: <FaUsers size={48} color="#d1d5db" />,
      courses: <FaBook size={48} color="#d1d5db" />,
      exams: <FaFileAlt size={48} color="#d1d5db" />,
      streams: <FaStream size={48} color="#d1d5db" />,
      subjects: <FaLayerGroup size={48} color="#d1d5db" />,
      chapters: <FaListAlt size={48} color="#d1d5db" />,
      content: <FaFolderOpen size={48} color="#d1d5db" />,
      general: <FaInbox size={48} color="#d1d5db" />
    };
    
    return iconMap[type] || iconMap.general;
  };

  const getDefaultMessage = () => {
    if (message) return message;
    
    const messageMap = {
      users: 'No users found',
      courses: 'No courses available',
      exams: 'No exams created yet',
      streams: 'No streams available',
      subjects: 'No subjects found',
      chapters: 'No chapters available',
      content: 'No content uploaded yet',
      general: 'No data available'
    };
    
    return messageMap[type] || messageMap.general;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '40vh',
      background: '#fff',
      borderRadius: '12px',
      padding: '3rem',
      textAlign: 'center',
      border: '1px solid #e5e7eb'
    }}>
      {getIcon()}
      <div style={{
        marginTop: '1rem',
        color: '#6b7280',
        fontSize: '1.1rem',
        fontWeight: 500
      }}>
        {getDefaultMessage()}
      </div>
      <div style={{
        marginTop: '0.5rem',
        color: '#9ca3af',
        fontSize: '0.9rem'
      }}>
        {type === 'users' && 'Try adding a new user to get started'}
        {type === 'courses' && 'Create your first course to begin'}
        {type === 'exams' && 'Create an exam to start assessing students'}
        {type === 'streams' && 'Add a stream to organize your subjects'}
        {type === 'subjects' && 'Add subjects to your streams'}
        {type === 'chapters' && 'Create chapters for your subjects'}
        {type === 'content' && 'Upload educational content for your students'}
        {type === 'general' && 'Add some data to get started'}
      </div>
    </div>
  );
};

export default NoDataMessage; 