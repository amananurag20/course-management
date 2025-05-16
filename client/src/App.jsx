import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import store from "./store";
import { getProfile } from "./store/slices/authSlice";
import { SidebarProvider } from "./context/SidebarContext";

// Import components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./pages/Home";
import Practice from "./pages/Practice";
import PracticeQuestions from "./components/PracticeQuestions";
import CodingQuestion from "./components/CodingQuestion";
import Courses from "./components/Courses";
import CourseViewer from "./components/CourseViewer";
import Reels from "./components/Reels";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import Progress from "./components/Progress";
import Settings from "./components/Settings";
import Assignments from "./components/Assignments";
import McqQuestion from "./components/McqQuestion";
import Profile from "./components/Profile";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Main App component
const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(getProfile());
    }
  }, [dispatch]);

  return (
    <SidebarProvider>
      <Router>
        <Routes>
          {/* Auth Routes - No Layout */}
          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/register"
            element={
              <Layout>
                <Register />
              </Layout>
            }
          />

          {/* Protected Routes - With Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Layout>
                  <Courses />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/:courseId"
            element={
              <ProtectedRoute>
                <Layout>
                  <CourseViewer />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reels"
            element={
              <ProtectedRoute>
                <Layout>
                  <Reels />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/assignments"
            element={
              <ProtectedRoute>
                <Layout>
                  <Assignments />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <Layout>
                  <Progress />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Practice Section Routes */}
          <Route
            path="/practice"
            element={
              <ProtectedRoute>
                <Layout>
                  <Practice />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/practice/coding/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <CodingQuestion />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/practice/mcq/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <McqQuestion />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/practice/mcq/:sectionId"
            element={
              <ProtectedRoute>
                <Layout>
                  <PracticeQuestions />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/practice/:sectionId"
            element={
              <ProtectedRoute>
                <Layout>
                  <Practice />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/practice/:sectionId/:questionId"
            element={
              <ProtectedRoute>
                <Layout>
                  <CodingQuestion />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </SidebarProvider>
  );
};

// App wrapper with Redux
const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default AppWrapper;
