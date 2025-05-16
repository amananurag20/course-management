const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  },
  explanation: String,
  isHidden: {
    type: Boolean,
    default: false,
  },
});

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

const problemSchema = new mongoose.Schema(
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
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    type: {
      type: String,
      enum: ["mcq", "coding"],
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    timeLimit: {
      type: Number,
      required: true,
    },
    // Fields specific to coding problems
    constraints: {
      type: String,
      required: function () {
        return this.type === "coding";
      },
    },
    testCases: {
      type: [testCaseSchema],
      required: function () {
        return this.type === "coding";
      },
    },
    starterCode: {
      type: Map,
      of: String,
      required: function () {
        return this.type === "coding";
      },
    },
    // Fields specific to MCQ problems
    options: {
      type: [optionSchema],
      required: function () {
        return this.type === "mcq";
      },
    },
    explanation: {
      type: String,
      required: function () {
        return this.type === "mcq";
      },
    },
    // Common fields
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    hints: [String],
    solution: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Problem", problemSchema);
