import React from 'react';
import { MdWarning, MdClose } from 'react-icons/md';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, answeredQuestions, totalQuestions }) => {
  if (!isOpen) return null;

  const unansweredCount = totalQuestions - answeredQuestions;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative z-10 border border-purple-500/20">
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <MdClose size={24} />
          </button>
        </div>

        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <MdWarning className="text-yellow-500" size={32} />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-center text-white mb-4">
          Submit Quiz?
        </h3>

        <div className="text-center mb-6">
          <p className="text-gray-300 mb-2">
            You have answered {answeredQuestions} out of {totalQuestions} questions.
          </p>
          {unansweredCount > 0 && (
            <p className="text-yellow-400 text-sm">
              Warning: {unansweredCount} question{unansweredCount > 1 ? 's' : ''} still unanswered!
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Review Questions
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 