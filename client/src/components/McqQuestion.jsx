import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdCheck, MdClose, MdArrowForward, MdArrowBackIos, MdAccessTime, MdQuiz, MdInfo } from "react-icons/md";
import { useSidebar } from "../context/SidebarContext";
import { mcqService } from "../services/mcqService";
import Timer from "./Timer";
import TimeUpModal from "./TimeUpModal";
import ConfirmationModal from "./ConfirmationModal";

const QuestionBox = ({ number, question, isAnswered, isActive, onClick, isVisited }) => {
  const questionRef = React.useRef(null);

  React.useEffect(() => {
    if (isActive && questionRef.current) {
      questionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isActive]);

  return (
    <button
      ref={questionRef}
      onClick={onClick}
      className={`relative w-full h-16 rounded-lg p-3 flex items-center justify-start transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg group
        ${isActive 
          ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25 ring-2 ring-purple-400/50" 
          : isAnswered 
            ? "bg-gradient-to-r from-green-500/10 to-green-600/10 text-green-300 border border-green-500/30 hover:from-green-500/20 hover:to-green-600/20"
            : isVisited
              ? "bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-300 border border-red-500/30 hover:from-red-500/20 hover:to-red-600/20"
              : "bg-gray-700/40 text-gray-300 border border-gray-600/50 hover:bg-gray-700/60 hover:border-gray-500"}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3
        ${isActive 
          ? "bg-white/20" 
          : isAnswered 
            ? "bg-green-500/20"
            : isVisited
              ? "bg-red-500/20"
              : "bg-gray-600/50"}`}>
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium truncate max-w-[180px]">{question}</div>
      </div>
      {isAnswered && !isActive && (
        <div className="flex-shrink-0 ml-2">
          <MdCheck size={16} className="text-green-400" />
        </div>
      )}
    </button>
  );
};

const McqQuestion = () => {
  const { isGlobalSidebarOpen } = useSidebar();
  const { id } = useParams();
  const navigate = useNavigate();

  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0])); // Initialize with first question
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [moduleStatus, setModuleStatus] = useState(null);

  // Fetch question data and set start time
  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        setLoading(true);
        const response = await mcqService.getMcqQuestionById(id);
        setQuestionData(response.data.mcqQuestion);
        setStartTime(Date.now()); // Set start time when questions are loaded
      } catch (err) {
        console.error("Error fetching question:", err);
        setError(err.message || "Failed to fetch question");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionData();
  }, [id]);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8 flex items-center justify-center"
        style={{ marginLeft: isGlobalSidebarOpen ? "16rem" : "5rem" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
          <p className="text-gray-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !questionData) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8"
        style={{ marginLeft: isGlobalSidebarOpen ? "16rem" : "5rem" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <MdClose size={64} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              {error || "Question not found"}
            </h2>
            <button
              onClick={() => navigate("/practice")}
              className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <MdArrowBack size={20} className="mr-2" />
              Back to Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questionData.questions[currentQuestionIndex];
  const totalQuestions = questionData.questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercentage = (answeredCount / totalQuestions) * 100;

  const handleAnswerSelect = (index) => {
    if (!showResults) {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestionIndex]: index,
      });
    }
  };

  const handleQuestionChange = (index) => {
    setVisitedQuestions(prev => new Set([...prev, index]));
    setCurrentQuestionIndex(index);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      handleQuestionChange(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      handleQuestionChange(currentQuestionIndex + 1);
    }
  };

  const calculateAndShowResults = async () => {
    try {
      setIsSubmitting(true);
      
      const timeLeft = document.querySelector('[data-testid="timer"]')?.textContent || '';
      const [minutes, seconds] = timeLeft.split(':').map(Number);
      const timeLeftInSeconds = (minutes * 60) + seconds;
      const timeTaken = questionData.timeLimit * 60 - timeLeftInSeconds;

      // Get course info from URL if it exists
      const courseId = new URLSearchParams(window.location.search).get('courseId');
      const moduleIndex = new URLSearchParams(window.location.search).get('moduleIndex');

      const submissionData = {
        answers: Object.entries(selectedAnswers).map(([index, answerIndex]) => answerIndex),
        timeTaken: Math.max(0, timeTaken || 0),
        questionData,
        courseId,
        moduleIndex: moduleIndex ? parseInt(moduleIndex) : undefined
      };

      // Submit quiz results
      const response = await mcqService.submitMcqQuiz(id, submissionData);
      
      if (response?.data?.submission) {
        const { submission, moduleStatus: updatedModuleStatus } = response.data;
        setScore(submission.score);
        
        if (updatedModuleStatus) {
          setModuleStatus(updatedModuleStatus);
        }

        // Process answers for display
        const processedAnswers = questionData.questions.reduce((acc, question, index) => {
          const submissionAnswer = submission.answers.find(a => a.questionIndex === index) || {};
          const selectedOption = submissionAnswer.selectedOption ?? -1;
          const correctOption = submissionAnswer.correctOption ?? question.correctOption ?? -1;

          return {
            ...acc,
            [index]: {
              selectedOption: selectedOption,
              isCorrect: submissionAnswer.isCorrect ?? false,
              correctOption: correctOption,
              explanation: question.explanation || "No explanation provided",
              selectedAnswer: submissionAnswer.selectedAnswer || "Not answered",
              selectedOptionText: getOptionText(selectedOption, question),
              correctOptionText: getOptionText(correctOption, question)
            }
          };
        }, {});

        setSelectedAnswers(processedAnswers);
        setShowResults(true);
        setShowTimeUpModal(false);

        // If quiz is passed and we're in a course, show success message and redirect
        if (submission.passed && courseId) {
          const message = moduleStatus?.nextModuleUnlocked 
            ? "Congratulations! You've passed the quiz. The next module has been unlocked!"
            : "Congratulations! You've passed the quiz!";
          
          alert(message);
          
          const redirectTimeout = setTimeout(() => {
            navigate(`/courses/${courseId}`);
          }, 3000);

          return () => clearTimeout(redirectTimeout);
        }
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert(err.response?.data?.message || 'Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to safely get option text
  const getOptionText = (optionIndex, question) => {
    if (optionIndex < 0) return "Not answered";
    const option = question.options?.[optionIndex];
    return option?.text || "Option not found";
  };

  const handleTimeUp = () => {
    setShowTimeUpModal(true);
  };

  const handleSubmitClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    calculateAndShowResults();
  };

  const isAnswerSelected = selectedAnswers[currentQuestionIndex] !== undefined;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const allQuestionsAnswered = Object.keys(selectedAnswers).length === totalQuestions;

  const renderResults = () => {
    if (!showResults) return null;

    return (
      <div className="space-y-6">
        {/* Results Summary Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 mb-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdCheck size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-gray-400">{questionData.title}</p>
            {moduleStatus && moduleStatus.completed && (
              <div className="mt-4 text-green-400">
                <p>Module completed successfully!</p>
                {moduleStatus.nextModuleUnlocked && (
                  <p className="text-sm mt-2">Next module has been unlocked</p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-700/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {score}/{totalQuestions}
              </div>
              <div className="text-sm text-gray-400">Total Score</div>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {Math.round((score / totalQuestions) * 100)}%
              </div>
              <div className="text-sm text-gray-400">Accuracy</div>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {Object.values(selectedAnswers).filter(a => a.isCorrect).length}
              </div>
              <div className="text-sm text-gray-400">Correct Answers</div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => navigate("/practice")}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 shadow-lg flex items-center"
            >
              <MdArrowBack className="mr-2" /> Back to Practice
            </button>
          </div>
        </div>

        {/* Questions Review */}
        <div className="space-y-6">
          {questionData.questions.map((question, index) => {
            const answerData = selectedAnswers[index];
            const isAnswered = answerData?.selectedOption >= 0;
            
            return (
              <div
                key={index}
                id={`question-${index}`}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
              >
                {/* Question Header */}
                <div className="p-6 border-b border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-700">
                      <span className="text-gray-300 font-semibold">{index + 1}</span>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-200 flex-1">
                      {question.question}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      !isAnswered 
                        ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                        : answerData?.isCorrect 
                          ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}>
                      {!isAnswered ? "Not Attempted" : (answerData?.isCorrect ? "Correct" : "Incorrect")}
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div className="p-6">
                  <div className="space-y-3">
                    {question.options.map((option, optIndex) => {
                      // Get the selected option and check if current option is correct
                      const isSelected = answerData?.selectedOption === optIndex;
                      const isCorrect = option.isCorrect;
                      const wasAttempted = typeof answerData?.selectedOption !== 'undefined';
                      
                      let optionClass = "";
                      let textClass = "";
                      
                      if (isCorrect) {
                        // Correct answer is always green
                        optionClass = "bg-green-500/20 border-green-500/30";
                        textClass = "text-green-300";
                      } else if (isSelected) {
                        // Selected wrong answer is red
                        optionClass = "bg-red-500/20 border-red-500/30";
                        textClass = "text-red-300";
                      } else {
                        // Unselected and incorrect options
                        optionClass = "bg-gray-700/30 border-gray-600/50";
                        textClass = "text-gray-300";
                      }
                      
                      return (
                        <div
                          key={optIndex}
                          className={`p-4 rounded-lg border ${optionClass}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center flex-1">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                                isCorrect 
                                  ? "border-green-500" 
                                  : isSelected 
                                    ? "border-red-500"
                                    : "border-gray-500"
                              }`}>
                                {(isSelected || isCorrect) && (
                                  <div className={`w-2 h-2 rounded-full ${
                                    isCorrect 
                                      ? "bg-green-500" 
                                      : isSelected ? "bg-red-500" : ""
                                  }`}></div>
                                )}
                              </div>
                              <span className={textClass}>
                                {option.text}
                              </span>
                            </div>
                            <div className="ml-4">
                              {isCorrect && (
                                <div className="flex items-center text-green-400">
                                  <MdCheck size={20} />
                                  <span className="ml-2 text-xs">Correct Answer</span>
                                </div>
                              )}
                              {isSelected && !isCorrect && (
                                <div className="flex items-center text-red-400">
                                  <MdClose size={20} />
                                  <span className="ml-2 text-xs">Incorrect</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {isCorrect && (
                            <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                              <MdInfo size={14} />
                              {isSelected 
                                ? "Well done! This was the correct answer"
                                : wasAttempted 
                                  ? "This was the correct answer"
                                  : "This is the correct answer"}
                            </div>
                          )}
                          {isSelected && !isCorrect && (
                            <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
                              <MdInfo size={14} />
                              Your selection was incorrect
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <div className="flex items-center gap-2 text-blue-300 mb-2">
                      <MdInfo size={20} />
                      <span className="font-medium">Explanation</span>
                    </div>
                    <div className="text-gray-300">
                      {question.explanation || "No explanation provided for this question."}
                    </div>
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
      style={{ marginLeft: isGlobalSidebarOpen ? "16rem" : "5rem" }}
    >
      {/* Header */}
      <div className="border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate("/practice")}
              className="flex items-center text-purple-400 hover:text-purple-300 transition-colors group"
            >
              <MdArrowBack size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Practice
            </button>
            <div className="flex items-center gap-6">
              {!showResults && (
                <>
                  <div className="flex items-center gap-2 text-gray-300">
                    <MdAccessTime size={20} />
                    <Timer timeLimit={questionData.timeLimit} onTimeUp={handleTimeUp} />
                  </div>
                  <button
                    onClick={handleSubmitClick}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Quiz"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex gap-8">
          {/* Main Question Area */}
          <div className="flex-1">
            {!showResults ? (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50">
                {/* Question Header */}
                <div className="p-6 border-b border-gray-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <MdQuiz size={32} className="text-purple-400" />
                    <h1 className="text-2xl font-bold">{questionData.title}</h1>
                  </div>
                  <p className="text-gray-400 mb-4">{questionData.description}</p>
                  <div className="flex gap-3">
                    <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                      {questionData.topic}
                    </span>
                    <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30">
                      {questionData.difficulty}
                    </span>
                  </div>
                </div>

                {/* Question Content */}
                <div className="p-6">
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-100">{currentQuestion.question}</h2>
                      <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
                        <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 transform hover:scale-[1.01] hover:shadow-md ${
                            selectedAnswers[currentQuestionIndex] === index
                              ? "bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-500/50 shadow-lg shadow-purple-500/10"
                              : "bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50 hover:border-gray-500/70"
                          }`}
                          onClick={() => handleAnswerSelect(index)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedAnswers[currentQuestionIndex] === index
                                ? "border-purple-400 bg-purple-400"
                                : "border-gray-400"
                            }`}>
                              {selectedAnswers[currentQuestionIndex] === index && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                            <label className="flex-grow text-gray-200 cursor-pointer">
                              {option.text}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-6 border-t border-gray-700/50">
                    <button
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                      className="px-6 py-3 bg-gray-700/50 text-white rounded-lg hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center group"
                    >
                      <MdArrowBackIos className="mr-2 group-hover:-translate-x-1 transition-transform" /> Previous
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentQuestionIndex === totalQuestions - 1}
                      className="px-6 py-3 bg-gray-700/50 text-white rounded-lg hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center group"
                    >
                      Next <MdArrowForward className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              renderResults()
            )}
          </div>

          {/* Right Sidebar */}
          {!showResults ? (
            <div className="w-80">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sticky top-24 border border-gray-700/50">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Progress Overview</h3>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <span>{answeredCount} of {totalQuestions} completed</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
                  {questionData.questions.map((question, index) => (
                    <QuestionBox
                      key={index}
                      number={index + 1}
                      question={question.question}
                      isAnswered={selectedAnswers[index] !== undefined}
                      isActive={currentQuestionIndex === index}
                      isVisited={visitedQuestions.has(index)}
                      onClick={() => handleQuestionChange(index)}
                    />
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700/50">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                      <span className="text-gray-400">Current</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500/30 border border-green-500 rounded-full"></div>
                      <span className="text-gray-400">Answered</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 justify-end">
                    <div className="w-3 h-3 bg-red-500/30 border border-red-500 rounded-full"></div>
                    <span className="text-gray-400">Visited</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-80">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sticky top-24 border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-4">Questions Review</h3>
              <div className="space-y-2">
                {questionData.questions.map((_, index) => {
                  const answerData = selectedAnswers[index];
                  const isAnswered = answerData?.selectedOption >= 0;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        const element = document.getElementById(`question-${index}`);
                        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all hover:bg-gray-700/50 ${
                        !isAnswered
                          ? "border border-yellow-500/30"
                          : answerData?.isCorrect
                            ? "border border-green-500/30"
                            : "border border-red-500/30"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        !isAnswered
                          ? "bg-yellow-500/20 text-yellow-300"
                          : answerData?.isCorrect
                            ? "bg-green-500/20 text-green-300"
                            : "bg-red-500/20 text-red-300"
                      }`}>
                        {index + 1}
                      </div>
                      <div className={`text-xs ${
                        !isAnswered
                          ? "text-yellow-300"
                          : answerData?.isCorrect
                            ? "text-green-300"
                            : "text-red-300"
                      }`}>
                        {!isAnswered ? "Not Attempted" : (answerData?.isCorrect ? "Correct" : "Incorrect")}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

      {/* Modals */}
      {showTimeUpModal && <TimeUpModal onSubmit={calculateAndShowResults} />}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        answeredQuestions={answeredCount}
        totalQuestions={totalQuestions}
      />
    </div>
  );
};

const style = document.createElement('style');
style.textContent = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(31, 41, 55, 0.5);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.3);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 92, 246, 0.5);
  }
`;
document.head.appendChild(style);

export default McqQuestion;