const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Activity = require('../models/Activity');

const connectDB = require('../config/database');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany();
    await Student.deleteMany();
    await Attendance.deleteMany();
    await Activity.deleteMany();

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'Admin',
      firstName: 'Admin',
      lastName: 'User'
    });

    // Create teacher user
    console.log('👨‍🏫 Creating teacher user...');
    const teacher = await User.create({
      username: 'teacher1',
      email: 'teacher@example.com',
      password: 'teacher123',
      role: 'Teacher',
      firstName: 'John',
      lastName: 'Smith'
    });

    // Create students
    console.log('👨‍🎓 Creating students...');
    const students = await Student.create([
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@example.com',
        studentId: 'STU001',
        dateOfBirth: new Date('2005-03-15'),
        courses: ['Mathematics 101', 'Physics 201'],
        grade: 'Junior',
        status: 'Active'
      },
      {
        firstName: 'Bob',
        lastName: 'Williams',
        email: 'bob@example.com',
        studentId: 'STU002',
        dateOfBirth: new Date('2004-07-22'),
        courses: ['Mathematics 101', 'Chemistry 301'],
        grade: 'Senior',
        status: 'Active'
      },
      {
        firstName: 'Carol',
        lastName: 'Brown',
        email: 'carol@example.com',
        studentId: 'STU003',
        dateOfBirth: new Date('2005-11-08'),
        courses: ['Physics 201', 'Biology 101'],
        grade: 'Junior',
        status: 'Active'
      }
    ]);

    // Create attendance records
    console.log('📋 Creating attendance records...');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    await Attendance.create([
      {
        studentName: 'Alice Johnson',
        studentId: students[0]._id,
        course: 'Mathematics 101',
        date: today,
        status: 'Present',
        notes: 'On time',
        recordedBy: teacher._id
      },
      {
        studentName: 'Bob Williams',
        studentId: students[1]._id,
        course: 'Mathematics 101',
        date: today,
        status: 'Present',
        recordedBy: teacher._id
      },
      {
        studentName: 'Carol Brown',
        studentId: students[2]._id,
        course: 'Physics 201',
        date: today,
        status: 'Late',
        notes: 'Arrived 10 minutes late',
        recordedBy: teacher._id
      },
      {
        studentName: 'Alice Johnson',
        studentId: students[0]._id,
        course: 'Physics 201',
        date: yesterday,
        status: 'Present',
        recordedBy: teacher._id
      }
    ]);

    // Create activities
    console.log('🎯 Creating activities...');
    await Activity.create([
      {
        studentName: 'Alice Johnson',
        studentId: students[0]._id,
        course: 'Mathematics 101',
        activity: 'Assignment',
        grade: 'A',
        score: 95,
        date: yesterday,
        notes: 'Excellent work on calculus problems',
        status: 'Graded',
        recordedBy: teacher._id
      },
      {
        studentName: 'Bob Williams',
        studentId: students[1]._id,
        course: 'Mathematics 101',
        activity: 'Quiz',
        grade: 'B+',
        score: 87,
        date: yesterday,
        notes: 'Good understanding of concepts',
        status: 'Graded',
        recordedBy: teacher._id
      },
      {
        studentName: 'Carol Brown',
        studentId: students[2]._id,
        course: 'Physics 201',
        activity: 'Lab Work',
        grade: 'A-',
        score: 92,
        date: today,
        notes: 'Great lab technique',
        status: 'Graded',
        recordedBy: teacher._id
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('📝 Login Credentials:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   Teacher: teacher@example.com / teacher123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
