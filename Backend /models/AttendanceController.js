const Attendance = require('../models/Attendance');
const { validationResult } = require('express-validator');

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private
exports.getAllAttendance = async (req, res) => {
  try {
    const { startDate, endDate, status, course, studentName, page = 1, limit = 20 } = req.query;
    
    // Build query
    const query = {};
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (status) query.status = status;
    if (course) query.course = new RegExp(course, 'i');
    if (studentName) query.studentName = new RegExp(studentName, 'i');

    // Execute query with pagination
    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('recordedBy', 'username email');

    const count = await Attendance.countDocuments(query);

    res.json({
      success: true,
      count: attendance.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance records',
      error: error.message
    });
  }
};

// @desc    Get single attendance record
// @route   GET /api/attendance/:id
// @access  Private
exports.getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('recordedBy', 'username email');

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance record',
      error: error.message
    });
  }
};

// @desc    Create attendance record
// @route   POST /api/attendance
// @access  Private
exports.createAttendance = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const attendanceData = {
      ...req.body,
      recordedBy: req.user.id
    };

    const attendance = await Attendance.create(attendanceData);

    res.status(201).json({
      success: true,
      message: 'Attendance recorded successfully',
      data: attendance
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating attendance record',
      error: error.message
    });
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private
exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating attendance record',
      error: error.message
    });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting attendance record',
      error: error.message
    });
  }
};

// @desc    Get student attendance history
// @route   GET /api/attendance/student/:studentName
// @access  Private
exports.getStudentAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      studentName: new RegExp(req.params.studentName, 'i')
    }).sort({ date: -1 });

    // Calculate statistics
    const stats = {
      total: attendance.length,
      present: attendance.filter(a => a.status === 'Present').length,
      absent: attendance.filter(a => a.status === 'Absent').length,
      late: attendance.filter(a => a.status === 'Late').length
    };

    stats.attendanceRate = stats.total > 0 
      ? ((stats.present / stats.total) * 100).toFixed(2) 
      : 0;

    res.json({
      success: true,
      studentName: req.params.studentName,
      statistics: stats,
      records: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student attendance',
      error: error.message
    });
  }
};
