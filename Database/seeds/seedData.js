const mongoose = require('mongoose');
const Student = require('../../backend/models/Student');
const Teacher = require('../../backend/models/Teacher');
const Course = require('../../backend/models/Course');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Course.deleteMany({});
    
    // Create teachers
    const teachers = await Teacher.create([
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@academicax.edu',
        employeeId: 'T001',
        department: 'Computer Science',
        specialization: 'Artificial Intelligence'
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@academicax.edu',
        employeeId: 'T002',
        department: 'Mathematics',
        specialization: 'Statistics'
      }
    ]);
    
    // Create students
    const students = await Student.create([
      {
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice.brown@student.edu',
        studentId: 'S001',
        grade: 'Junior'
      },
      {
        firstName: 'Bob',
        lastName: 'Davis',
        email: 'bob.davis@student.edu',
        studentId: 'S002',
        grade: 'Sophomore'
      }
    ]);
    
    // Create courses
    await Course.create([
      {
        courseName: 'Introduction to AI',
        courseCode: 'CS401',
        description: 'Fundamentals of Artificial Intelligence',
        credits: 3,
        teacher: teachers[0]._id,
        semester: 'Fall',
        year: 2024
      },
      {
        courseName: 'Advanced Statistics',
        courseCode: 'MATH301',
        description: 'Statistical Analysis and Methods',
        credits: 4,
        teacher: teachers[1]._id,
        semester: 'Spring',
        year: 2024
      }
    ]);
    
    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
