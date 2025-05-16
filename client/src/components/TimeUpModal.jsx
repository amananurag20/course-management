import React from "react";
import { MdAccessTime } from "react-icons/md";

const TimeUpModal = ({ onSubmit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 animate-bounce-in">
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-600 p-3 rounded-full mb-4">
            <MdAccessTime size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Time's Up!</h2>
          <p className="text-gray-300 mb-6">
            Your time for this quiz has expired. Your answers will be
            automatically submitted.
          </p>
          <button
            onClick={onSubmit}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-500 transition-colors"
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeUpModal;
