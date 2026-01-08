import api from "../utils/api";

export const reelService = {
    // Get all reels
    getAllReels: async () => {
        try {
            const response = await api.get("/reels");
            return response.data;
        } catch (error) {
            console.error("Error fetching reels:", error);
            throw error;
        }
    },

    // Get single reel by ID
    getReelById: async (id) => {
        try {
            const response = await api.get(`/reels/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching reel:", error);
            throw error;
        }
    },
};

export default reelService;
