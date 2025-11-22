const Activity = require('../models/Activity');
const { validationResult } = require('express-validator');

// @desc    Get all activities
// @route   GET /api/activities
// @access  Private
exports.getAllActivities = async (req, res) => {
  try {
    const { startDate, endDate, activity, course, studentName, page = 1, limit = 20 } = req.query;
    
    const query = {};
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (activity) query.activity = activity;
    if (course) query.course = new RegExp(course, 'i');
    if (studentName) query.studentName = new RegExp(studentName, 'i');

    const activities = await Activity.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('recordedBy', 'username email');

    const count = await Activity.countDocuments(query);

    res.json({
      success: true,
      count: activities.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching activities',
      error: error.message
    });
  }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Private
exports.getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('recordedBy', 'username email');

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching activity',
      error: error.message
    });
  }
};

// @desc    Create activity
// @route   POST /api/activities
// @access  Private
exports.createActivity = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const activityData = {
      ...req.body,
      recordedBy: req.user.id
    };

    const activity = await Activity.create(activityData);

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: activity
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating activity',
      error: error.message
    });
  }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private
exports.updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.json({
      success: true,
      message: 'Activity updated successfully',
      data: activity
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating activity',
      error: error.message
    });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting activity',
      error: error.message
    });
  }
};

// @desc    Get student activities
// @route   GET /api/activities/student/:studentName
// @access  Private
exports.getStudentActivities = async (req, res) => {
  try {
    const activities = await Activity.find({
      studentName: new RegExp(req.params.studentName, 'i')
    }).sort({ date: -1 });

    const stats = await Activity.getStudentAverage(req.params.studentName);

    res.json({
      success: true,
      studentName: req.params.studentName,
      statistics: stats,
      records: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student activities',
      error: error.message
    });
  }
};
