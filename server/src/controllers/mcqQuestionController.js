const McqQuestion = require('../models/McqQuestion');
const McqSubmission = require('../models/McqSubmission');

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
    const { answers, timeTaken, questionData } = req.body;
    
    // Get user ID from auth or use anonymous
    const userId = req.user?._id || '000000000000000000000000'; // Use a default anonymous user ID

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
        question: questionData.questions[index].question,
        selectedAnswer: questionData.questions[index].options[selectedOption]?.text,
        correctAnswer: questionData.questions[index].options.find(opt => opt.isCorrect)?.text,
        explanation: questionData.questions[index].explanation
      };
    });

    // Create submission record
    const submission = await McqSubmission.create({
      user: userId,
      mcqQuestion: id,
      answers: validatedAnswers,
      score,
      totalQuestions: answers.length,
      timeTaken: timeTaken || 0,
      passed: score >= (questionData.passingScore || 0)
    });

    // Return submission details
    res.status(200).json({
      status: 'success',
      data: {
        submission: {
          score,
          totalQuestions: answers.length,
          passingScore: questionData.passingScore,
          passed: score >= (questionData.passingScore || 0),
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