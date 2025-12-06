import React, { useEffect, useState } from 'react';
import { activityAPI } from '../services/api';

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    studentName: '',
    course: '',
    activity: 'Assignment',
    date: '',
    score: '',
    notes: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await activityAPI.getAll();
      const data = res.data.data || res.data;
      setActivities(data);
    } catch (err) {
      console.error('Error loading activities:', err);
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
      await activityAPI.create({
        ...form,
        score: form.score ? Number(form.score) : undefined
      });
      setForm({
        studentName: '',
        course: '',
        activity: 'Assignment',
        date: '',
        score: '',
        notes: ''
      });
      loadData();
    } catch (err) {
      console.error('Error creating activity:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      await activityAPI.delete(id);
      loadData();
    } catch (err) {
      console.error('Error deleting activity:', err);
    }
  };

  if (loading) return <div className="loading">Loading activities...</div>;

  return (
    <div>
      <h1>🎯 Activities</h1>

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
        <select name="activity" value={form.activity} onChange={handleChange}>
          <option>Assignment</option>
          <option>Quiz</option>
          <option>Exam</option>
          <option>Project</option>
          <option>Presentation</option>
          <option>Lab Work</option>
        </select>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="score"
          placeholder="Score (0-100)"
          value={form.score}
          onChange={handleChange}
        />
        <input
          name="notes"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={handleChange}
        />
        <button type="submit" className="btn-success">
          Add Activity
        </button>
      </form>

      <div className="students-grid">
        {activities.map(act => (
          <div key={act._id} className="student-card">
            <h3>{act.studentName}</h3>
            <p>Course: {act.course}</p>
            <p>Activity: {act.activity}</p>
            <p>Date: {new Date(act.date).toLocaleDateString()}</p>
            {act.score != null && <p>Score: {act.score}</p>}
            {act.notes && <p>Notes: {act.notes}</p>}
            <button
              onClick={() => handleDelete(act._id)}
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

export default ActivityList;
