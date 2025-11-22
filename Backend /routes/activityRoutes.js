const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const activityController = require('../controllers/activityController');
const auth = require('../middleware/auth');

// Validation middleware
const validateActivity = [
  body('studentName')
    .trim()
    .notEmpty()
    .withMessage('Student name is required'),
  body('course')
    .trim()
    .notEmpty()
    .withMessage('Course is required'),
  body('activity')
    .isIn(['Assignment', 'Quiz', 'Exam', 'Project', 'Presentation', 'Lab Work'])
    .withMessage('Invalid activity type'),
  body('date')
    .isISO8601()
    .withMessage('Valid date is required'),
  body('grade')
    .optional()
    .trim(),
  body('score')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Score must be between 0 and 100'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

// Routes
router.get('/', auth, activityController.getAllActivities);
router.get('/:id', auth, activityController.getActivityById);
router.post('/', auth, validateActivity, activityController.createActivity);
router.put('/:id', auth, activityController.updateActivity);
router.delete('/:id', auth, activityController.deleteActivity);
router.get('/student/:studentName', auth, activityController.getStudentActivities);

module.exports = router;
