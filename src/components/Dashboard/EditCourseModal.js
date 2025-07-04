import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './CreateCourseModal.css';
import axios from 'axios';
import toast from 'react-hot-toast';

const EditCourseModal = ({ onClose, course, onUpdate }) => {
  const [formData, setFormData] = useState({
    coursename: '',
    course_type: '',
    ass_teacher: '',
    start_date: '',
    end_date: '',
    des: ''
  });

  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    if (course) {
      setFormData({
        courseId: course.courseId,
        coursename: course.coursename || '',
        course_type: course.course_type || '',
        ass_teacher: course.ass_teacher || '',
        start_date: formatDateForInput(course.start_date || ''),
        end_date: formatDateForInput(course.end_date || ''),
        des: course.des || ''
      });
    }
  }, [course]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/course/teachers');
        setTeachers(response.data);
      } catch (error) {
        setTeachers([]);
      }
    };
    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const formatDateForBackend = (dateStr) => {
    if (!dateStr) return '';
    const [yyyy, mm, dd] = dateStr.split('-');
    return `${dd}-${mm}-${yyyy}`;
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const [dd, mm, yyyy] = dateStr.split('-');
    if (yyyy && mm && dd) return `${yyyy}-${mm}-${dd}`;
    return dateStr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.courseId) {
      toast.error('Error: Course ID is missing. Cannot update this course.');
      return;
    }
    const payload = {
      ...formData,
      start_date: formatDateForBackend(formData.start_date),
      end_date: formatDateForBackend(formData.end_date)
    };
    
    try {
      // Call the backend API to update the course
      const response = await axios.put(`http://localhost:3000/api/course/edit/${formData.courseId}`, payload);
      
      if (response.status === 200) {
        // Call the onUpdate callback to update the parent component
        onUpdate && onUpdate(payload);
        toast.success('Course updated successfully!');
        onClose();
      }
    } catch (error) {
      console.error('Failed to update course:', error);
      toast.error('Failed to update course. Please try again.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="create-course-modal">
        <div className="modal-header">
          <h2>Edit Course</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="coursename">Course Name</label>
            <input
              type="text"
              id="coursename"
              name="coursename"
              value={formData.coursename}
              readOnly
              className="readonly-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="course_type">Course Type</label>
            <select
              id="course_type"
              name="course_type"
              value={formData.course_type}
              onChange={handleChange}
              required
            >
              <option value="">Select course type</option>
              <option value="certified">Certified</option>
              <option value="non-certified">Non-Certified</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="ass_teacher">Assign Teacher</label>
            <select
              id="ass_teacher"
              name="ass_teacher"
              value={formData.ass_teacher}
              onChange={handleChange}
              required
            >
              <option value="">Select teacher</option>
              {teachers.map(teacher => (
                <option key={teacher.id || teacher._id} value={teacher.id || teacher._id}>
                  {teacher.fullname || teacher.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Course Duration</label>
            <div className="date-inputs">
              <div className="form-group">
                <label htmlFor="start_date">Start Date</label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  readOnly
                  className="readonly-field"
                />
              </div>
              <div className="form-group">
                <label htmlFor="end_date">End Date</label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="des">Course Description</label>
            <textarea
              id="des"
              name="des"
              value={formData.des}
              onChange={handleChange}
              placeholder="Enter course description"
              required
              rows="3"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="create-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourseModal; 