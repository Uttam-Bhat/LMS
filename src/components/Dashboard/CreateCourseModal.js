import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './CreateCourseModal.css';

const CreateCourseModal = ({ onClose, onCourseAdded }) => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    teacher: '',
    description: '',
    courseType: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
useEffect(() => {
  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/course/teachers');
      setTeachers(response.data);
      console.log("Fetched data:", response.data);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
    }
  };

  fetchTeachers();
}, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert yyyy-mm-dd to dd-mm-yyyy
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const [yyyy, mm, dd] = dateStr.split('-');
      return `${dd}-${mm}-${yyyy}`;
    };

    const payload = {
      coursename: formData.name,
      course_type: formData.courseType,
      ass_teacher: formData.teacher,
      start_date: formatDate(formData.startDate),
      end_date: formatDate(formData.endDate),
      des: formData.description
    };
console.log(payload);
    try {
      const response = await axios.post('http://localhost:3000/api/course/add', payload);
      console.log('Course created:', response.data);
      alert('Course created successfully!');
      // Map backend response to UI structure if needed
      const newCourse = {
        id: response.data.courseId || Date.now(),
        name: payload.coursename,
        teacher: teachers.find(t => t.id == payload.ass_teacher)?.fullname || '',
        students: 0,
        completion: 0,
        status: 'active',
        ...payload
      };
      onCourseAdded && onCourseAdded(newCourse); // update UI
      onClose();
    } catch (error) {
      console.error('Failed to create course:', error);
      alert('Course creation failed. Check console for details.');
    }
  };
  return (
    <div className="modal-overlay">
      <div className="create-course-modal">
        <div className="modal-header">
          <h2>Create New Course</h2>
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
              name="name"
             value={formData.name}  
              onChange={handleChange}
              placeholder="Enter course name"
              required
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
            <select
  id="teacher"
  name="teacher"
  value={formData.teacher}
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
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
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
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter course description"
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="create-btn">
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseModal; 