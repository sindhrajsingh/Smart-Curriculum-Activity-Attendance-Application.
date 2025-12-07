import React, { useEffect, useState } from 'react';
import { activityAPI } from '../services/api';

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [form, setForm] = useState({
    studentName: '',
    course: '',
    activity: 'Assignment',
    date: new Date().toISOString().split('T')[0],
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
      setSubmitting(true);
      await activityAPI.create({
        ...form,
        score: form.score ? Number(form.score) : undefined
      });
      setForm({
        studentName: '',
        course: '',
        activity: 'Assignment',
        date: new Date().toISOString().split('T')[0],
        score: '',
        notes: ''
      });
      loadData();
    } catch (err) {
      console.error('Error creating activity:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await activityAPI.delete(id);
      setShowDeleteConfirm(null);
      loadData();
    } catch (err) {
      console.error('Error deleting activity:', err);
    }
  };

  const getActivityIcon = (activity) => {
    const icons = {
      'Assignment': '📝',
      'Quiz': '📋',
      'Exam': '📄',
      'Project': '💼',
      'Presentation': '🎤',
      'Lab Work': '🔬'
    };
    return icons[activity] || '📚';
  };

  const getActivityColor = (activity) => {
    const colors = {
      'Assignment': { bg: '#3B82F6', light: '#DBEAFE', text: '#1E40AF' },
      'Quiz': { bg: '#8B5CF6', light: '#EDE9FE', text: '#5B21B6' },
      'Exam': { bg: '#EF4444', light: '#FEE2E2', text: '#991B1B' },
      'Project': { bg: '#10B981', light: '#D1FAE5', text: '#065F46' },
      'Presentation': { bg: '#F59E0B', light: '#FEF3C7', text: '#92400E' },
      'Lab Work': { bg: '#06B6D4', light: '#CFFAFE', text: '#155E75' }
    };
    return colors[activity] || { bg: '#6B7280', light: '#F3F4F6', text: '#1F2937' };
  };

  const getScoreColor = (score) => {
    if (score >= 90) return { bg: '#10B981', text: '#065F46' };
    if (score >= 80) return { bg: '#3B82F6', text: '#1E40AF' };
    if (score >= 70) return { bg: '#F59E0B', text: '#92400E' };
    if (score >= 60) return { bg: '#F97316', text: '#9A3412' };
    return { bg: '#EF4444', text: '#991B1B' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const calculateStats = () => {
    const totalActivities = activities.length;
    const activitiesWithScores = activities.filter(a => a.score != null);
    const avgScore = activitiesWithScores.length > 0
      ? (activitiesWithScores.reduce((sum, a) => sum + a.score, 0) / activitiesWithScores.length).toFixed(1)
      : 0;
    
    const activityCounts = activities.reduce((acc, a) => {
      acc[a.activity] = (acc[a.activity] || 0) + 1;
      return acc;
    }, {});
    
    const mostCommon = Object.entries(activityCounts).sort((a, b) => b[1] - a[1])[0];
    
    return { totalActivities, avgScore, mostCommon: mostCommon?.[0] || 'N/A' };
  };

  const stats = calculateStats();

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
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <div style={{ fontSize: '48px' }}>🎯</div>
            <div>
              <h1 style={{ margin: 0, fontSize: '36px', color: '#1F2937' }}>
                Student Activities
              </h1>
              <p style={{ margin: '5px 0 0 0', color: '#6B7280', fontSize: '16px' }}>
                Track assignments, quizzes, exams, and projects
              </p>
            </div>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginTop: '20px',
            padding: '20px',
            background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
            borderRadius: '15px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea' }}>
                {stats.totalActivities}
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>Total Activities</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10B981' }}>
                {stats.avgScore}
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>Average Score</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#F59E0B' }}>
                {getActivityIcon(stats.mostCommon)}
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>Most Common</div>
            </div>
          </div>
        </div>

        {/* Add Activity Form */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ margin: '0 0 25px 0', fontSize: '24px', color: '#1F2937' }}>
            ➕ Add New Activity
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Student Name *
                </label>
                <input
                  type="text"
                  name="studentName"
                  placeholder="Enter student name"
                  value={form.studentName}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    fontSize: '16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Course *
                </label>
                <input
                  type="text"
                  name="course"
                  placeholder="Enter course name"
                  value={form.course}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    fontSize: '16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Activity Type *
                </label>
                <select
                  name="activity"
                  value={form.activity}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    fontSize: '16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                >
                  <option value="Assignment">📝 Assignment</option>
                  <option value="Quiz">📋 Quiz</option>
                  <option value="Exam">📄 Exam</option>
                  <option value="Project">💼 Project</option>
                  <option value="Presentation">🎤 Presentation</option>
                  <option value="Lab Work">🔬 Lab Work</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    fontSize: '16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Score (0-100)
                </label>
                <input
                  type="number"
                  name="score"
                  placeholder="Enter score"
                  value={form.score}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    fontSize: '16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151'
              }}>
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                placeholder="Add any additional notes..."
                value={form.notes}
                onChange={handleChange}
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  fontSize: '16px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '15px 40px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'white',
                background: submitting 
                  ? 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '12px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
            >
              {submitting ? '⏳ Adding...' : '➕ Add Activity'}
            </button>
          </form>
        </div>

        {/* Activity Records */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ margin: '0 0 25px 0', fontSize: '24px', color: '#1F2937' }}>
            📊 Activity Records ({activities.length})
          </h2>

          {activities.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#9CA3AF'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎯</div>
              <p style={{ fontSize: '18px', margin: 0 }}>No activities yet</p>
              <p style={{ fontSize: '14px', marginTop: '10px' }}>
                Add your first activity using the form above
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {activities.map(act => {
                const activityColors = getActivityColor(act.activity);
                const scoreColors = act.score != null ? getScoreColor(act.score) : null;
                
                return (
                  <div
                    key={act._id}
                    style={{
                      background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
                      borderRadius: '15px',
                      padding: '20px',
                      borderLeft: `5px solid ${activityColors.bg}`,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      transform: 'translateY(0)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
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
                      alignItems: 'start',
                      marginBottom: '15px'
                    }}>
                      <div>
                        <h3 style={{
                          margin: '0 0 5px 0',
                          fontSize: '20px',
                          color: '#1F2937',
                          fontWeight: 'bold'
                        }}>
                          {act.studentName}
                        </h3>
                        <p style={{
                          margin: 0,
                          fontSize: '14px',
                          color: '#6B7280'
                        }}>
                          📚 {act.course}
                        </p>
                      </div>
                      <div style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: activityColors.text,
                        background: activityColors.light,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        {getActivityIcon(act.activity)} {act.activity}
                      </div>
                    </div>

                    <div style={{
                      padding: '12px',
                      background: 'white',
                      borderRadius: '10px',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        color: '#4B5563'
                      }}>
                        <span>📅</span>
                        <span>{formatDate(act.date)}</span>
                      </div>
                    </div>

                    {act.score != null && (
                      <div style={{
                        padding: '12px',
                        background: 'white',
                        borderRadius: '10px',
                        marginBottom: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '600' }}>
                          Score:
                        </span>
                        <div style={{
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: scoreColors.text,
                          background: scoreColors.bg
                        }}>
                          {act.score}/100
                        </div>
                      </div>
                    )}

                    {act.notes && (
                      <div style={{
                        padding: '12px',
                        background: 'white',
                        borderRadius: '10px',
                        marginBottom: '15px',
                        fontSize: '14px',
                        color: '#4B5563',
                        fontStyle: 'italic'
                      }}>
                        💬 {act.notes}
                      </div>
                    )}

                    {showDeleteConfirm === act._id ? (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleDelete(act._id)}
                          style={{
                            flex: 1,
                            padding: '10px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: 'white',
                            background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          ✓ Confirm Delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          style={{
                            flex: 1,
                            padding: '10px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: '#4B5563',
                            background: 'white',
                            border: '2px solid #E5E7EB',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteConfirm(act._id)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: '#EF4444',
                          background: 'white',
                          border: '2px solid #FEE2E2',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#FEE2E2';
                          e.target.style.color = '#DC2626';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'white';
                          e.target.style.color = '#EF4444';
                        }}
                      >
                        🗑️ Delete Activity
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
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

export default ActivityList;
