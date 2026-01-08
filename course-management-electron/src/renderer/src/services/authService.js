import api from "../utils/api";
import { userActivityService } from "./userActivityService";

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      // Track login activity
      await userActivityService.trackActivity("user_login", {
        timestamp: new Date(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ... rest of the auth service methods ...
};
