const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const Activity = require('../models/Activity');

// @desc    Get attendance summary
// @route   GET /api/reports/attendance-summary
// @access  Private
router.get('/attendance-summary', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const summary = await Attendance.aggregate([
      ...(Object.keys(dateFilter).length > 0 ? [{ $match: { date: dateFilter } }] : []),
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = summary.reduce((acc, curr) => acc + curr.count, 0);
    const present = summary.find(s => s._id === 'Present')?.count || 0;
    const attendanceRate = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        summary,
        total,
        attendanceRate: parseFloat(attendanceRate)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating report',
      error: error.message
    });
  }
});

// @desc    Get student report
// @route   GET /api/reports/student/:studentId
// @access  Private
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const attendance = await Attendance.find({ studentId }).sort({ date: -1 });
    const activities = await Activity.find({ studentId }).sort({ date: -1 });

    const attendanceStats = {
      total: attendance.length,
      present: attendance.filter(a => a.status === 'Present').length,
      absent: attendance.filter(a => a.status === 'Absent').length,
      late: attendance.filter(a => a.status === 'Late').length
    };

    const activityStats = await Activity.getStudentAverage(studentId);

    res.json({
      success: true,
      data: {
        attendance: attendanceStats,
        activities: activityStats,
        recentAttendance: attendance.slice(0, 10),
        recentActivities: activities.slice(0, 10)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating student report',
      error: error.message
    });
  }
});

// @desc    Get course report
// @route   GET /api/reports/course/:courseId
// @access  Private
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const attendanceCount = await Attendance.countDocuments({ course: courseId });
    const activitiesCount = await Activity.countDocuments({ course: courseId });

    const courseActivities = await Activity.find({ course: courseId });
    const avgScore = courseActivities.length > 0
      ? courseActivities.reduce((acc, act) => acc + (act.score || 0), 0) / courseActivities.length
      : 0;

    res.json({
      success: true,
      data: {
        course: courseId,
        totalAttendance: attendanceCount,
        totalActivities: activitiesCount,
        averageScore: avgScore.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating course report',
      error: error.message
    });
  }
});

module.exports = router;
