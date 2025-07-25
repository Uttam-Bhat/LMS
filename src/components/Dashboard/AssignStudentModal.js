import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CreateUserModal.css';
import toast from 'react-hot-toast';
import api from '../../services/authService';

const AssignStudentModal = ({ user, onClose, onAssigned }) => {
  const [classes, setClasses] = useState([]);
  const [streams, setStreams] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const classRes = await api.get('/class/display');
        setClasses(classRes.data || []);
      } catch (err) {
        setError('Failed to fetch classes');
      }
      setLoading(false);
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (!selectedClass) {
      setStreams([]);
      setSelectedStream('');
      return;
    }
    const fetchStreams = async () => {
      setLoading(true);
      try {
        const streamRes = await api.get(`/stream/display?class_id=${selectedClass}`);
        const uniqueStreams = (streamRes.data || []).filter((stream, idx, arr) =>
          arr.findIndex(s => s.sid === stream.sid) === idx
        );
        setStreams(uniqueStreams);
      } catch (err) {
        setError('Failed to fetch streams');
      }
      setLoading(false);
    };
    fetchStreams();
    setSelectedStream('');
  }, [selectedClass]);

  const handleAssign = async () => {
    if (!selectedClass || !selectedStream) {
      setError('Please select both class and stream');
      return;
    }
    setAssigning(true);
    setError('');
    try {
      const response = await api.post('/student/student-add', {
        user_id: user.id,
        class_id: selectedClass,
        stream_id: selectedStream,
      });
      if (response.status === 201) {
        toast.success('Student successfully enrolled!');
        setAssigning(false);
        onAssigned(true, 'Student successfully enrolled!');
      } else {
        toast.error(response.data?.message || 'Failed to assign student');
        setError(response.data?.message || 'Failed to assign student');
        setAssigning(false);
        onAssigned(false, response.data?.message || 'Failed to assign student');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign student');
      setError(err.response?.data?.message || 'Failed to assign student');
      setAssigning(false);
      onAssigned(false, err.response?.data?.message || 'Failed to assign student');
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
                <select
                  id="assign-stream"
                  value={selectedStream}
                  onChange={e => setSelectedStream(e.target.value)}
                  disabled={!selectedClass}
                >
                  <option value="">Select Stream</option>
                  {streams
                    .filter(stream => String(stream.class_details.cls_id) === String(selectedClass))
                    .map(stream => (
                      <option key={stream.sid} value={stream.sid}>
                        {stream.sname}
                      </option>
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