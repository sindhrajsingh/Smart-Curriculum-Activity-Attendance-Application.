import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Students.css';

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    grade: 'Freshman'
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/students', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      setFormData({ firstName: '', lastName: '', email: '', studentId: '', grade: 'Freshman' });
      fetchStudents();
    } catch (error) {
      console.error('Error creating student:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="students-container">
      <div className="header">
        <h1>Students Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Student'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="student-form">
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Student ID"
            value={formData.studentId}
            onChange={(e) => setFormData({...formData, studentId: e.target.value})}
            required
          />
          <select
            value={formData.grade}
            onChange={(e) => setFormData({...formData, grade: e.target.value})}
          >
            <option>Freshman</option>
            <option>Sophomore</option>
            <option>Junior</option>
            <option>Senior</option>
          </select>
          <button type="submit" className="btn-success">Create Student</button>
        </form>
      )}

      <div className="students-grid">
        {students.map(student => (
          <div key={student._id} className="student-card">
            <h3>{student.firstName} {student.lastName}</h3>
            <p>ID: {student.studentId}</p>
            <p>Email: {student.email}</p>
            <p>Grade: {student.grade}</p>
            <p>Status: {student.status}</p>
            <button onClick={() => handleDelete(student._id)} className="btn-danger">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Students;
