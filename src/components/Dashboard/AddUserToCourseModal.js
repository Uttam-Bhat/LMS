import React, { useState, useEffect } from 'react';
import { FaTimes, FaSearch, FaUserPlus } from 'react-icons/fa';
import './CreateCourseModal.css';
import api from '../../services/authService';
import toast from 'react-hot-toast';

const AddUserToCourseModal = ({ onClose, course, onUpdate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [enrolledStudentIds, setEnrolledStudentIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentsAndEnrollments = async () => {
      setLoading(true);
      try {
        const res = await api.get('/student/student-display');
        const mapped = (res.data || []).map(s => ({
          id: s.user_info.id,
          st_id: s.st_id,
          name: s.user_info.fullname,
          email: s.user_info.email,
          class: s.user_info.class_info?.class_name || ''
        }));
        setAvailableStudents(mapped);
        // Fetch enrollments for this course
        if (course && course.courseId) {
          const enrollRes = await api.get('/enroll/enroll-display');
          const enrolled = (enrollRes.data || []).filter(e => String(e.course_info.cid) === String(course.courseId));
          setEnrolledStudentIds(enrolled.map(e => String(e.st_id)));
        }
      } catch (err) {
        toast.error('Failed to fetch students or enrollments');
        setAvailableStudents([]);
        setEnrolledStudentIds([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentsAndEnrollments();
  }, [course]);

  const filteredStudents = availableStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStudentSelect = (student) => {
    if (enrolledStudentIds.includes(String(student.st_id))) {
      toast.error('Student already enrolled in this course');
      return;
    }
    if (selectedStudents.find(s => s.id === student.id)) {
      setSelectedStudents(selectedStudents.filter(s => s.id !== student.id));
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const handleRemoveStudent = (studentId) => {
    setSelectedStudents(selectedStudents.filter(s => s.id !== studentId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!course || !course.courseId) return;
    let successCount = 0;
    let errorCount = 0;
    for (const student of selectedStudents) {
      if (enrolledStudentIds.includes(String(student.st_id))) {
        toast.error(`Student ${student.name} already enrolled in this course`);
        continue;
      }
      try {
        await api.post('/enroll/enroll-add', {
          student_id: student.st_id,
          course_id: course.courseId
        });
        successCount++;
      } catch (err) {
        errorCount++;
      }
    }
    if (successCount > 0) toast.success(`${successCount} student(s) enrolled to ${course.coursename}`);
    if (errorCount > 0) toast.error(`${errorCount} failed to enroll`);
    onUpdate && onUpdate(selectedStudents);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="create-course-modal" style={{ maxWidth: '800px', width: '90%' }}>
        <div className="modal-header">
          <h2>Add Students to Course</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div style={{ padding: '1rem 0' }}>
          <h3 style={{ marginBottom: '1rem', color: '#1877f2' }}>
            Course: {course?.coursename || 'Unknown Course'}
          </h3>
          <div className="form-group">
            <label>Search Students</label>
            <div style={{ position: 'relative' }}>
              <FaSearch style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#666' 
              }} />
              <input
                type="text"
                placeholder="Search by name, email, or class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            {/* Available Students */}
            <div>
              <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>Available Students</h4>
              <div style={{ 
                maxHeight: '300px', 
                overflowY: 'auto', 
                border: '1px solid #e1e1e1', 
                borderRadius: '8px',
                padding: '0.5rem'
              }}>
                {loading ? (
                  <p style={{ textAlign: 'center', color: '#666', padding: '1rem' }}>Loading...</p>
                ) : filteredStudents.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666', padding: '1rem' }}>
                    No students found
                  </p>
                ) : (
                  filteredStudents.map(student => (
                    <div
                      key={student.id}
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #e1e1e1',
                        borderRadius: '6px',
                        marginBottom: '0.5rem',
                        cursor: enrolledStudentIds.includes(String(student.st_id)) ? 'not-allowed' : 'pointer',
                        backgroundColor: selectedStudents.find(s => s.id === student.id) ? '#e7f0fe' : (enrolledStudentIds.includes(String(student.st_id)) ? '#f8d7da' : 'white'),
                        transition: 'background-color 0.2s',
                        opacity: enrolledStudentIds.includes(String(student.st_id)) ? 0.6 : 1
                      }}
                      onClick={() => handleStudentSelect(student)}
                    >
                      <div style={{ fontWeight: '500', color: '#1a1a1a' }}>
                        {student.name}
                        {enrolledStudentIds.includes(String(student.st_id)) && (
                          <span style={{ color: '#d32f2f', fontSize: '0.85rem', marginLeft: 8 }}>(Already Enrolled)</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        {student.email} • {student.class}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Selected Students */}
            <div>
              <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>
                Selected Students ({selectedStudents.length})
              </h4>
              <div style={{ 
                maxHeight: '300px', 
                overflowY: 'auto', 
                border: '1px solid #e1e1e1', 
                borderRadius: '8px',
                padding: '0.5rem',
                backgroundColor: '#f8f9fa'
              }}>
                {selectedStudents.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666', padding: '1rem' }}>
                    No students selected
                  </p>
                ) : (
                  selectedStudents.map(student => (
                    <div
                      key={student.id}
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #e1e1e1',
                        borderRadius: '6px',
                        marginBottom: '0.5rem',
                        backgroundColor: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '500', color: '#1a1a1a' }}>
                          {student.name}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>
                          {student.email} • {student.class}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveStudent(student.id)}
                        style={{
                          background: '#fee7e7',
                          color: '#f21818',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.25rem 0.5rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="button" 
            className="create-btn"
            onClick={handleSubmit}
            disabled={selectedStudents.length === 0}
            style={{ 
              opacity: selectedStudents.length === 0 ? 0.6 : 1,
              cursor: selectedStudents.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <FaUserPlus style={{ marginRight: '0.5rem' }} />
            Add {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserToCourseModal; 