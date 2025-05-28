import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { courseService } from "../services/courseService";
import VideoPlayer from "./VideoPlayer";
import { useSidebar } from "../context/SidebarContext";
import {
  MdPlayCircle,
  MdCheck,
  MdChevronRight,
  MdArrowBack,
  MdOndemandVideo,
  MdArticle,
  MdExpandMore,
  MdExpandLess,
  MdLock,
  MdLockOpen,
  MdQuiz,
  MdCode,
} from "react-icons/md";

const CourseViewer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isGlobalSidebarOpen } = useSidebar();
  const { user } = useSelector((state) => state.auth);
  const [course, setCourse] = useState(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentResourceIndex, setCurrentResourceIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState(new Set([0]));
  const [unlockedModules, setUnlockedModules] = useState(new Set([0]));

  // Function to extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const courseData = await courseService.getCourseById(courseId);
        setCourse(courseData);
        
        // Initialize unlocked modules based on completion status
        const unlocked = new Set([0]); // First module always unlocked
        courseData.modules.forEach((module, index) => {
          const prevModule = index > 0 ? courseData.modules[index - 1] : null;
          if (prevModule) {
            const isCompleted = prevModule.completedBy?.some(
              completion => completion.user === user?.userId
            );
            if (isCompleted) {
              unlocked.add(index);
            }
          }
        });
        setUnlockedModules(unlocked);
      } catch (err) {
        setError(err.message || "Failed to fetch course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, user?.userId]);

  const handleModuleChange = (index) => {
    if (!unlockedModules.has(index)) {
      alert("Please complete the previous module first to unlock this one.");
      return;
    }
    setCurrentModuleIndex(index);
    setCurrentResourceIndex(0);
  };

  const handleResourceChange = (moduleIndex, resourceIndex) => {
    if (!unlockedModules.has(moduleIndex)) {
      alert("This module is locked. Complete the previous module first.");
      return;
    }
    setCurrentModuleIndex(moduleIndex);
    setCurrentResourceIndex(resourceIndex);
  };

  const toggleModuleExpansion = (index, event) => {
    event.stopPropagation();
    setExpandedModules((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(index)) {
        newExpanded.delete(index);
      } else {
        newExpanded.add(index);
      }
      return newExpanded;
    });
  };

  const handleLockedResourceClick = () => {
    alert("This module is locked. Please complete the previous module first to unlock this content.");
  };

  const handleMcqClick = (mcqId) => {
    if (mcqId) {
      navigate(`/practice/mcq/${mcqId}`);
    }
  };

  const isModuleLocked = (moduleIndex) => {
    return !unlockedModules.has(moduleIndex);
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
  </div>;

  if (error) return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-red-500">{error}</div>
  </div>;

  if (!course) return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-white">Course not found</div>
  </div>;

  const currentModule = course.modules[currentModuleIndex];
  const currentResource = currentModule?.resources?.[currentResourceIndex];
  const videoId = currentResource?.type === "video" ? getYouTubeId(currentResource.url) : null;

  return (
    <div className="min-h-screen bg-gray-900 text-white transition-[margin,width] duration-300"
      style={{
        marginLeft: isGlobalSidebarOpen ? "256px" : "80px",
        width: `calc(100% - ${isGlobalSidebarOpen ? "256px" : "80px"})`,
      }}>
      <div className="grid grid-cols-1 lg:grid-cols-3 h-screen">
        {/* Main Content Area */}
        <div className="lg:col-span-2 bg-gray-900 flex flex-col h-screen">
          <div className="flex-none p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full">
                  <MdArrowBack size={24} />
                </button>
                <div className="ml-3">
                  <h1 className="text-2xl font-bold">{course.title}</h1>
                  <p className="text-gray-400 text-sm mt-1">
                    Module {currentModuleIndex + 1} of {course.modules.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Video Container */}
              {!isModuleLocked(currentModuleIndex) && (
                <>
                  <div className="bg-gray-800/50 rounded-xl overflow-hidden shadow-lg">
                    <div className="relative" style={{ paddingTop: "56.25%" }}>
                      {videoId ? (
                        <div className="absolute inset-0">
                          <VideoPlayer videoId={videoId} />
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <MdPlayCircle className="mx-auto text-gray-400" size={48} />
                            <p className="mt-4 text-gray-400 text-sm">
                              {currentResource ? "This resource is not a video" : "Select a video resource to play"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Module Content */}
                  <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm shadow-lg">
                    <h2 className="text-xl font-bold mb-3">{currentModule.title}</h2>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 text-sm leading-relaxed">{currentModule.content}</p>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setCurrentResourceIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentResourceIndex === 0}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 
                        ${currentResourceIndex === 0 ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-700/50 hover:bg-gray-700/70 text-gray-300'}`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => {
                        if (currentResourceIndex === currentModule.resources.length - 1 && currentModule.mcqQuestion) {
                          handleMcqClick(currentModule.mcqQuestion);
                        } else {
                          setCurrentResourceIndex(prev => Math.min(prev + 1, currentModule.resources.length - 1));
                        }
                      }}
                      className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 
                        rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      {currentResourceIndex === currentModule.resources.length - 1
                        ? (currentModule.mcqQuestion ? 'Take Quiz' : 'Complete Module')
                        : 'Next Resource'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Module List */}
        <div className="lg:col-span-1 bg-gray-800 border-l border-gray-700/50">
          <div className="h-full flex flex-col">
            <h2 className="text-xl font-bold p-4 px-6 text-white border-b border-gray-700/50 flex-shrink-0 
              bg-gray-800/95 backdrop-blur-sm sticky top-0 z-10">
              Course Content
            </h2>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-4 space-y-2">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module._id}
                    className={`rounded-lg overflow-hidden bg-gray-750/30 transition-all duration-300 
                      ${isModuleLocked(moduleIndex) ? 'opacity-75' : ''}`}>
                    <button
                      onClick={() => handleModuleChange(moduleIndex)}
                      className={`w-full flex items-center p-3 text-left transition-all duration-200 
                        ${currentModuleIndex === moduleIndex ? "bg-blue-500/10" : "hover:bg-gray-700/30"}
                        ${isModuleLocked(moduleIndex) ? 'cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center w-full">
                        <div className="flex-shrink-0 mr-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                            ${isModuleLocked(moduleIndex) ? 'bg-gray-700/50' : 
                              moduleIndex <= currentModuleIndex ? "bg-blue-500/10" : "bg-gray-700/50"}`}>
                            {isModuleLocked(moduleIndex) ? (
                              <MdLock className="text-gray-400" size={18} />
                            ) : module.completedBy?.some(c => c.user === user?.userId) ? (
                              <MdCheck className="text-blue-500" size={18} />
                            ) : (
                              <span className="text-gray-400 text-sm font-medium">{moduleIndex + 1}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex-grow min-w-0 mr-2">
                          <div className="flex items-center justify-between">
                            <span className={`font-medium truncate 
                              ${currentModuleIndex === moduleIndex ? "text-blue-100" : "text-gray-300"}`}>
                              {module.title}
                            </span>
                            <div className="flex items-center space-x-2">
                              {module.mcqQuestion && (
                                <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300">
                                  Quiz
                                </span>
                              )}
                              <span className="text-xs text-gray-500">
                                {module.resources?.length || 0} videos
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => toggleModuleExpansion(moduleIndex, e)}
                          className={`p-1.5 rounded-lg transition-colors 
                            ${expandedModules.has(moduleIndex) ? "bg-blue-500/10 text-blue-400" 
                              : "text-gray-400 hover:bg-gray-700/50"}`}
                        >
                          {expandedModules.has(moduleIndex) ? (
                            <MdExpandLess size={20} />
                          ) : (
                            <MdExpandMore size={20} />
                          )}
                        </button>
                      </div>
                    </button>

                    {/* Module Resources List with Animation */}
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden
                      ${expandedModules.has(moduleIndex) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className={`py-1 pl-[52px] border-l-2 border-gray-700/50 
                        ${isModuleLocked(moduleIndex) ? 'opacity-75' : ''}`}>
                        {module.resources?.map((resource, resourceIndex) => (
                          <button
                            key={resourceIndex}
                            onClick={() => isModuleLocked(moduleIndex) 
                              ? handleLockedResourceClick() 
                              : handleResourceChange(moduleIndex, resourceIndex)}
                            className={`w-full flex items-center pl-4 pr-3 py-2 text-left 
                              transition-all duration-200
                              ${currentModuleIndex === moduleIndex && currentResourceIndex === resourceIndex && !isModuleLocked(moduleIndex)
                                ? "bg-blue-500/10 border-l-2 border-blue-400 -ml-[2px]"
                                : "hover:bg-gray-700/30"}`}
                          >
                            <div className="flex items-center w-full min-w-0">
                              <div className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center mr-3
                                ${currentModuleIndex === moduleIndex && currentResourceIndex === resourceIndex && !isModuleLocked(moduleIndex)
                                  ? "text-blue-400" : "text-gray-400"}`}>
                                {resource.type === "video" ? (
                                  <MdOndemandVideo size={16} />
                                ) : (
                                  <MdArticle size={16} />
                                )}
                              </div>
                              <span className={`text-sm truncate block 
                                ${currentModuleIndex === moduleIndex && currentResourceIndex === resourceIndex && !isModuleLocked(moduleIndex)
                                  ? "text-blue-100" : "text-gray-400"}`}>
                                {resource.title}
                              </span>
                            </div>
                          </button>
                        ))}
                        {module.mcqQuestion && (
                          <button
                            onClick={() => isModuleLocked(moduleIndex) 
                              ? handleLockedResourceClick() 
                              : handleMcqClick(module.mcqQuestion)}
                            className={`w-full flex items-center pl-4 pr-3 py-2 text-left 
                              transition-all duration-200 hover:bg-gray-700/30
                              ${isModuleLocked(moduleIndex) ? 'cursor-not-allowed' : ''}`}
                          >
                            <div className="flex items-center w-full min-w-0">
                              <div className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center mr-3 text-purple-400">
                                <MdQuiz size={16} />
                              </div>
                              <span className="text-sm truncate block text-purple-300">
                                Module Quiz
                              </span>
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
