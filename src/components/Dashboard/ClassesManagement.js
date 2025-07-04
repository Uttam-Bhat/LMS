import axios from 'axios';
import { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import './StreamManagement.css';
import { FaChalkboardTeacher, FaSearch, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ConfirmDialog from './ConfirmDialog';

const ClassesManagement = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ class_name: '', des: '', section: '', cdate: '' });
  const [classes, setClasses] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

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
      toast('Please fill in all fields');
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
        toast('No changes to save.');
        return;
      }
      try {
        await axios.put(`http://localhost:3000/api/class/edit/${editItem.cls_id}`, changedFields);
        setClasses(prev =>
          prev.map(cls =>
            cls.cls_id === editItem.cls_id ? { ...cls, ...changedFields } : cls
          )
        );
        toast.success('Class updated successfully');
        setShowModal(false);
        setEditItem(null);
        setForm({ class_name: '', des: '', section: '', cdate: '' });
      } catch (error) {
        console.error('Failed to save class:', error);
        toast.error('Failed to save class. Please check console for error.');
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
        toast.success('Class added successfully');
        setShowModal(false);
        setEditItem(null);
        setForm({ class_name: '', des: '', section: '', cdate: '' });
      } catch (error) {
        console.error('Failed to save class:', error);
        toast.error('Failed to save class. Please check console for error.');
        setForm({ class_name: '', des: '', section: '', cdate: '' });
      }
    }
  };

  const handleDelete = (id) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/class/delete/${pendingDeleteId}`);
      fetchClasses();
      toast.success('Class deleted successfully!');
    } catch (err) {
      console.error('Error deleting class:', err);
      toast.error('Failed to delete class. Please try again.');
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

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

  useEffect(() => {
    fetchClasses();
  }, []);

  const filtered = classes.filter(s =>
    s.class_name && s.class_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="class-management-header" style={{ padding: '2rem 0 1rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FaChalkboardTeacher size={32} color="#2563eb" />
          <div>
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: '2rem', color: '#2563eb' }}>Manage Classes</h1>
            <div style={{ color: '#6b7280', fontSize: '1rem', fontWeight: 500 }}>Add and manage academic classes</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, maxWidth: 1100, margin: '0 auto 24px auto' }}>
        {/* Filter/search bar and add button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FaSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
            <input
              type="text"
              placeholder="Search classes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: '1rem',
                background: '#f9fafb',
                color: '#1a1a1a',
                outline: 'none',
              }}
            />
          </div>
          <select
            value={''}
            onChange={() => {}}
            style={{
              minWidth: 140,
              padding: '0.75rem 1rem',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              fontSize: '1rem',
              background: '#f9fafb',
              color: '#1a1a1a',
              outline: 'none',
            }}
            disabled
          >
            <option>Name A–Z</option>
          </select>
          <button
            className="add-stream-btn"
            style={{
              background: '#2563eb',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1.1rem',
              border: 'none',
              borderRadius: 10,
              padding: '0.75rem 2rem',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 2px 8px #2563eb22',
              cursor: 'pointer',
            }}
            onClick={() => openModal(null)}
          >
            <FaPlus /> Add Class
          </button>
        </div>
        {/* Count box */}
        <div style={{
          minWidth: 110,
          minHeight: 70,
          background: '#f1f5f9',
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px #0001',
          fontWeight: 700,
          fontSize: '1.5rem',
          color: '#2563eb',
        }}>
          {classes.length}
          <div style={{ fontWeight: 500, fontSize: '0.95rem', color: '#64748b', marginTop: 2 }}>Total Classes</div>
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

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Class?"
        message="Are you sure you want to delete this class? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => { setConfirmOpen(false); setPendingDeleteId(null); }}
      />
    </DashboardLayout>
  );
};

export default ClassesManagement;
