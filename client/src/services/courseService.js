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

  // Update course modules with resources
  updateCourseModules: async (courseId, modules) => {
    // Map each module to include a video resource
    const updatedModules = modules.map((module) => ({
      _id: module._id,
      title: module.title,
      content: module.content,
      resources: [
        {
          title: `${module.title} Video`,
          type: "video",
          url: "https://www.youtube.com/watch?v=SSu00IRRraY", // Default video for testing
        },
      ],
    }));

    const response = await api.put(`/courses/${courseId}`, {
      modules: updatedModules,
    });
    return response.data;
  },
};
