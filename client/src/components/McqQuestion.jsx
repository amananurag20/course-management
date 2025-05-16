import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdCheck, MdClose } from "react-icons/md";
import mcqQuestions from "../constants/mcqQuestions";
import { useSidebar } from "../context/SidebarContext";
import sensationImage from "../assets/sensation_image.jfif";
import Timer from "./Timer";
import TimeUpModal from "./TimeUpModal";

const McqQuestion = () => {
  const { isGlobalSidebarOpen } = useSidebar();
  const { id: topicId } = useParams();
  const navigate = useNavigate();

  // State for managing multiple questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);

  // Get topic and its questions
  const topic = mcqQuestions.find((t) => t.id === topicId);

  if (!topic) {
    return (
      <div
        className="min-h-screen bg-gray-900 text-white p-8"
        style={{ marginLeft: isGlobalSidebarOpen ? "16rem" : "5rem" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Topic not found</h2>
            <button
              onClick={() => navigate("/practice")}
              className="text-purple-400 hover:text-purple-300 flex items-center justify-center"
            >
              <MdArrowBack size={20} className="mr-2" />
              Back to Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = topic.questions[currentQuestionIndex];
  const totalQuestions = topic.questions.length;

  const handleAnswerSelect = (index) => {
    if (!showResults) {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestionIndex]: index,
      });
    }
  };

  const calculateAndShowResults = () => {
    let totalScore = 0;
    Object.entries(selectedAnswers).forEach(([qIndex, answer]) => {
      if (answer === topic.questions[parseInt(qIndex)].correctAnswer) {
        totalScore++;
      }
    });
    setScore(totalScore);
    setShowResults(true);
    setShowTimeUpModal(false);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateAndShowResults();
    }
  };

  const handleTimeUp = () => {
    setShowTimeUpModal(true);
  };

  const isAnswerSelected = selectedAnswers[currentQuestionIndex] !== undefined;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div
      className="min-h-screen bg-gray-900 text-white p-8 flex"
      style={{ marginLeft: isGlobalSidebarOpen ? "16rem" : "5rem" }}
    >
      <div className="w-[800px]">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/practice")}
            className="flex items-center text-purple-400 hover:text-purple-300"
          >
            <MdArrowBack size={20} className="mr-2" />
            Back to Questions
          </button>
          {!showResults && (
            <Timer timeLimit={topic.timeLimit} onTimeUp={handleTimeUp} />
          )}
        </div>

        {!showResults ? (
          <div className="bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{topic.topic}</h1>
                <span className="text-gray-400">
                  Question {currentQuestionIndex + 1}/{totalQuestions}
                </span>
              </div>
              <p className="text-gray-400 mb-4">{topic.description}</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-purple-900 text-purple-200 rounded-full text-sm">
                  {topic.topic}
                </span>
                <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                  Progress:{" "}
                  {Math.round((currentQuestionIndex / totalQuestions) * 100)}%
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl mb-4">{currentQuestion.question}</h2>
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? "bg-purple-900 border-purple-500"
                        : "bg-gray-700 border-gray-600 hover:bg-gray-600"
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="mcq-answer"
                        checked={
                          selectedAnswers[currentQuestionIndex] === index
                        }
                        onChange={() => handleAnswerSelect(index)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                      />
                      <label className="flex-grow text-gray-200">
                        {option}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleNext}
              disabled={!isAnswerSelected}
            >
              {isLastQuestion ? "Submit Quiz" : "Next Question"}
            </button>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">
              Quiz Results - {topic.topic}
            </h2>
            <div className="mb-6">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {score}/{totalQuestions}
              </div>
              <div className="text-gray-400">
                You got {score} out of {totalQuestions} questions correct (
                {Math.round((score / totalQuestions) * 100)}%)
              </div>
            </div>

            <div className="space-y-6">
              {topic.questions.map((question, index) => {
                const isCorrect =
                  selectedAnswers[index] === question.correctAnswer;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      isCorrect ? "bg-green-900/20" : "bg-red-900/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <MdCheck className="text-green-500" size={24} />
                      ) : (
                        <MdClose className="text-red-500" size={24} />
                      )}
                      <h3 className="font-semibold">Question {index + 1}</h3>
                    </div>
                    <p className="mb-2">{question.question}</p>
                    <div className="text-sm">
                      <div className="text-gray-400 mb-1">Your answer:</div>
                      <div
                        className={
                          isCorrect ? "text-green-400" : "text-red-400"
                        }
                      >
                        {question.options[selectedAnswers[index]]}
                      </div>
                      {!isCorrect && (
                        <>
                          <div className="text-gray-400 mt-2 mb-1">
                            Correct answer:
                          </div>
                          <div className="text-green-400">
                            {question.options[question.correctAnswer]}
                          </div>
                        </>
                      )}
                      <div className="mt-2 text-gray-300">
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors w-full"
              onClick={() => navigate("/practice")}
            >
              Back to Questions
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center pl-8">
        <img
          src={sensationImage}
          alt="Decorative sensation"
          className="max-w-full h-auto object-contain"
          style={{ maxHeight: "80vh" }}
        />
      </div>

      {showTimeUpModal && <TimeUpModal onSubmit={calculateAndShowResults} />}
    </div>
  );
};

export default McqQuestion;
