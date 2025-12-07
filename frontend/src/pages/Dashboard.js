import React, { useEffect, useState } from 'react';
import { attendanceAPI, activityAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAttendance: 0,
    totalActivities: 0,
    presentToday: 0,
    avgAttendanceRate: 0
  });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [attendanceRes, activitiesRes, recentAttendanceRes, recentActivitiesRes] = await Promise.all([
        attendanceAPI.getAll({ startDate: today, endDate: today }),
        activityAPI.getAll({ limit: 10 }),
        attendanceAPI.getAll({ limit: 5 }),
        activityAPI.getAll({ limit: 5 })
      ]);

      const presentCount = attendanceRes.data.data.filter(
        a => a.status === 'Present'
      ).length;

      const totalRecords = attendanceRes.data.total;
      const attendanceRate = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : 0;

      setStats({
        totalAttendance: attendanceRes.data.total,
        totalActivities: activitiesRes.data.total,
        presentToday: presentCount,
        avgAttendanceRate: attendanceRate
      });

      setRecentAttendance(recentAttendanceRes.data.data || []);
      setRecentActivities(recentActivitiesRes.data.data || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Present': return '#10B981';
      case 'Absent': return '#EF4444';
      case 'Late': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '5px solid rgba(255,255,255,0.3)',
          borderTop: '5px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Welcome Section */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px'
            }}>
              👤
            </div>
            <div>
              <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#1F2937' }}>
                Welcome back, {user?.fullName || user?.username}! 👋
              </h1>
              <p style={{ margin: 0, color: '#6B7280', fontSize: '16px' }}>
                Here's what's happening with your curriculum today
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            padding: '30px',
            color: 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📋</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '5px' }}>
              {stats.totalAttendance}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Attendance Records</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            borderRadius: '20px',
            padding: '30px',
            color: 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '5px' }}>
              {stats.presentToday}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Present Today</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            borderRadius: '20px',
            padding: '30px',
            color: 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎯</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '5px' }}>
              {stats.totalActivities}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Activities</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            borderRadius: '20px',
            padding: '30px',
            color: 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📈</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '5px' }}>
              {stats.avgAttendanceRate}%
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Avg Attendance Rate</div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Recent Attendance */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '25px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '22px', color: '#1F2937' }}>
              📋 Recent Attendance
            </h2>
            {recentAttendance.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {recentAttendance.slice(0, 5).map((record) => (
                  <div key={record._id} style={{
                    padding: '15px',
                    background: '#F9FAFB',
                    borderRadius: '12px',
                    borderLeft: `4px solid ${getStatusColor(record.status)}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#1F2937', marginBottom: '5px' }}>
                          {record.studentName}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6B7280' }}>
                          {record.course}
                        </div>
                      </div>
                      <div style={{
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: 'white',
                        background: getStatusColor(record.status)
                      }}>
                        {record.status}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '8px' }}>
                      {formatDate(record.date)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#6B7280', textAlign: 'center', padding: '20px' }}>
                No attendance records yet
              </p>
            )}
          </div>

          {/* Recent Activities */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '25px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '22px', color: '#1F2937' }}>
              🎯 Recent Activities
            </h2>
            {recentActivities.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {recentActivities.slice(0, 5).map((activity) => (
                  <div key={activity._id} style={{
                    padding: '15px',
                    background: '#F9FAFB',
                    borderRadius: '12px',
                    borderLeft: '4px solid #667eea'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#1F2937', marginBottom: '5px' }}>
                          {activity.studentName}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6B7280' }}>
                          {activity.activity} - {activity.course}
                        </div>
                      </div>
                      {activity.grade && (
                        <div style={{
                          padding: '5px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: 'white',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}>
                          {activity.grade}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '8px' }}>
                      {formatDate(activity.date)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#6B7280', textAlign: 'center', padding: '20px' }}>
                No activities recorded yet
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <Link to="/students" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
              borderRadius: '20px',
              padding: '25px',
              color: 'white',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              transform: 'translateY(0)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>👨‍🎓</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Manage Students</div>
            </div>
          </Link>

          <Link to="/reports" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
              borderRadius: '20px',
              padding: '25px',
              color: 'white',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              transform: 'translateY(0)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>📊</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>View Reports</div>
            </div>
          </Link>

          <Link to="/attendance" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
              borderRadius: '20px',
              padding: '25px',
              color: 'white',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              transform: 'translateY(0)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>📅</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Attendance History</div>
            </div>
          </Link>

          <Link to="/activities" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
              borderRadius: '20px',
              padding: '25px',
              color: 'white',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              transform: 'translateY(0)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎯</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Activity Log</div>
            </div>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
export default Dashboard;
