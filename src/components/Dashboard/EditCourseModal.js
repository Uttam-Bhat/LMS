import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './CreateCourseModal.css';

const EditCourseModal = ({ onClose, course, onUpdate }) => {
  const [formData, setFormData] = useState({
    courseName: '',
    courseType: '',
    teacher: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  useEffect(() => {
    if (course) {
      setFormData({
        courseName: course.name || '',
        courseType: course.courseType || '',
        teacher: course.teacher || '',
        startDate: course.startDate || '',
        endDate: course.endDate || '',
        description: course.description || ''
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Course updated:', formData);
    onUpdate && onUpdate(formData);
    onClose();
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
            <label htmlFor="courseName">Course Name</label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              value={formData.courseName}
              readOnly
              className="readonly-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="courseType">Course Type</label>
            <select
              id="courseType"
              name="courseType"
              value={formData.courseType}
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
            <label htmlFor="teacher">Assign Teacher</label>
            <input
              type="text"
              id="teacher"
              name="teacher"
              value={formData.teacher}
              readOnly
              className="readonly-field"
            />
          </div>

          <div className="form-group">
            <label>Course Duration</label>
            <div className="date-inputs">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  readOnly
                  className="readonly-field"
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Course Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
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