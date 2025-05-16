const express = require("express");
const router = express.Router();
const UserActivity = require("../models/UserActivity");
const auth = require("../middleware/auth");

// Track user activity
router.post("/track", auth, async (req, res) => {
  try {
    const { activityType, details } = req.body;
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "User ID not found in token" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let userActivity = await UserActivity.findOne({
      user: req.user.userId,
      date: today,
    });

    if (userActivity) {
      // Add new activity to existing record
      userActivity.activities.push({ type: activityType, details });
      await userActivity.save();
    } else {
      // Create new activity record
      userActivity = new UserActivity({
        user: req.user.userId,
        date: today,
        activities: [{ type: activityType, details }],
      });
      await userActivity.save();
    }

    res.status(200).json(userActivity);
  } catch (error) {
    console.error("Activity tracking error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get user activity for a specific month
router.get("/month/:year/:month", auth, async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "User ID not found in token" });
    }

    const { year, month } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const activities = await UserActivity.find({
      user: req.user.userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ date: 1 });

    res.status(200).json(activities);
  } catch (error) {
    console.error("Activity fetch error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
