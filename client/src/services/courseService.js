import api from "../utils/api";

export const courseService = {
  // Get all courses with optional filters
  getAllCourses: async (filters = {}) => {
    const { search, instructor, isActive } = filters;
    const queryParams = new URLSearchParams();

    if (search) queryParams.append("search", search);
    if (instructor) queryParams.append("instructor", instructor);
    if (isActive !== undefined) queryParams.append("isActive", isActive);

    const response = await api.get(`/courses?${queryParams}`);
    return response.data;
  },

  // Get course by ID
  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Get enrolled courses for current user
  getEnrolledCourses: async () => {
    try {
      const response = await api.get("/auth/profile");
      if (!response.data || !response.data.enrolledCourses) {
        return [];
      }
      return response.data.enrolledCourses;
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      return [];
    }
  },

  // Check if user is enrolled in a course
  isEnrolled: async (courseId) => {
    try {
      const enrolledCourses = await courseService.getEnrolledCourses();
      return enrolledCourses.some((course) => course._id === courseId);
    } catch (error) {
      console.error("Error checking enrollment:", error);
      return false;
    }
  },

  // Enroll in a course
  enrollInCourse: async (courseId) => {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  // Create a new course (instructor/admin only)
  createCourse: async (courseData) => {
    const response = await api.post("/courses", courseData);
    return response.data;
  },

  // Update a course (instructor/admin only)
  updateCourse: async (courseId, courseData) => {
    const response = await api.put(`/courses/${courseId}`, courseData);
    return response.data;
  },
};
