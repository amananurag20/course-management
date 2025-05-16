import React, { useState, useEffect, useCallback } from "react";
import { MdTimer } from "react-icons/md";

const Timer = ({ timeLimit, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // Convert minutes to seconds
  const [isWarning, setIsWarning] = useState(false);

  // Format time to mm:ss
  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }

        // Set warning when 1 minute remaining
        if (prevTime === 60) {
          setIsWarning(true);
        }

        return prevTime - 1;
      });
    }, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, [onTimeUp]);

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full ${
        isWarning
          ? "bg-red-600 text-white animate-pulse"
          : "bg-gray-700 text-gray-200"
      }`}
    >
      <MdTimer size={20} />
      <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
    </div>
  );
};

export default Timer;
