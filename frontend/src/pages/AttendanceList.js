import React, { useEffect, useState } from 'react';
import { attendanceAPI } from '../services/api';

const AttendanceList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    studentName: '',
    course: '',
    date: '',
    status: 'Present',
    notes: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await attendanceAPI.getAll();
      // backend returns { success, data, total } – handle accordingly
      const data = res.data.data || res.data;
      setRecords(data);
    } catch (err) {
      console.error('Error loading attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await attendanceAPI.create(form);
      setForm({
        studentName: '',
        course: '',
        date: '',
        status: 'Present',
        notes: ''
      });
      loadData();
    } catch (err) {
      console.error('Error creating attendance:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await attendanceAPI.delete(id);
      loadData();
    } catch (err) {
      console.error('Error deleting attendance:', err);
    }
  };

  if (loading) return <div className="loading">Loading attendance...</div>;

  return (
    <div>
      <h1>📋 Attendance</h1>

      <form onSubmit={handleSubmit} className="student-form" style={{ marginBottom: 20 }}>
        <input
          name="studentName"
          placeholder="Student Name"
          value={form.studentName}
          onChange={handleChange}
          required
        />
        <input
          name="course"
          placeholder="Course"
          value={form.course}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option>Present</option>
          <option>Absent</option>
          <option>Late</option>
        </select>
        <input
          name="notes"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={handleChange}
        />
        <button type="submit" className="btn-success">
          Add Attendance
        </button>
      </form>

      <div className="students-grid">
        {records.map(rec => (
          <div key={rec._id} className="student-card">
            <h3>{rec.studentName}</h3>
            <p>Course: {rec.course}</p>
            <p>Date: {new Date(rec.date).toLocaleDateString()}</p>
            <p>Status: {rec.status}</p>
            {rec.notes && <p>Notes: {rec.notes}</p>}
            <button
              onClick={() => handleDelete(rec._id)}
              className="btn-danger"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceList;
