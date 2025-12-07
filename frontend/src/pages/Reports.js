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

  const getStatusColor = (status) => {
    const colors = {
      'Present': { bg: '#10B981', light: '#D1FAE5', text: '#065F46', icon: '✓' },
      'Absent': { bg: '#EF4444', light: '#FEE2E2', text: '#991B1B', icon: '✗' },
      'Late': { bg: '#F59E0B', light: '#FEF3C7', text: '#92400E', icon: '⏰' },
      'Excused': { bg: '#3B82F6', light: '#DBEAFE', text: '#1E40AF', icon: '📝' }
    };
    return colors[status] || { bg: '#6B7280', light: '#F3F4F6', text: '#1F2937', icon: '?' };
  };

  const calculatePercentage = (count, total) => {
    return total > 0 ? ((count / total) * 100).toFixed(1) : 0;
  };

  const getAttendanceRating = (rate) => {
    if (rate >= 95) return { text: 'Excellent', color: '#10B981', icon: '🌟' };
    if (rate >= 85) return { text: 'Good', color: '#3B82F6', icon: '👍' };
    if (rate >= 75) return { text: 'Fair', color: '#F59E0B', icon: '⚠️' };
    return { text: 'Needs Improvement', color: '#EF4444', icon: '📉' };
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

  if (!summary) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '60px 40px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📊</div>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#1F2937' }}>
            No Report Data Available
          </h2>
          <p style={{ margin: '10px 0 0 0', color: '#6B7280' }}>
            Add attendance records to generate reports
          </p>
        </div>
      </div>
    );
  }

  const { summary: items, total, attendanceRate } = summary;
  const rating = getAttendanceRating(attendanceRate);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '48px' }}>📈</div>
            <div>
              <h1 style={{ margin: 0, fontSize: '36px', color: '#1F2937' }}>
                Attendance Reports
              </h1>
              <p style={{ margin: '5px 0 0 0', color: '#6B7280', fontSize: '16px' }}>
                Comprehensive attendance analytics and insights
              </p>
            </div>
          </div>
        </div>

        {/* Main Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '25px',
          marginBottom: '30px'
        }}>
          {/* Total Records Card */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            borderLeft: '5px solid #667eea',
            transition: 'all 0.3s ease',
            transform: 'translateY(0)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
          }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>📊</div>
            <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>
              {total}
            </div>
            <div style={{ fontSize: '16px', color: '#6B7280', fontWeight: '600' }}>
              Total Records
            </div>
            <p style={{ margin: '10px 0 0 0', fontSize: '13px', color: '#9CA3AF' }}>
              All attendance entries
            </p>
          </div>

          {/* Attendance Rate Card */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            borderLeft: `5px solid ${rating.color}`,
            transition: 'all 0.3s ease',
            transform: 'translateY(0)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
          }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>{rating.icon}</div>
            <div style={{ fontSize: '42px', fontWeight: 'bold', color: rating.color, marginBottom: '10px' }}>
              {attendanceRate}%
            </div>
            <div style={{ fontSize: '16px', color: '#6B7280', fontWeight: '600' }}>
              Attendance Rate
            </div>
            <div style={{
              marginTop: '10px',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 'bold',
              color: rating.color,
              background: `${rating.color}20`,
              display: 'inline-block'
            }}>
              {rating.text}
            </div>
          </div>

          {/* Progress Card */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            borderLeft: '5px solid #764ba2',
            transition: 'all 0.3s ease',
            transform: 'translateY(0)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
          }}>
            <div style={{ fontSize: '16px', color: '#6B7280', fontWeight: '600', marginBottom: '15px' }}>
              Rate Progress
            </div>
            <div style={{
              width: '100%',
              height: '12px',
              background: '#E5E7EB',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '15px'
            }}>
              <div style={{
                width: `${attendanceRate}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${rating.color} 0%, ${rating.color}dd 100%)`,
                borderRadius: '10px',
                transition: 'width 1s ease'
              }}></div>
            </div>
            <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
              Target: 95% for excellent rating
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ margin: '0 0 25px 0', fontSize: '24px', color: '#1F2937' }}>
            📋 Status Breakdown
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {items.map((item) => {
              const statusColors = getStatusColor(item._id);
              const percentage = calculatePercentage(item.count, total);
              
              return (
                <div
                  key={item._id}
                  style={{
                    background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
                    borderRadius: '15px',
                    padding: '25px',
                    borderLeft: `5px solid ${statusColors.bg}`,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: statusColors.text,
                      background: statusColors.light,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ fontSize: '16px' }}>{statusColors.icon}</span>
                      {item._id}
                    </div>
                  </div>

                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: statusColors.bg, marginBottom: '10px' }}>
                    {item.count}
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>Percentage</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: statusColors.bg }}>
                      {percentage}%
                    </span>
                  </div>

                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#E5E7EB',
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background: statusColors.bg,
                      borderRadius: '10px',
                      transition: 'width 0.8s ease'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Footer */}
        <div style={{
          marginTop: '30px',
          background: 'white',
          borderRadius: '20px',
          padding: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>
            💡 <strong>Tip:</strong> Aim for a 95%+ attendance rate for excellent academic performance
          </p>
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
export default Reports;
