const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title cannot be empty"],
      unique: true,
      trim: true,
    },
    description: {
      type: String, // Supports Markdown
      required: [true, "Description cannot be empty"],
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: [true, "Difficulty cannot be empty"],
      default: "easy",
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
    },
    type: {
      type: String,
      enum: ["coding", "mcq"],
      required: true,
    },
    timeLimit: {
      type: Number,
      default: 1, // seconds
      required: true,
    },
    testCases: [
      {
        input: {
          type: String,
          required: true,
        },
        output: {
          type: String,
          required: true,
        },
        explanation: {
          type: String,
        },
      },
    ],
    codeStubs: [
      {
        language: {
          type: String,
          enum: ["javascript", "python", "java", "cpp"],
          required: true,
        },
        startSnippet: String, // Hidden before user code
        userSnippet: String, // Visible/editable part
        endSnippet: String, // Hidden after user code
      },
    ],
    editorial: {
      type: String, // Markdown or plain text solution
    },
    hints: [String],
    solution: {
      type: String, // Model/expected solution, hidden from user
    },
  },
  {
    timestamps: true,
  }
);

// Optional: Indexes for fast queries
problemSchema.index({ title: 1 });
problemSchema.index({ difficulty: 1 });
problemSchema.index({ topic: 1 });
problemSchema.index({ type: 1 });

const Problem = mongoose.model("Problem", problemSchema);

module.exports = Problem;
