import React, { useState, useRef, useEffect, useContext } from "react";
import {
  MdVolumeUp,
  MdVolumeOff,
  MdPlayArrow,
  MdArticle,
  MdCode,
  MdAccessTime,
  MdPeople,
  MdDragHandle,
} from "react-icons/md";
import { SidebarContext } from "../context/SidebarContext"; // Assuming this is where your sidebar context is

// Import videos
import video1 from "../assets/videos/1.mp4";
import video2 from "../assets/videos/2.mp4";
import video3 from "../assets/videos/3.mp4";

const reelsData = [
  {
    id: 1,
    url: video1,
    title: "React Fundamentals",
    description: "Learn the basics of React in this quick tutorial",
    author: "John Doe",
    article: {
      title: "Understanding React Core Concepts",
      content: `React is a JavaScript library for building user interfaces. Let's dive deep into its core concepts:

1. Components
- Building blocks of React applications
- Reusable and modular pieces of UI
- Can be functional or class-based

2. Props
- Way to pass data between components
- Read-only and immutable
- Enable component reusability

3. State
- Internal component data
- Can be modified using setState
- Triggers re-rendering when updated

4. Hooks
- Enable state and lifecycle in functional components
- useState, useEffect are commonly used
- Custom hooks for reusable logic`,
      readTime: "5 min read",
      difficulty: "Beginner",
      topics: ["React", "JavaScript", "Web Development"],
      relatedLinks: [
        { title: "React Documentation", url: "#" },
        { title: "Component Lifecycle", url: "#" },
      ],
    },
  },
  {
    id: 2,
    url: video2,
    title: "Advanced JavaScript Concepts",
    description: "Deep dive into JavaScript advanced topics",
    author: "Jane Smith",
    article: {
      title: "Mastering JavaScript Advanced Patterns",
      content: `Let's explore advanced JavaScript concepts that every developer should know:

1. Closures
- Function bundled with its lexical environment
- Enables data privacy
- Used in module patterns

2. Prototypes
- Objects inherit properties and methods
- Basis for inheritance in JavaScript
- Prototype chain and __proto__

3. Async Programming
- Promises and async/await
- Event loop understanding
- Error handling patterns

4. Design Patterns
- Module pattern
- Factory pattern
- Observer pattern`,
      readTime: "8 min read",
      difficulty: "Advanced",
      topics: ["JavaScript", "Programming Patterns", "Web Development"],
      relatedLinks: [
        { title: "JavaScript MDN Docs", url: "#" },
        { title: "Design Patterns Guide", url: "#" },
      ],
    },
  },
  {
    id: 3,
    url: video3,
    title: "CSS Grid Mastery",
    description: "Master CSS Grid layout system",
    author: "Mike Johnson",
    article: {
      title: "Complete Guide to CSS Grid",
      content: `CSS Grid is a powerful layout system. Here's what you need to know:

1. Grid Container
- display: grid
- grid-template-columns
- grid-template-rows

2. Grid Items
- grid-column
- grid-row
- span functionality

3. Grid Areas
- Named grid areas
- Template areas
- Responsive layouts

4. Advanced Features
- Auto-fit and auto-fill
- Minmax function
- Grid alignment`,
      readTime: "6 min read",
      difficulty: "Intermediate",
      topics: ["CSS", "Web Design", "Layout"],
      relatedLinks: [
        { title: "CSS Grid Guide", url: "#" },
        { title: "Grid Examples", url: "#" },
      ],
    },
  },
];

