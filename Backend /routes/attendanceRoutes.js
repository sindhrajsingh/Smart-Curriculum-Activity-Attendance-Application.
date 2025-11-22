const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const attendanceController = require('../controllers/attendanceController');
const auth = require('../middleware/auth');

// Validation middleware
const validateAttendance = [
  body('studentName')
    .trim()
    .notEmpty()
    .withMessage('Student name is required')
    .isLength({ min: 2 })
    .withMessage('Student name must be at least 2 characters'),
  body('course')
    .trim()
    .notEmpty()
    .withMessage('Course is required'),
  body('date')
    .isISO8601()
    .withMessage('Valid date is required'),
  body('status')
    .isIn(['Present', 'Absent', 'Late'])
    .withMessage('Status must be Present, Absent, or Late'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

// Routes
router.get('/', auth, attendanceController.getAllAttendance);
router.get('/:id', auth, attendanceController.getAttendanceById);
router.post('/', auth, validateAttendance, attendanceController.createAttendance);
router.put('/:id', auth, attendanceController.updateAttendance);
router.delete('/:id', auth, attendanceController.deleteAttendance);
router.get('/student/:studentName', auth, attendanceController.getStudentAttendance);

module.exports = router;
