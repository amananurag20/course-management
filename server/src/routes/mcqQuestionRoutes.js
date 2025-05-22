const express = require('express');
const mcqQuestionController = require('../controllers/mcqQuestionController');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Get random questions
router.get('/random', mcqQuestionController.getRandomQuestions);

// Validate answers for a specific question
router.post('/:id/validate', mcqQuestionController.validateAnswers);

// Submit quiz and get submission history
router.post('/:id/submit', protect, mcqQuestionController.submitQuiz);
router.get('/submissions/history', protect, mcqQuestionController.getSubmissionHistory);

// CRUD routes
router
  .route('/')
  .get(mcqQuestionController.getAllMcqQuestions)
  .post(mcqQuestionController.createMcqQuestion);

router
  .route('/:id')
  .get(mcqQuestionController.getMcqQuestion)
  .patch(mcqQuestionController.updateMcqQuestion)
  .delete(mcqQuestionController.deleteMcqQuestion);

module.exports = router; 