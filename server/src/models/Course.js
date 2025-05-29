const mongoose = require("mongoose");

// Define a separate schema for resources
const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["video", "article", "document"],
  },
  url: {
    type: String,
    required: true,
  },
  notes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true
    },
    includeTimestamp: {
      type: Boolean,
      default: false
    },
    timestamp: {
      type: Number,  // For video resources, store timestamp in seconds
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }]
});

// Define a separate schema for modules
const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  resources: [resourceSchema],
  mcqQuestion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "McqQuestion",
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",  // Assuming you have a Problem model
  },
 
  completedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    mcqScore: Number,
    mcqPassed: {
      type: Boolean,
      default: false
    },
    // problemScore: Number,
    // problemPassed: {
    //   type: Boolean,
    //   default: true
    // }
  }]
});

const courseSchema = new mongoose.Schema(
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
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    assignments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
      },
    ],
    modules: [moduleSchema],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Method to check if a module is unlocked for a user
courseSchema.methods.isModuleUnlocked = function(moduleIndex, userId) {
  if (moduleIndex === 0) return true; // First module is always unlocked
  
  // Check if previous module is completed by the user
  const previousModule = this.modules[moduleIndex - 1];
  if (!previousModule) return false;
  
  const userCompletion = previousModule.completedBy.find(
    completion => completion.user.toString() === userId.toString()
  );
  
  if (!userCompletion) return false;

  // If module has MCQ, it must be passed to unlock next module
  if (previousModule.mcqQuestion) {
    return userCompletion.mcqPassed === true;
  }

  // If no MCQ requirement, module is considered completed
  return true;
};

// Method to mark a module as completed for a user
courseSchema.methods.markModuleCompleted = function(moduleIndex, userId, { mcqScore = null, mcqPassed = false } = {}) {
  const module = this.modules[moduleIndex];
  if (!module) throw new Error("Module not found");

  // If module has MCQ and user hasn't passed it, don't mark as completed
  if (module.mcqQuestion && !mcqPassed) {
    return false;
  }

  // Remove any existing completion record for this user
  module.completedBy = module.completedBy.filter(
    completion => completion.user.toString() !== userId.toString()
  );

  // Add new completion record
  module.completedBy.push({
    user: userId,
    completedAt: new Date(),
    mcqScore,
    mcqPassed
  });

  return true;
};

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
