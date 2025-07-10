import React, { useEffect, useState } from 'react';
import api from '../../services/authService';
import { FaPencilAlt, FaTrashAlt, FaUserCircle, FaUserGraduate } from 'react-icons/fa';
import './UserManagement.css';
import toast from 'react-hot-toast';
import ConfirmDialog from './ConfirmDialog';

const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ class_id: '', stream_id: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteStudent, setPendingDeleteStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/student/student-display');
      setStudents(response.data || []);
    } catch (err) {
      setError('Failed to load students');
    }
    setLoading(false);
  };

  const handleEdit = (student) => {
    setEditStudent(student);
    setEditForm({
      class_id: student.user_info.class_info.cls_id,
      stream_id: student.user_info.class_info.stream_info.sid,
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    setEditLoading(true);
    try {
      const updatePayload = {
        user_id: editStudent.user_info.id,
        class_id: Number(editForm.class_id),
        stream_id: Number(editForm.stream_id),
      };
      await api.put(`/student/student-edit/${editStudent.st_id}`, updatePayload);
      toast.success('Student updated successfully!');
      setShowEditModal(false);
      setEditStudent(null);
      setEditForm({ class_id: '', stream_id: '' });
      await fetchStudents();
    } catch (err) {
      toast.error('Failed to update student');
    }
    setEditLoading(false);
  };

  const handleDelete = (student) => {
    setPendingDeleteStudent(student);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteStudent) return;
    try {
      await api.delete(`/student/student-delete/${pendingDeleteStudent.st_id}`);
      toast.success('Student deleted successfully!');
      fetchStudents();
    } catch (err) {
      toast.error('Failed to delete student');
    }
    setConfirmOpen(false);
    setPendingDeleteStudent(null);
  };

  return (
    <div className="user-management">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <FaUserGraduate size={38} color="#377dff" style={{ flexShrink: 0 }} />
          <div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 700, color: '#377dff', margin: 0 }}>Assigned Students</h1>
            <div style={{ color: '#5b6b7a', fontSize: '1.08rem', marginTop: 2 }}>View, edit, and manage assigned students</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* <button className="add-user-btn" style={{ fontWeight: 600, fontSize: 17, padding: '0.7rem 1.7rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaUserPlus style={{ fontSize: 18 }} /> Add Student
          </button> */}
          <div style={{ background: '#f8fafd', borderRadius: 16, padding: '0.7rem 1.5rem', boxShadow: '0 2px 8px rgba(30,34,90,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: '#377dff', fontWeight: 700, fontSize: 22 }}>{students.length}</span>
            <span style={{ color: '#5b6b7a', fontSize: 14 }}>Total Students</span>
          </div>
        </div>
      </div>
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Class</th>
              <th>Stream</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan="5">{error}</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan="5">No assigned students found.</td></tr>
            ) : students.map(student => (
              <tr key={student.st_id}>
                <td>
                  <div className="user-info">
                    <FaUserCircle />
                    <span>{student.user_info.fullname}</span>
                  </div>
                </td>
                <td>{student.user_info.email}</td>
                <td>{student.user_info.class_info.class_name}</td>
                <td>{student.user_info.class_info.stream_info.sname}</td>
                <td style={{ textAlign: 'center' }}>
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      title="Edit student"
                      aria-label="Edit student"
                      onClick={() => handleEdit(student)}
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      className="delete-btn"
                      title="Delete student"
                      aria-label="Delete student"
                      onClick={() => handleDelete(student)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showEditModal && editStudent && (
        <EditStudentModal
          student={editStudent}
          form={editForm}
          setForm={setEditForm}
          onClose={() => { setShowEditModal(false); setEditStudent(null); setEditForm({ class_id: '', stream_id: '' }); }}
          onSave={handleEditSave}
          loading={editLoading}
        />
      )}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); setPendingDeleteStudent(null); }}
        onConfirm={confirmDelete}
        onCancel={() => { setConfirmOpen(false); setPendingDeleteStudent(null); }}
        message="Are you sure you want to delete this student?"
      />
    </div>
  );
};

function EditStudentModal({ student, form, setForm, onClose, onSave, loading }) {
  const [classes, setClasses] = useState([]);
  const [streams, setStreams] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const classRes = await api.get('/class/display');
        setClasses(classRes.data || []);
        if (form.class_id) {
          const streamRes = await api.get(`/stream/display?class_id=${form.class_id}`);
          setStreams(streamRes.data || []);
        } else {
          setStreams([]);
        }
      } catch {}
    };
    fetchData();
  }, [form.class_id]);
  return (
    <div className="modal-overlay">
      <div className="create-user-modal assign-modal">
        <div className="modal-header">
          <h2>Edit Assigned Student</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="student-info">
            <div><strong>Name:</strong> {student.user_info.fullname}</div>
            <div><strong>Email:</strong> {student.user_info.email}</div>
          </div>
          <div className="form-group">
            <label htmlFor="edit-class">Class</label>
            <select
              id="edit-class"
              value={form.class_id}
              onChange={e => setForm(f => ({ ...f, class_id: e.target.value, stream_id: '' }))}
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls.cls_id} value={cls.cls_id}>{cls.class_name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="edit-stream">Stream</label>
            <select
              id="edit-stream"
              value={form.stream_id}
              onChange={e => setForm(f => ({ ...f, stream_id: e.target.value }))}
              disabled={!form.class_id}
            >
              <option value="">Select Stream</option>
              {streams
                .filter(stream => String(stream.class_details?.cls_id) === String(form.class_id))
                .map(stream => (
                  <option key={stream.sid} value={stream.sid}>{stream.sname}</option>
                ))}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="add-btn" onClick={onSave} disabled={loading || !form.class_id || !form.stream_id}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentsManagement; 