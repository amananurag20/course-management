# Course Management System Backend

This is the backend server for the Course Management System, built with Express.js and MongoDB.hi

## Features

- User authentication (JWT)
- Role-based access control (Student, Instructor, Admin)
- Course management
- Assignment handling
- Student enrollment
- Grade management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Navigate to the server directory:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/course_management
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile

### Courses

- POST /api/courses - Create a new course (Instructor/Admin)
- GET /api/courses - Get all courses
- GET /api/courses/:id - Get course by ID
- PUT /api/courses/:id - Update course (Instructor/Admin)
- POST /api/courses/:id/enroll - Enroll in a course

### Assignments

- POST /api/assignments/course/:courseId - Create assignment (Instructor/Admin)
- GET /api/assignments/course/:courseId - Get course assignments
- POST /api/assignments/:assignmentId/submit - Submit assignment
- POST /api/assignments/:assignmentId/submissions/:submissionId/grade - Grade submission (Instructor/Admin)
