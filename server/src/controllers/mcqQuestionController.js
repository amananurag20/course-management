const McqQuestion = require('../models/McqQuestion');
const McqSubmission = require('../models/McqSubmission');
const Course = require('../models/Course');

// Create a new MCQ question
exports.createMcqQuestion = async (req, res) => {
  try {
    const mcqQuestion = await McqQuestion.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        mcqQuestion,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get all MCQ questions
exports.getAllMcqQuestions = async (req, res) => {
  try {
    const mcqQuestions = await McqQuestion.find();
    res.status(200).json({
      status: 'success',
      results: mcqQuestions.length,
      data: {
        mcqQuestions,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get a single MCQ question
exports.getMcqQuestion = async (req, res) => {
  try {
    const mcqQuestion = await McqQuestion.findById(req.params.id);
    
    if (!mcqQuestion) {
      return res.status(404).json({
        status: 'fail',
        message: 'MCQ Question not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        mcqQuestion,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Update MCQ question
exports.updateMcqQuestion = async (req, res) => {
  try {
    const mcqQuestion = await McqQuestion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!mcqQuestion) {
      return res.status(404).json({
        status: 'fail',
        message: 'MCQ Question not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        mcqQuestion,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Delete MCQ question
exports.deleteMcqQuestion = async (req, res) => {
  try {
    const mcqQuestion = await McqQuestion.findByIdAndDelete(req.params.id);

    if (!mcqQuestion) {
      return res.status(404).json({
        status: 'fail',
        message: 'MCQ Question not found',
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get random questions
exports.getRandomQuestions = async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 5;
    const randomQuestions = await McqQuestion.getRandomQuestions(count);

    res.status(200).json({
      status: 'success',
      results: randomQuestions.length,
      data: {
        questions: randomQuestions,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Validate answers
exports.validateAnswers = async (req, res) => {
  try {
    const mcqQuestion = await McqQuestion.findById(req.params.id);
    
    if (!mcqQuestion) {
      return res.status(404).json({
        status: 'fail',
        message: 'MCQ Question not found',
      });
    }

    const results = mcqQuestion.validateAnswers(req.body.answers);

    res.status(200).json({
      status: 'success',
      data: results,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Submit MCQ answers and store results
exports.submitQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, timeTaken, questionData, courseId, moduleIndex } = req.body;
    
    // Get user ID from auth
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        status: 'fail',
        message: 'User authentication required'
      });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid answers format. Expected an array of answer indices.'
      });
    }

    // Calculate score and prepare validated answers
    let score = 0;
    const validatedAnswers = answers.map((selectedOption, index) => {
      const isCorrect = questionData.questions[index].options[selectedOption]?.isCorrect || false;
      if (isCorrect) score++;
      return {
        questionIndex: index,
        selectedOption,
        isCorrect,
        correctOption: questionData.questions[index].options.findIndex(opt => opt.isCorrect),
        question: questionData.questions[index].question,
        selectedAnswer: questionData.questions[index].options[selectedOption]?.text,
        correctAnswer: questionData.questions[index].options.find(opt => opt.isCorrect)?.text,
        explanation: questionData.questions[index].explanation
      };
    });

    const passed = score >= (questionData.passingScore || 0);

    // Create submission record
    const submission = await McqSubmission.create({
      user: userId,
      mcqQuestion: id,
      answers: validatedAnswers,
      score,
      totalQuestions: answers.length,
      timeTaken: timeTaken || 0,
      passed
    });

    // If this MCQ is part of a course module, update course completion
    if (courseId && typeof moduleIndex !== 'undefined') {
      try {
        const course = await Course.findById(courseId);
        if (!course) {
          throw new Error('Course not found');
        }

        // Mark module completion in the course
        course.markModuleCompleted(parseInt(moduleIndex), userId, {
          mcqScore: score,
          mcqPassed: passed
        });

        await course.save();

        // Get updated module unlock status
        const nextModuleIndex = parseInt(moduleIndex) + 1;
        const isNextModuleUnlocked = nextModuleIndex < course.modules.length ? 
          course.isModuleUnlocked(nextModuleIndex, userId) : false;

        // Return submission details with module status
        return res.status(200).json({
          status: 'success',
          data: {
            submission: {
              _id: submission._id,
              score,
              totalQuestions: answers.length,
              passingScore: questionData.passingScore,
              passed,
              timeTaken: timeTaken || 0,
              answers: validatedAnswers,
              submittedAt: submission.submittedAt
            },
            moduleStatus: {
              completed: passed,
              nextModuleUnlocked: isNextModuleUnlocked,
              nextModuleIndex: nextModuleIndex
            }
          }
        });
      } catch (err) {
        console.error('Failed to update course module completion:', err);
        return res.status(400).json({
          status: 'fail',
          message: 'Failed to update course progress'
        });
      }
    }

    // Return submission details without module status if not part of a course
    res.status(200).json({
      status: 'success',
      data: {
        submission: {
          _id: submission._id,
          score,
          totalQuestions: answers.length,
          passingScore: questionData.passingScore,
          passed,
          timeTaken: timeTaken || 0,
          answers: validatedAnswers,
          submittedAt: submission.submittedAt
        }
      }
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(400).json({
      status: 'fail',
      message: error.message || 'Failed to submit quiz'
    });
  }
};

exports.updateCourseModuleCompletion = async (userId, courseId, moduleIndex, mcqData) => {
  try {
    const course = await Course.findById(courseId);
    
    if (!course) {
      throw new Error('Course not found');
    }

    // Find user's enrollment in the course
    let userEnrollment = course.enrolledUsers.find(
      enrollment => enrollment.user.toString() === userId.toString()
    );

    if (!userEnrollment) {
      // If user is not enrolled, create enrollment
      userEnrollment = {
        user: userId,
        enrolledAt: new Date(),
        progress: {
          completedModules: [],
          currentModule: 0,
          overallProgress: 0
        }
      };
      course.enrolledUsers.push(userEnrollment);
    }

    // Initialize progress if it doesn't exist
    if (!userEnrollment.progress) {
      userEnrollment.progress = {
        completedModules: [],
        currentModule: 0,
        overallProgress: 0
      };
    }

    // Find or create module completion record
    let moduleCompletion = userEnrollment.progress.completedModules.find(
      mod => mod.moduleIndex === moduleIndex
    );

    if (!moduleCompletion) {
      moduleCompletion = {
        moduleIndex: moduleIndex,
        completedAt: new Date(),
        mcqCompleted: false,
        mcqScore: 0,
        mcqPassed: false
      };
      userEnrollment.progress.completedModules.push(moduleCompletion);
    }

    // Update MCQ completion data
    moduleCompletion.mcqCompleted = true;
    moduleCompletion.mcqScore = mcqData.mcqScore;
    moduleCompletion.mcqPassed = mcqData.mcqPassed;
    moduleCompletion.mcqSubmissionId = mcqData.mcqSubmissionId;
    moduleCompletion.completedAt = new Date();

    // Update current module if this module is completed and it's the current one
    if (moduleCompletion.mcqPassed && userEnrollment.progress.currentModule === moduleIndex) {
      userEnrollment.progress.currentModule = Math.min(
        moduleIndex + 1, 
        course.modules.length - 1
      );
    }

    // Calculate overall progress
    const completedCount = userEnrollment.progress.completedModules.filter(
      mod => mod.mcqPassed
    ).length;
    userEnrollment.progress.overallProgress = Math.round(
      (completedCount / course.modules.length) * 100
    );

    await course.save();
    
    return {
      success: true,
      moduleCompletion,
      overallProgress: userEnrollment.progress.overallProgress,
      currentModule: userEnrollment.progress.currentModule
    };

  } catch (error) {
    console.error('Error updating course module completion:', error);
    throw error;
  }
};

// New endpoint specifically for updating module completion
exports.updateModuleCompletion = async (req, res) => {
  try {
    const { courseId, moduleIndex } = req.params;
    const { mcqScore, mcqPassed, mcqSubmissionId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        status: 'fail',
        message: 'User authentication required'
      });
    }

    const result = await exports.updateCourseModuleCompletion(
      userId, 
      courseId, 
      parseInt(moduleIndex), 
      {
        mcqScore,
        mcqPassed,
        mcqSubmissionId
      }
    );

    res.status(200).json({
      status: 'success',
      data: result
    });

  } catch (error) {
    console.error('Error updating module completion:', error);
    res.status(400).json({
      status: 'fail',
      message: error.message || 'Failed to update module completion'
    });
  }
};

// Get user's course progress
exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        status: 'fail',
        message: 'User authentication required'
      });
    }

    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }

    const userEnrollment = course.enrolledUsers.find(
      enrollment => enrollment.user.toString() === userId.toString()
    );

    if (!userEnrollment) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not enrolled in this course'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        progress: userEnrollment.progress,
        enrolledAt: userEnrollment.enrolledAt
      }
    });

  } catch (error) {
    console.error('Error fetching course progress:', error);
    res.status(400).json({
      status: 'fail',
      message: error.message || 'Failed to fetch course progress'
    });
  }
};

// Get user's MCQ submission history
exports.getSubmissionHistory = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have authentication middleware
    
    const submissions = await McqSubmission.find({ user: userId })
      .populate('mcqQuestion', 'title topic difficulty')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        submissions
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
}; 