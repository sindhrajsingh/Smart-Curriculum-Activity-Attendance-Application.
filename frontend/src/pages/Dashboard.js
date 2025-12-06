import React, { useEffect, useState } from 'react';
import { attendanceAPI, activityAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAttendance: 0,
    totalActivities: 0,
    presentToday: 0,
    avgAttendanceRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [attendanceRes, activitiesRes] = await Promise.all([
        attendanceAPI.getAll({ startDate: today, endDate: today }),
        activityAPI.getAll({ limit: 10 })
      ]);

      const presentCount = attendanceRes.data.data.filter(
        a => a.status === 'Present'
      ).length;

      setStats({
        totalAttendance: attendanceRes.data.total,
        totalActivities: activitiesRes.data.total,
        presentToday: presentCount,
        avgAttendanceRate: 85 // Calculate from actual data
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>📊 Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-value">{stats.totalAttendance}</div>
          <div className="stat-label">Total Attendance Records</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.presentToday}</div>
          <div className="stat-label">Present Today</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{stats.totalActivities}</div>
          <div className="stat-label">Total Activities</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-value">{stats.avgAttendanceRate}%</div>
          <div className="stat-label">Avg Attendance Rate</div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h2>Recent Activity</h2>
          <p>Quick overview of recent attendance and activities...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