const Reels = () => {
  const { isGlobalSidebarOpen } = useContext(SidebarContext);
  const globalSidebarWidth = isGlobalSidebarOpen ? 250 : 0;

  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // Default 50%
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const sliderRef = useRef(null);
  const mainContainerRef = useRef(null);

  // Handle slider drag
  useEffect(() => {
    const slider = sliderRef.current;
    const mainContainer = mainContainerRef.current;
    let isDragging = false;
    let startX = 0;
    let startWidth = 0;

    const handleMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX;
      startWidth = leftPanelWidth;
      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (!isDragging || !mainContainer) return;

      const delta = e.clientX - startX;
      const containerWidth = mainContainer.offsetWidth;
      const newWidth = startWidth + (delta / containerWidth) * 100;

      // Limit the width between 30% and 70%
      const clampedWidth = Math.min(Math.max(newWidth, 30), 70);
      setLeftPanelWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    if (slider && mainContainer) {
      slider.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (slider && mainContainer) {
        slider.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [leftPanelWidth]);

  // Handle video progress update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  // Handle video duration loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Handle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle mute/unmute
  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle reel change
  const handleReelChange = (newIndex) => {
    if (newIndex >= 0 && newIndex < reelsData.length) {
      setCurrentReelIndex(newIndex);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  // Effect to handle video playback when source changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      if (isPlaying) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            setIsPlaying(false);
          });
        }
      }
    }
  }, [currentReelIndex, isPlaying, isMuted]);

  // Format time (seconds -> mm:ss)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Wheel event handler
  useEffect(() => {
    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > 50) {
        if (e.deltaY > 0) {
          handleReelChange(currentReelIndex + 1);
        } else {
          handleReelChange(currentReelIndex - 1);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [currentReelIndex]);

  const currentReel = reelsData[currentReelIndex];

  return (
    <div
      className="h-screen w-full bg-black flex transition-all duration-300"
      style={{ paddingLeft: `${globalSidebarWidth}px` }}
    >
      {/* Fixed Sidebar */}
      <div
        className="w-[280px] h-full bg-gray-900 flex-shrink-0 border-r border-gray-800 fixed top-0 transition-all duration-300"
        style={{ left: `${globalSidebarWidth}px` }}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold text-white mb-4">
            Course Navigation
          </h2>
          {/* Navigation items */}
          <div className="space-y-2">
            {reelsData.map((reel, index) => (
              <div
                key={reel.id}
                onClick={() => handleReelChange(index)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  currentReelIndex === index
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <h3 className="font-medium">{reel.title}</h3>
                <p className="text-sm opacity-75 mt-1">{reel.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="flex-1 h-full flex transition-all duration-300"
        style={{ marginLeft: "280px" }}
        ref={mainContainerRef}
      >
        {/* Left Side - Reels */}
        <div
          className="h-full flex items-center justify-center bg-black"
          style={{ width: `${leftPanelWidth}%` }}
        >
          <div
            ref={containerRef}
            className="relative h-[90vh] w-[90%] max-w-[500px] overflow-hidden bg-black rounded-xl shadow-2xl"
          >
            {/* Main Video Container with Click Handler */}
            <div className="absolute inset-0 z-10" onClick={togglePlayPause}>
              <video
                key={currentReel.url}
                ref={videoRef}
                className="w-full h-full object-cover"
                src={currentReel.url}
                loop
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />

              {/* Play/Pause Indicator */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-4 rounded-full bg-black/30 text-white backdrop-blur-sm animate-pulse">
                    <MdPlayArrow size={48} />
                  </div>
                </div>
              )}
            </div>

            {/* Controls Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
                {/* Time Display */}
                <div className="flex items-center space-x-2 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-white text-sm font-medium">
                    {formatTime((duration * progress) / 100)} /{" "}
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Mute Button */}
                <button
                  onClick={toggleMute}
                  className="pointer-events-auto p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all transform hover:scale-105 backdrop-blur-sm"
                >
                  {isMuted ? (
                    <MdVolumeOff size={24} />
                  ) : (
                    <MdVolumeUp size={24} />
                  )}
                </button>
              </div>

              {/* Video Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <div className="text-white">
                  <h3 className="text-xl font-bold">{currentReel.title}</h3>
                  <p className="text-sm text-gray-300 flex items-center">
                    <span className="inline-block h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mr-2"></span>
                    @{currentReel.author}
                  </p>
                  <p className="text-sm mt-2 opacity-90">
                    {currentReel.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/50 z-30">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Reel Indicators */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-3 z-30 pointer-events-auto">
              {reelsData.map((_, index) => (
                <div
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReelChange(index);
                  }}
                  className={`w-1 h-5 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentReelIndex
                      ? "bg-white scale-y-125"
                      : "bg-white/30 scale-100 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Resizable Slider */}
        <div
          ref={sliderRef}
          className="w-2 h-full bg-gray-600 hover:bg-purple-500 cursor-col-resize flex items-center justify-center group z-50"
        >
          <div className="absolute p-2 bg-gray-800 rounded-full group-hover:bg-purple-600 cursor-col-resize">
            <MdDragHandle className="text-white transform rotate-90" />
          </div>
        </div>

        {/* Right Side - Article Content */}
        <div
          className="h-full bg-gray-900 overflow-y-auto"
          style={{ width: `${100 - leftPanelWidth}%` }}
        >
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                {currentReel.article.title}
              </h2>
              <div className="flex items-center space-x-4 text-gray-400 mb-4">
                <div className="flex items-center">
                  <MdAccessTime className="mr-1" />
                  <span>{currentReel.article.readTime}</span>
                </div>
                <div className="flex items-center">
                  <MdPeople className="mr-1" />
                  <span>{currentReel.article.difficulty}</span>
                </div>
              </div>
            </div>

            {/* Topics */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {currentReel.article.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 whitespace-pre-wrap">
                {currentReel.article.content}
              </div>
            </div>

            {/* Related Links */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">
                Related Resources
              </h3>
              <div className="space-y-3">
                {currentReel.article.relatedLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="flex items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <MdArticle className="text-gray-400 mr-3" size={24} />
                    <span className="text-gray-300">{link.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reels;
