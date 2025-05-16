const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    totalPoints: {
      type: Number,
      required: true,
      min: 0,
    },
    submissions: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        submittedAt: {
          type: Date,
          default: Date.now,
        },
        content: String,
        attachments: [
          {
            filename: String,
            url: String,
          },
        ],
        grade: {
          type: Number,
          min: 0,
        },
        feedback: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
