const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  qualifications: [String],
  specialization: String,
  phoneNumber: String,
  officeRoom: String,
  officeHours: String,
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Retired'],
    default: 'Active'
  },
  hireDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Teacher', teacherSchema);
