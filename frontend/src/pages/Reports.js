import React, { useEffect, useState } from 'react';
import { reportsAPI } from '../services/api';

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const res = await reportsAPI.getAttendanceSummary();
      setSummary(res.data.data || res.data);
    } catch (err) {
      console.error('Error loading reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  if (loading) return <div className="loading">Loading reports...</div>;

  if (!summary) return <div>No report data available.</div>;

  const { summary: items, total, attendanceRate } = summary;

  return (
    <div>
      <h1>📈 Reports</h1>
      <p>Total records: {total}</p>
      <p>Attendance rate: {attendanceRate}%</p>

      <h3>Status breakdown</h3>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item._id}: {item.count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reports;
