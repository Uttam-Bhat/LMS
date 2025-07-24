import api from '../../services/authService';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaSearch, FaStream } from 'react-icons/fa';
import ConfirmDialog from './ConfirmDialog';
import DashboardLayout from './DashboardLayout';
import './StreamManagement.css';

const StreamManagement = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', created: '', classId: '' });
  const [classes, setClasses] = useState([]);
  const [streamList, setStreamList] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const fetchStreams = async () => {
    try {
      const response = await api.get('/stream/display');
      setStreamList(response.data);
    } catch (error) {
      console.error('Error fetching streams', error);
      setStreamList([]);
    }
  };

  useEffect(() => {
    // Fetch classes for dropdown
    const fetchClasses = async () => {
      try {
        const response = await api.get('/class/display');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes', error);
        setClasses([]);
      }
    };

    fetchClasses();
    fetchStreams();
  }, []);

  const openModal = (item) => {
    // Prefer class_id or class_details.cls_id if available
    let clsId = '';
    if (item.class_id) {
      clsId = item.class_id.toString();
    } else if (item.class_details && item.class_details.cls_id) {
      clsId = item.class_details.cls_id.toString();
    } else {
      // fallback to name-based matching
      const itemClassName = item.className || item.class_name || '';
      const matchingClass = classes.find(cls => 
        cls.class_name.toLowerCase() === itemClassName.toLowerCase()
      );
      clsId = matchingClass ? matchingClass.cls_id.toString() : '';
    }

    setEditItem(item);
    setForm({
      name: item.name || item.sname || '',
      description: item.description || item.des || '',
      created: formatDateForInput(item.created || item.cdate),
      classId: clsId
    });

    setShowModal(true);
  };
  
  // helper: format date to yyyy-mm-dd for <input type="date">
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.includes('-') ? dateStr.split('-') : [];
    if (parts.length === 3 && parts[0].length === 4) return dateStr; // already yyyy-mm-dd
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`; // dd-mm-yyyy to yyyy-mm-dd
    return '';
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStream = async () => {
    try {
      const selectedClass = classes.find(cls => cls.cls_id === parseInt(form.classId));
  
      if (!selectedClass) {
        toast('Invalid class selected.');
        return;
      }
  
      // Format the date to dd-mm-yyyy
      const formatDate = (dateStr) => {
        const [yyyy, mm, dd] = dateStr.split('-');
        return `${dd}-${mm}-${yyyy}`;
      };
  
      await api.post('/stream/add', {
        sname: form.name,
        des: form.description,
        cdate: formatDate(form.created),
        class_name: selectedClass.class_name
      });
  
      setShowModal(false);
      setForm({ name: '', description: '', created: '', classId: '' });
  
      // Refresh stream list
      const response = await api.get('/stream/display');
      setStreamList(response.data);
    } catch (error) {
      console.error('Failed to add stream:', error);
      toast.error('Failed to add stream. Please try again.');
    }
  };
  const handleDelete = (id) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };
  const confirmDelete = async () => {
    try {
      await api.delete(`/stream/delete/${pendingDeleteId}`);
      fetchStreams();
      toast.success('Stream deleted successfully!');
    } catch (err) {
      console.error('Error deleting stream:', err);
      toast.error('Failed to delete stream. Please try again.');
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };
  const handleSubmitStream = async () => {
    const selectedClass = classes.find(cls => cls.cls_id === parseInt(form.classId));
    if (!form.name || !form.description || !form.created || !selectedClass || !selectedClass.cls_id) {
      toast('All fields are required.');
      return;
    }

    const payload = {
      sname: form.name,
      des: form.description,
      cdate: formatDateForAPI(form.created),
      class_id: selectedClass.cls_id
    };
    console.log("Submitting stream payload:", payload);

    try {
      if (editItem) {
        // Edit mode
        await api.put(`/stream/edit/${editItem.sid}`, payload);
      } else {
        // Add mode
        await api.post('/stream/add', payload);
      }

      setShowModal(false);
      setForm({ name: '', description: '', created: '', classId: '' });
      setEditItem(null);

      // Refresh list
      const response = await api.get('/stream/display');
      setStreamList(response.data);
    } catch (error) {
      console.error(editItem ? 'Failed to update stream:' : 'Failed to add stream:', error);
      toast.error(`Failed to ${editItem ? 'update' : 'add'} stream. Please try again.`);
    }
  };
  
  // helper: convert yyyy-mm-dd to dd-mm-yyyy
  const formatDateForAPI = (dateStr) => {
    const [yyyy, mm, dd] = dateStr.split('-');
    return `${dd}-${mm}-${yyyy}`;
  };
  const filtered = streamList.filter(s => 
  (s.name || s.sname || '').toLowerCase().includes(search.toLowerCase())
);
const getUniqueClasses = () => {
  const seen = new Set();
  return classes.filter(cls => {
    if (seen.has(cls.class_name)) {
      return false;
    }
    seen.add(cls.class_name);
    return true;
  });
};

  return (
    <DashboardLayout>
      <div className="stream-management-header" style={{ padding: '2rem 0 1rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FaStream size={32} color="#2563eb" />
          <div>
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: '2rem', color: '#2563eb' }}>Manage Streams</h1>
            <div style={{ color: '#6b7280', fontSize: '1rem', fontWeight: 500 }}>Add and manage academic streams</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, maxWidth: 1100, margin: '0 auto 24px auto' }}>
        {/* Filter/search bar and add button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FaSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', fontSize: 18 }} />
            <input
              type="text"
              placeholder="Search streams..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '90%',
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
          {/* Removed the <select> with <option>Name A–Z</option> here */}
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
            onClick={() => { setShowModal(true); setEditItem(null); }}
          >
            <FaPlus /> Add Stream
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
          {streamList.length}
          <div style={{ fontWeight: 500, fontSize: '0.95rem', color: '#64748b', marginTop: 2 }}>Total Streams</div>
        </div>
      </div>
      <div className="stream-management">
        <div className="stream-table-container">
          <table className="stream-table">
            <thead>
              <tr><th>Name</th><th>Description</th><th>Class</th><th>Created</th><th>Action</th></tr>
            </thead>
            <tbody>
            {filtered.map(s => (
  <tr key={s.id || s.sid}>
    <td>{s.sname || s.name || s.stream_name || 'N/A'}</td>
    <td>{s.description || s.des}</td>
    <td>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ background: '#e8f0fe', color: '#2563eb', fontWeight: 600, padding: '2px 10px', borderRadius: 8, fontSize: '0.98rem' }}>
          {s.class_details?.class_name || s.className || s.class_name || 'N/A'}
        </div>
      </div>
    </td>
    <td>{s.created || s.cdate}</td>
    <td>
      <div className="stream-action-buttons">
        <button className="stream-edit-btn" onClick={() => openModal(s)}>Edit</button>
        <button className="stream-delete-btn" onClick={() => handleDelete(s.id || s.sid)}>Delete</button>
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
                <h2>{editItem ? 'Edit Stream' : 'Add Stream'}</h2>
                <button className="stream-close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div>
                <input
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleInputChange}
                />
                <input
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleInputChange}
                />
                <label style={{ fontWeight: 500, marginBottom: 4 }}>Class</label>
                <select
                  name="classId"
                  value={form.classId}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    marginBottom: '1rem',
                    padding: '0.75rem 1rem',
                    border: '1px solid #e1e1e1',
                    borderRadius: 8,
                    fontSize: '1rem',
                    background: '#fff',
                    color: '#1a1a1a',
                    outline: 'none',
                  }}
                  required
                >
                  <option value="">Select Class</option>
                  {getUniqueClasses().map(cls => (
                    <option key={cls.cls_id} value={cls.cls_id}>
                      {cls.class_name}
                    </option>
                  ))}
                </select>
                <label style={{ fontWeight: 500 }}>Created Date</label>
                <input
                  type="date"
                  name="created"
                  value={form.created}
                  onChange={handleInputChange}
                  required
                />
                <button className="add-stream-btn" onClick={handleSubmitStream}>
               {editItem ? 'Save Changes' : 'Add Stream'}
            </button>       
              </div>
            </div>
          </div>
        )}
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Stream?"
        message="Are you sure you want to delete this stream? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => { setConfirmOpen(false); setPendingDeleteId(null); }}
      />
    </DashboardLayout>
  );
};

export default StreamManagement;
