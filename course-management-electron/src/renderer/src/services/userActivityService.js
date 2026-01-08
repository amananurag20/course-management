import api from "../utils/api";

export const userActivityService = {
  // Track user activity
  trackActivity: async (activityType, details = {}) => {
    const response = await api.post("/user-activity/track", {
      activityType,
      details,
    });
    return response.data;
  },

  // Get user activity for a specific month
  getMonthlyActivity: async (year, month) => {
    const response = await api.get(`/user-activity/month/${year}/${month}`);
    return response.data;
  },
};
