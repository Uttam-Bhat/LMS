import axios from 'axios';
import { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import './StreamManagement.css';

const ClassesManagement = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ class_name: '', des: '', section: '', cdate: '' });
  const [classes, setClasses] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  // Utility to convert yyyy-MM-dd to dd-MM-yyyy for backend
  const formatDateForBackend = (dateStr) => {
    if (!dateStr) return '';
    const [yyyy, mm, dd] = dateStr.split('-');
    return `${dd}-${mm}-${yyyy}`;
  };
  // Utility to convert dd-MM-yyyy to yyyy-MM-dd for input
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const [dd, mm, yyyy] = dateStr.split('-');
    if (yyyy && mm && dd) return `${yyyy}-${mm}-${dd}`;
    return dateStr;
  };

  const openModal = (item) => {
    setEditItem(item);
    setForm(
      item
        ? {
            class_name: item.class_name || '',
            des: item.des || '',
            section: item.section || '',
            cdate: formatDateForInput(item.cdate || ''),
          }
        : { class_name: '', des: '', section: '', cdate: '' }
    );
    setShowModal(true);
    setStatusMessage('');
  };

  const handleSave = async () => {
    if (!form.class_name || !form.des || !form.section || !form.cdate) {
      alert('Please fill in all fields');
      return;
    }

    if (editItem) {
      // Only send changed fields for edit
      const changedFields = {};
      if (form.class_name !== editItem.class_name) changedFields.class_name = form.class_name;
      if (form.des !== editItem.des) changedFields.des = form.des;
      if (form.section !== editItem.section) changedFields.section = form.section;
      if (form.cdate !== editItem.cdate) changedFields.cdate = formatDateForBackend(form.cdate);
      if (Object.keys(changedFields).length === 0) {
        alert('No changes to save.');
        return;
      }
      try {
        await axios.put(`http://localhost:3000/api/class/edit/${editItem.cls_id}`, changedFields);
        setClasses(prev =>
          prev.map(cls =>
            cls.cls_id === editItem.cls_id ? { ...cls, ...changedFields } : cls
          )
        );
        alert('Class updated successfully');
        setShowModal(false);
        setEditItem(null);
        setForm({ class_name: '', des: '', section: '', cdate: '' });
      } catch (error) {
        console.error('Failed to save class:', error);
        alert('Failed to save class. Please check console for error.');
        setForm({ class_name: '', des: '', section: '', cdate: '' });
      }
    } else {
      // ADD: New class
      const payload = {
        class_name: form.class_name,
        des: form.des,
        section: form.section,
        cdate: formatDateForBackend(form.cdate),
      };
      try {
        const response = await axios.post('http://localhost:3000/api/class/add', payload);
        const newClass = {
          ...payload,
          cls_id: response.data.cls_id || Date.now(),
        };
        setClasses(prev => [...prev, newClass]);
        alert('Class added successfully');
        setShowModal(false);
        setEditItem(null);
        setForm({ class_name: '', des: '', section: '', cdate: '' });
      } catch (error) {
        console.error('Failed to save class:', error);
        alert('Failed to save class. Please check console for error.');
        setForm({ class_name: '', des: '', section: '', cdate: '' });
      }
    }
  };

  const handleDelete = async (cls_id) => {
    try {
      await axios.delete(`http://localhost:3000/api/class/delete/${cls_id}`);
      setClasses(prev => prev.filter(cls => cls.cls_id !== cls_id));
      setStatusMessage('Class deleted successfully.');
    } catch (error) {
      console.error('Error deleting class:', error);
      setStatusMessage('Failed to delete class.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/class/display');
        // Ensure every class object has a cls_id property and map start_date/end_date
        const dataWithIds = (response.data || []).map((cls, idx) => ({
          ...cls,
          cls_id: cls.cls_id || cls.id || cls._id || idx + 1, // fallback to id/_id or index
          start_date: cls.start_date || '',
          end_date: cls.end_date || '',
          des: cls.des || '',
          cdate: cls.cdate || '',
        }));
        setClasses(dataWithIds);
      } catch (error) {
        console.error('Failed to fetch classes:', error);
      }
    };
    fetchClasses();
  }, []);

  const filtered = classes.filter(s =>
    s.class_name && s.class_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="stream-management">
        <div className="stream-header">
          <h1>Manage Classes</h1>
          <button className="add-stream-btn" onClick={() => openModal(null)}>
            Add Class
          </button>
        </div>

        <div className="stream-filters">
          <div className="stream-search-box">
            <input
              type="text"
              placeholder="Search classes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {statusMessage && <p className="status-message">{statusMessage}</p>}

        <div className="stream-table-container">
          <table className="stream-table">
            <thead>
              <tr>
                <th>Class Name</th>
                <th>Description</th>
                <th>Section</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.cls_id}>
                  <td>{s.class_name}</td>
                  <td>{s.des}</td>
                  <td>{s.section}</td>
                  <td>{s.cdate}</td>
                  <td>
                    <div className="stream-action-buttons">
                      <button className="stream-edit-btn" onClick={() => openModal(s)}>
                        Edit
                      </button>
                      <button
                        className="stream-delete-btn"
                        onClick={() => handleDelete(s.cls_id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="stream-modal-overlay">
            <div className="stream-modal">
              <div className="stream-modal-header">
                <h2>{editItem ? 'Edit Class' : 'Add Class'}</h2>
                <button className="stream-close-btn" onClick={() => setShowModal(false)}>
                  ×
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  name="class_name"
                  placeholder="Class Name"
                  value={form.class_name}
                  onChange={handleInputChange}
                  style={{ fontWeight: 500 }}
                  required
                />
                <input
                  name="des"
                  placeholder="Description"
                  value={form.des}
                  onChange={handleInputChange}
                  required
                />
                <input
                  name="section"
                  placeholder="Section (e.g. A, B, C)"
                  value={form.section}
                  onChange={handleInputChange}
                  required
                />
                <label style={{ fontWeight: 500 }}>Created Date</label>
                <input
                  type="date"
                  name="cdate"
                  value={form.cdate}
                  onChange={handleInputChange}
                  required
                />
                <button
                  className="add-stream-btn"
                  style={{ marginTop: '0.5rem' }}
                  onClick={handleSave}
                >
                  {editItem ? 'Save Changes' : 'Add Class'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClassesManagement;
