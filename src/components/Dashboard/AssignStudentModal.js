import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CreateUserModal.css';

const AssignStudentModal = ({ user, onClose, onAssigned }) => {
  const [classes, setClasses] = useState([]);
  const [streams, setStreams] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [classRes, streamRes] = await Promise.all([
          axios.get('http://localhost:3000/api/class/display'),
          axios.get('http://localhost:3000/api/stream/display'),
        ]);
        setClasses(classRes.data || []);
        setStreams(streamRes.data || []);
      } catch (err) {
        setError('Failed to fetch classes or streams');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedClass || !selectedStream) {
      setError('Please select both class and stream');
      return;
    }
    setAssigning(true);
    setError('');
    try {
      // TODO: Replace with your actual API call for assignment
      // await axios.post('http://localhost:3000/api/assign', { userId: user.id, classId: selectedClass, streamId: selectedStream });
      setTimeout(() => {
        setAssigning(false);
        onAssigned();
      }, 800); // Simulate API
    } catch (err) {
      setError('Failed to assign student');
      setAssigning(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="create-user-modal assign-modal">
        <div className="modal-header">
          <h2>Assign Student</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <div className="student-info">
                <div><strong>Name:</strong> {user.fullname}</div>
                <div><strong>Email:</strong> {user.email}</div>
              </div>
              <div className="form-group">
                <label htmlFor="assign-class">Class</label>
                <select id="assign-class" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls.cls_id} value={cls.cls_id}>{cls.class_name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="assign-stream">Stream</label>
                <select id="assign-stream" value={selectedStream} onChange={e => setSelectedStream(e.target.value)}>
                  <option value="">Select Stream</option>
                  {streams.map(stream => (
                    <option key={stream.sid} value={stream.sid}>{stream.sname}</option>
                  ))}
                </select>
              </div>
              {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
            </>
          )}
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose} disabled={assigning}>Cancel</button>
          <button className="add-btn" onClick={handleAssign} disabled={assigning || loading}>
            {assigning ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignStudentModal; 