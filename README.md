# Smart Curriculum Activity & Attendance System

A comprehensive full-stack web application for managing student attendance, curriculum activities, grades, and academic analytics.

## 🎯 Features

- **Real-time Attendance Tracking** - Record and monitor student attendance with Present/Absent/Late status
- **Activity Management** - Track assignments, quizzes, exams, projects, and presentations
- **Grade Recording** - Maintain student grades and performance metrics
- **Analytics Dashboard** - Visual reports showing attendance rates and student performance
- **Course Management** - Organize activities by courses and subjects
- **Student Reports** - Individual student attendance and activity history
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Tailwind CSS
- Axios for API calls
- React Router for navigation

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JWT Authentication
- bcrypt for password hashing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/smart-curriculum-attendance.git
cd smart-curriculum-attendance
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
cd ..
```

4. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendance-system
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

5. **Start MongoDB**
```bash
# Make sure MongoDB is running
mongod
```

6. **Seed the database (optional)**
```bash
npm run seed
```

7. **Run the application**

In one terminal (Backend):
```bash
npm run server
```

In another terminal (Frontend):
```bash
npm run client
```

Or run both concurrently:
```bash
npm run dev
```

## 🌐 Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

## 📁 Project Structure

```
smart-curriculum-attendance/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── attendanceController.js
│   │   ├── activityController.js
│   │   └── authController.js
│   ├── models/
│   │   ├── Attendance.js
│   │   ├── Activity.js
│   │   ├── Student.js
│   │   └── User.js
│   ├── routes/
│   │   ├── attendanceRoutes.js
│   │   ├── activityRoutes.js
│   │   └── authRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Attendance
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/:id` - Get specific attendance record
- `POST /api/attendance` - Create attendance record
- `PUT /api/attendance/:id` - Update attendance record
- `DELETE /api/attendance/:id` - Delete attendance record
- `GET /api/attendance/student/:studentId` - Get student attendance

### Activities
- `GET /api/activities` - Get all activities
- `GET /api/activities/:id` - Get specific activity
- `POST /api/activities` - Create activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity
- `GET /api/activities/student/:studentId` - Get student activities

### Reports
- `GET /api/reports/attendance-summary` - Overall attendance statistics
- `GET /api/reports/student/:studentId` - Student performance report
- `GET /api/reports/course/:courseId` - Course statistics

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 📝 Usage Examples

### Recording Attendance
```javascript
const attendanceData = {
  studentName: "John Doe",
  course: "Mathematics 101",
  date: "2024-01-15",
  status: "Present",
  notes: "Arrived on time"
};

// API call
axios.post('/api/attendance', attendanceData);
```

### Adding Activity
```javascript
const activityData = {
  studentName: "Jane Smith",
  course: "Physics 201",
  activity: "Assignment",
  grade: "A+",
  date: "2024-01-15",
  notes: "Excellent work"
};

// API call
axios.post('/api/activities', activityData);
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Rate limiting
- XSS protection

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by modern attendance management systems
- Built with love for education

## 📧 Contact

For questions or support, please open an issue or contact: your.email@example.com

## 🗺️ Roadmap

- [ ] Email notifications for absences
- [ ] Bulk attendance import via CSV
- [ ] Mobile app (React Native)
- [ ] Facial recognition attendance
- [ ] Parent portal
- [ ] SMS notifications
- [ ] Advanced analytics and insights
- [ ] Multi-language support

---

Made with ❤️ for better education management
