import React, { useState, useRef, useEffect, useContext } from "react";
import {
  MdArticle,
  MdAccessTime,
  MdPeople,
  MdDragHandle,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { SidebarContext } from "../context/SidebarContext";
import reelService from "../services/reelService";

const Reels = () => {
  const { isGlobalSidebarOpen } = useContext(SidebarContext);
  const globalSidebarWidth = isGlobalSidebarOpen ? 250 : 0;

  const [reelsData, setReelsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const containerRef = useRef(null);
  const sliderRef = useRef(null);
  const mainContainerRef = useRef(null);

  // Fetch reels from backend
  useEffect(() => {
    const fetchReels = async () => {
      try {
        setLoading(true);
        const data = await reelService.getAllReels();
        setReelsData(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch reels:", err);
        setError("Failed to load study reels. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

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

  // Handle reel change
  const handleReelChange = (newIndex) => {
    if (newIndex >= 0 && newIndex < reelsData.length) {
      setCurrentReelIndex(newIndex);
    }
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
  }, [currentReelIndex, reelsData.length]);

  // Touch swipe handler for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartY = 0;
    let touchEndY = 0;
    let isSwiping = false;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      isSwiping = true;
    };

    const handleTouchMove = (e) => {
      if (!isSwiping) return;
      touchEndY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      if (!isSwiping) return;
      isSwiping = false;

      const swipeDistance = touchStartY - touchEndY;
      const minSwipeDistance = 50; // Minimum distance for a swipe

      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
          // Swiped up - go to next reel
          handleReelChange(currentReelIndex + 1);
        } else {
          // Swiped down - go to previous reel
          handleReelChange(currentReelIndex - 1);
        }
      }

      touchStartY = 0;
      touchEndY = 0;
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentReelIndex, reelsData.length]);

  // Mouse drag handler for desktop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let mouseStartY = 0;
    let mouseEndY = 0;
    let isDragging = false;

    const handleMouseDown = (e) => {
      // Only handle left mouse button
      if (e.button !== 0) return;
      mouseStartY = e.clientY;
      isDragging = true;
      container.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      mouseEndY = e.clientY;
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      container.style.cursor = 'grab';

      const dragDistance = mouseStartY - mouseEndY;
      const minDragDistance = 50; // Minimum distance for a drag

      if (Math.abs(dragDistance) > minDragDistance) {
        if (dragDistance > 0) {
          // Dragged up - go to next reel
          handleReelChange(currentReelIndex + 1);
        } else {
          // Dragged down - go to previous reel
          handleReelChange(currentReelIndex - 1);
        }
      }

      mouseStartY = 0;
      mouseEndY = 0;
    };

    const handleMouseLeave = () => {
      if (isDragging) {
        isDragging = false;
        container.style.cursor = 'grab';
      }
    };

    // Set initial cursor
    container.style.cursor = 'grab';

    container.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.style.cursor = 'default';
    };
  }, [currentReelIndex, reelsData.length]);

  if (loading) {
    return (
      <div
        className="h-screen w-full bg-black flex items-center justify-center transition-all duration-300"
        style={{ paddingLeft: `${globalSidebarWidth}px` }}
      >
        <div className="text-white text-xl">Loading study reels...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="h-screen w-full bg-black flex items-center justify-center transition-all duration-300"
        style={{ paddingLeft: `${globalSidebarWidth}px` }}
      >
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  if (reelsData.length === 0) {
    return (
      <div
        className="h-screen w-full bg-black flex items-center justify-center transition-all duration-300"
        style={{ paddingLeft: `${globalSidebarWidth}px` }}
      >
        <div className="text-white text-xl">No study reels available</div>
      </div>
    );
  }

  const currentReel = reelsData[currentReelIndex];

  return (
    <div
      className="h-screen w-full bg-black flex transition-all duration-300"
      style={{ paddingLeft: `${globalSidebarWidth}px` }}
    >
      {/* Fixed Sidebar */}
      <div
        className="w-[280px] h-full bg-gray-900 flex-shrink-0 border-r border-gray-800 fixed top-0 transition-all duration-300 overflow-y-auto"
        style={{ left: `${globalSidebarWidth}px` }}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold text-white mb-4">
            JavaScript Concepts
          </h2>
          <div className="space-y-2">
            {reelsData.map((reel, index) => (
              <div
                key={reel._id}
                onClick={() => handleReelChange(index)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${currentReelIndex === index
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
        {/* Left Side - YouTube Embed */}
        <div
          className="h-full flex items-center justify-center bg-black"
          style={{ width: `${leftPanelWidth}%` }}
        >
          <div
            ref={containerRef}
            className="relative h-[90vh] w-[90%] max-w-[500px] overflow-hidden bg-black rounded-xl shadow-2xl"
          >
            {/* YouTube Embed */}
            <iframe
              key={currentReel.embedUrl}
              className="w-full h-full"
              src={`${currentReel.embedUrl}?autoplay=1&mute=0&loop=1&playlist=${currentReel.embedUrl.split('/').pop()}`}
              title={currentReel.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            {/* Video Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
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

            {/* Navigation Controls - Right Side */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-3 z-30 pointer-events-auto">
              {/* Up Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReelChange(currentReelIndex - 1);
                }}
                disabled={currentReelIndex === 0}
                className={`p-2 rounded-full transition-all ${currentReelIndex === 0
                    ? "bg-gray-700/30 text-gray-600 cursor-not-allowed"
                    : "bg-black/40 text-white hover:bg-purple-600 hover:scale-110"
                  } backdrop-blur-sm`}
                title="Previous reel"
              >
                <MdKeyboardArrowUp size={24} />
              </button>

              {/* Reel Indicators */}
              <div className="flex flex-col space-y-2 py-2">
                {reelsData.map((_, index) => (
                  <div
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReelChange(index);
                    }}
                    className={`w-1 h-5 rounded-full transition-all duration-300 cursor-pointer ${index === currentReelIndex
                        ? "bg-white scale-y-125"
                        : "bg-white/30 scale-100 hover:bg-white/50"
                      }`}
                  />
                ))}
              </div>

              {/* Down Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReelChange(currentReelIndex + 1);
                }}
                disabled={currentReelIndex === reelsData.length - 1}
                className={`p-2 rounded-full transition-all ${currentReelIndex === reelsData.length - 1
                    ? "bg-gray-700/30 text-gray-600 cursor-not-allowed"
                    : "bg-black/40 text-white hover:bg-purple-600 hover:scale-110"
                  } backdrop-blur-sm`}
                title="Next reel"
              >
                <MdKeyboardArrowDown size={24} />
              </button>
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
              <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {currentReel.article.content}
              </div>
            </div>

            {/* Code Examples */}
            {currentReel.article.codeExamples &&
              currentReel.article.codeExamples.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Code Examples
                  </h3>
                  <div className="space-y-4">
                    {currentReel.article.codeExamples.map((example, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-purple-400 font-medium mb-2">
                          {example.title}
                        </h4>
                        <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
                          <code className="text-green-400 text-sm">
                            {example.code}
                          </code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Related Links */}
            {currentReel.article.relatedLinks &&
              currentReel.article.relatedLinks.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Related Resources
                  </h3>
                  <div className="space-y-3">
                    {currentReel.article.relatedLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <MdArticle className="text-gray-400 mr-3" size={24} />
                        <span className="text-gray-300">{link.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reels;
