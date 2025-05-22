import React, { useEffect } from 'react';
import { MdAccessTime } from 'react-icons/md';

const TimeUpModal = ({ onSubmit }) => {
  useEffect(() => {
    // Auto submit after showing the modal for 3 seconds
    const timer = setTimeout(() => {
      onSubmit();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onSubmit]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative z-10 border border-red-500/20">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <MdAccessTime className="text-red-500" size={32} />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-center text-white mb-4">
          Time's Up!
        </h3>

        <div className="text-center mb-6">
          <p className="text-gray-300 mb-2">
            Your quiz will be automatically submitted in 3 seconds...
          </p>
          <div className="mt-4">
            <div className="animate-pulse inline-block px-4 py-2 bg-red-500/20 text-red-400 rounded-lg">
              Submitting Quiz...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeUpModal;
