const mongoose = require("mongoose");

const mcqQuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title cannot be empty"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
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
    timeLimit: {
      type: Number,
      default: 10, // minutes
      required: true,
    },
    questions: [
      {
        question: {
          type: String,
          required: [true, "Question text is required"],
        },
        options: [
          {
            text: {
              type: String,
              required: [true, "Option text is required"],
            },
            isCorrect: {
              type: Boolean,
              default: false,
            },
          },
        ],
        explanation: {
          type: String,
          required: [true, "Explanation is required"],
        },
        points: {
          type: Number,
          default: 1,
          required: true,
        },
      },
    ],
    totalPoints: {
      type: Number,
      required: true,
      default: function () {
        return this.questions.reduce((sum, q) => sum + q.points, 0);
      },
    },
    passingScore: {
      type: Number,
      required: true,
      default: function () {
        return Math.ceil(this.totalPoints * 0.4); // 60% passing score by default
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [String],
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    difficultyLevel: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
    timePerQuestion: {
      type: Number,
      default: 2, // minutes per question
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
mcqQuestionSchema.index({ title: 1 });
mcqQuestionSchema.index({ difficulty: 1 });
mcqQuestionSchema.index({ topic: 1 });
mcqQuestionSchema.index({ category: 1 });
mcqQuestionSchema.index({ tags: 1 });

// Pre-save middleware to ensure at least one correct option per question
mcqQuestionSchema.pre("save", function (next) {
  for (const question of this.questions) {
    const hasCorrectOption = question.options.some(
      (option) => option.isCorrect
    );
    if (!hasCorrectOption) {
      return next(
        new Error("Each question must have at least one correct option")
      );
    }
  }
  next();
});

// Method to validate user answers
mcqQuestionSchema.methods.validateAnswers = function (userAnswers) {
  let score = 0;
  const results = [];

  for (let i = 0; i < this.questions.length; i++) {
    const question = this.questions[i];
    const userAnswer = userAnswers[i];

    const isCorrect = question.options.every((option, index) => {
      return option.isCorrect === userAnswer[index];
    });

    if (isCorrect) {
      score += question.points;
    }

    results.push({
      questionId: question._id,
      isCorrect,
      points: isCorrect ? question.points : 0,
      explanation: question.explanation,
    });
  }

  return {
    score,
    totalPoints: this.totalPoints,
    passed: score >= this.passingScore,
    results,
  };
};

// Static method to get random questions
mcqQuestionSchema.statics.getRandomQuestions = async function (count = 5) {
  return this.aggregate([
    { $match: { isActive: true } },
    { $sample: { size: count } },
    {
      $project: {
        questions: {
          $map: {
            input: "$questions",
            as: "question",
            in: {
              question: "$$question.question",
              options: {
                $map: {
                  input: "$$question.options",
                  as: "option",
                  in: {
                    text: "$$option.text",
                    isCorrect: false, // Hide correct answers
                  },
                },
              },
            },
          },
        },
        title: 1,
        description: 1,
        difficulty: 1,
        topic: 1,
        timeLimit: 1,
      },
    },
  ]);
};

const McqQuestion = mongoose.model("McqQuestion", mcqQuestionSchema);

module.exports = McqQuestion;
