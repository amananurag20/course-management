const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    activities: [
      {
        type: {
          type: String,
          enum: [
            "user_login",
            "course_access",
            "assignment_submission",
            "quiz_completion",
            "practice_session",
          ],
          required: true,
        },
        details: {
          type: mongoose.Schema.Types.Mixed,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one activity record per user per day
userActivitySchema.index({ user: 1, date: 1 }, { unique: true });

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

module.exports = UserActivity;
