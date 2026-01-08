import React, { useState } from "react";
import { MdArrowBack, MdCheck, MdClose } from "react-icons/md";

// Mock questions data - In a real app, this would come from an API
const mockQuestions = {
  "Basic Concepts": [
    {
      id: 1,
      question: "What is hoisting in JavaScript?",
      options: [
        "Moving declarations to the top of the scope",
        "Moving variables to the bottom of the scope",
        "Removing unused variables",
        "Converting variables to constants",
      ],
      correctAnswer: 0,
      explanation:
        "Hoisting is JavaScript's default behavior of moving declarations to the top of the current scope before code execution.",
    },
    {
      id: 2,
      question: "What is the difference between let and var?",
      options: [
        "No difference",
        "let is block-scoped, var is function-scoped",
        "var is block-scoped, let is function-scoped",
        "let is only for numbers",
      ],
      correctAnswer: 1,
      explanation:
        "let introduces block scope, while var is function-scoped. let also doesn't allow redeclaration of variables in the same scope.",
    },
    {
      id: 3,
      question: "What is the purpose of 'use strict' in JavaScript?",
      options: [
        "To make code run faster",
        "To enable new JavaScript features",
        "To catch common coding mistakes and prevent unsafe actions",
        "To disable JavaScript warnings",
      ],
      correctAnswer: 2,
      explanation:
        "'use strict' enables strict mode which helps catch common coding mistakes and prevents unsafe actions in JavaScript.",
    },
  ],
  "Arrays and Objects": [
    {
      id: 1,
      question: "Which method adds elements to the end of an array?",
      options: ["push()", "unshift()", "append()", "add()"],
      correctAnswer: 0,
      explanation:
        "push() adds one or more elements to the end of an array and returns the new length.",
    },
  ],
  // Add more sections as needed
};

function PracticeQuestions({ section, category, onBack }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());

  const questions = mockQuestions[section] || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);
    setAnsweredQuestions((prev) => new Set(prev).add(currentQuestionIndex));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-purple-500 hover:text-purple-400 mb-4 transition-colors"
        >
          <MdArrowBack className="mr-2" size={24} />
          Back to {category} Practice
        </button>
        <h1 className="text-3xl font-bold mb-2">{section}</h1>
        <p className="text-gray-400">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </div>

      {/* Question Card */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="text-gray-400">
                {answeredQuestions.size}/{questions.length} Completed
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (answeredQuestions.size / questions.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Question */}
          <h2 className="text-xl font-semibold mb-6">
            {currentQuestion?.question}
          </h2>

          {/* Options */}
          <div className="space-y-4">
            {currentQuestion?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                  selectedAnswer === null
                    ? "bg-gray-700 hover:bg-gray-600"
                    : selectedAnswer === index
                    ? index === currentQuestion.correctAnswer
                      ? "bg-green-600"
                      : "bg-red-600"
                    : index === currentQuestion.correctAnswer && showExplanation
                    ? "bg-green-600"
                    : "bg-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showExplanation &&
                    index === currentQuestion.correctAnswer && (
                      <MdCheck className="text-white" size={24} />
                    )}
                  {showExplanation &&
                    selectedAnswer === index &&
                    index !== currentQuestion.correctAnswer && (
                      <MdClose className="text-white" size={24} />
                    )}
                </div>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Explanation:</h3>
              <p className="text-gray-300">{currentQuestion?.explanation}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={
                currentQuestionIndex === questions.length - 1 ||
                !showExplanation
              }
              className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PracticeQuestions;
