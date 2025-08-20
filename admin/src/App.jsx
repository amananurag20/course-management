import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Users from './pages/Users';
import MCQQuestions from './pages/MCQQuestions';
import Problems from './pages/Problems';
import Assignments from './pages/Assignments';
import ModuleQuiz from './pages/ModuleQuiz';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Routes>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="courses" element={<Courses />} />
                  <Route path="courses/:id" element={<CourseDetails />} />
                  <Route path="courses/:courseId/modules/:moduleId/quiz" element={<ModuleQuiz />} />
                  <Route path="users/*" element={<Users />} />
                  <Route path="mcq-questions/*" element={<MCQQuestions />} />
                  <Route path="problems/*" element={<Problems />} />
                  <Route path="assignments/*" element={<Assignments />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
