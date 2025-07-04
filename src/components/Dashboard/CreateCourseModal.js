import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './CreateCourseModal.css';
import toast from 'react-hot-toast';

const CreateCourseModal = ({ onClose, onCourseAdded }) => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    coursename: '',
    course_type: '',
    ass_teacher: '',
    start_date: '',
    end_date: '',
    des: ''
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

  const formatDateForBackend = (dateStr) => {
    if (!dateStr) return '';
    const [yyyy, mm, dd] = dateStr.split('-');
    return `${dd}-${mm}-${yyyy}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      coursename: formData.coursename,
      course_type: formData.course_type,
      ass_teacher: formData.ass_teacher,
      start_date: formatDateForBackend(formData.start_date),
      end_date: formatDateForBackend(formData.end_date),
      des: formData.des
    };

    console.log(payload);

    try {
      const response = await axios.post('http://localhost:3000/api/course/add', payload);
      console.log('Course created:', response.data);
      toast.success('Course created successfully!');
      // Map backend response to UI structure if needed
      const newCourse = {
        courseId: response.data.courseId || Date.now(),
        coursename: payload.coursename,
        course_type: payload.course_type,
        ass_teacher: payload.ass_teacher,
        start_date: payload.start_date,
        end_date: payload.end_date,
        des: payload.des,
        students: 0,
        completion: 0,
        status: 'active'
      };
      onCourseAdded && onCourseAdded(newCourse); // update UI
      onClose();
    } catch (error) {
      console.error('Failed to create course:', error);
      toast.error('Course creation failed. Check console for details.');
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
            <label htmlFor="coursename">Course Name</label>
            <input
              type="text"
              id="coursename"
              name="coursename"
              value={formData.coursename}
              onChange={handleChange}
              placeholder="Enter course name"
              required
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
                  onChange={handleChange}
                  required
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
            <input
              type="text"
              id="des"
              name="des"
              value={formData.des}
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