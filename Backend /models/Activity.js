const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
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
  activity: {
    type: String,
    required: [true, 'Activity type is required'],
    enum: {
      values: ['Assignment', 'Quiz', 'Exam', 'Project', 'Presentation', 'Lab Work'],
      message: '{VALUE} is not a valid activity type'
    }
  },
  grade: {
    type: String,
    trim: true
  },
  score: {
    type: Number,
    min: [0, 'Score cannot be negative'],
    max: [100, 'Score cannot exceed 100']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  dueDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['Pending', 'Submitted', 'Graded', 'Late'],
    default: 'Pending'
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
activitySchema.index({ studentName: 1, date: -1 });
activitySchema.index({ course: 1, activity: 1 });
activitySchema.index({ date: -1 });

// Virtual for letter grade conversion
activitySchema.virtual('letterGrade').get(function() {
  if (!this.score) return null;
  
  if (this.score >= 90) return 'A';
  if (this.score >= 80) return 'B';
  if (this.score >= 70) return 'C';
  if (this.score >= 60) return 'D';
  return 'F';
});

// Static method to get student average
activitySchema.statics.getStudentAverage = async function(studentName) {
  const result = await this.aggregate([
    { $match: { studentName, score: { $exists: true, $ne: null } } },
    {
      $group: {
        _id: null,
        average: { $avg: '$score' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  return result.length > 0 ? result[0] : { average: 0, count: 0 };
};

// Instance method to check if late
activitySchema.methods.isLate = function() {
  if (!this.dueDate) return false;
  return this.date > this.dueDate;
};

module.exports = mongoose.model('Activity', activitySchema);
