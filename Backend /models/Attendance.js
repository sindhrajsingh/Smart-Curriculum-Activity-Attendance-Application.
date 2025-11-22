const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['Present', 'Absent', 'Late'],
      message: '{VALUE} is not a valid status'
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for faster queries
attendanceSchema.index({ studentName: 1, date: -1 });
attendanceSchema.index({ course: 1, date: -1 });
attendanceSchema.index({ date: -1 });

// Virtual for formatted date
attendanceSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Static method to get attendance summary
attendanceSchema.statics.getAttendanceSummary = async function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Instance method to check if present
attendanceSchema.methods.isPresent = function() {
  return this.status === 'Present';
};

module.exports = mongoose.model('Attendance', attendanceSchema);
