const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
    enum: ["javascript", "python", "java", "cpp"],
  },
  status: {
    type: String,
    required: true,
    enum: [
      "Accepted",
      "Wrong Answer",
      "Time Limit Exceeded",
      "Memory Limit Exceeded",
      "Runtime Error",
      "Compilation Error",
    ],
  },
  runtime: {
    type: Number,
    required: true,
  },
  memory: {
    type: Number,
    required: true,
  },
  testCases: [
    {
      passed: Boolean,
      input: String,
      output: String,
      expected: String,
      time: Number,
      error: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
submissionSchema.index({ user: 1, problem: 1, createdAt: -1 });

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
