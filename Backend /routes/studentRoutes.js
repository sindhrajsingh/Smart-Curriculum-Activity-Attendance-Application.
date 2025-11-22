const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');

// Get all students
router.get('/', auth, studentController.getAllStudents);

// Get single student
router.get('/:id', auth, studentController.getStudentById);

// Create new student
router.post('/', auth, studentController.createStudent);

// Update student
router.put('/:id', auth, studentController.updateStudent);

// Delete student
router.delete('/:id', auth, studentController.deleteStudent);

// Enroll student in course
router.post('/:id/enroll', auth, studentController.enrollInCourse);

module.exports = router;
