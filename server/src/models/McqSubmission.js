const mongoose = require('mongoose');

const mcqSubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mcqQuestion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'McqQuestion',
    required: true
  },
  answers: [{
    questionIndex: Number,
    selectedOption: Number,
    isCorrect: Boolean
  }],
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number, // in seconds
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
mcqSubmissionSchema.index({ user: 1, mcqQuestion: 1 });
mcqSubmissionSchema.index({ submittedAt: -1 });

const McqSubmission = mongoose.model('McqSubmission', mcqSubmissionSchema);

module.exports = McqSubmission; 