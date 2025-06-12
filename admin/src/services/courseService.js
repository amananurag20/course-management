import api from '../utils/api';

export const courseService = {
  // Course Management
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  
  // Module Management
  addModule: (courseId, moduleData) => api.post(`/courses/${courseId}/modules`, moduleData),
  updateModule: (courseId, moduleIndex, moduleData) => 
    api.put(`/courses/${courseId}/modules/${moduleIndex}`, moduleData),
  deleteModule: (courseId, moduleIndex) => 
    api.delete(`/courses/${courseId}/modules/${moduleIndex}`),
  
  // Resource Management
  addResource: (courseId, moduleIndex, resourceData) => 
    api.post(`/courses/${courseId}/modules/${moduleIndex}/resources`, resourceData),
  updateResource: (courseId, moduleIndex, resourceIndex, resourceData) => 
    api.put(`/courses/${courseId}/modules/${moduleIndex}/resources/${resourceIndex}`, resourceData),
  deleteResource: (courseId, moduleIndex, resourceIndex) => 
    api.delete(`/courses/${courseId}/modules/${moduleIndex}/resources/${resourceIndex}`),
  
  // Enrollment Management
  getEnrollments: (courseId) => api.get(`/courses/${courseId}/enrollments`),
  enrollStudent: (courseId, studentId) => api.post(`/courses/${courseId}/enroll/${studentId}`),
  unenrollStudent: (courseId, studentId) => api.delete(`/courses/${courseId}/enroll/${studentId}`),
  
  // Course Progress & Analytics
  getProgress: (courseId) => api.get(`/courses/${courseId}/progress`),
  getCourseAnalytics: (courseId) => api.get(`/courses/${courseId}/analytics`),
  getModuleCompletion: (courseId, moduleIndex) => 
    api.get(`/courses/${courseId}/modules/${moduleIndex}/completion`),
  
  // MCQ related endpoints
  getModuleMCQs: async (courseId, moduleId) => {
    return await api.get(`/courses/${courseId}/modules/${moduleId}/mcq`);
  },
  addModuleQuiz: async (courseId, moduleId, quizData) => {
    return await api.post(`/courses/${courseId}/modules/${moduleId}/mcq`, quizData);
  },
  updateModuleQuiz: async (courseId, moduleId, quizId, quizData) => {
    return await api.put(`/courses/${courseId}/modules/${moduleId}/mcq/${quizId}`, quizData);
  },
  deleteModuleQuiz: async (courseId, moduleId, quizId) => {
    return await api.delete(`/courses/${courseId}/modules/${moduleId}/mcq/${quizId}`);
  },
}; 