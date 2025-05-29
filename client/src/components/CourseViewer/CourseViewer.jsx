import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { courseService } from "../../services/courseService";
import VideoPlayer from "../VideoPlayer";
import { useSidebar } from "../../context/SidebarContext";
import Notes from "./Notes";
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
  MdNoteAdd,
  MdEdit,
  MdDelete,
  MdSave,
  MdClose,
  MdTimer,
  MdTimerOff,
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
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
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingTimestamp, setEditingTimestamp] = useState(false);
  const [timestampInput, setTimestampInput] = useState("");
  const videoPlayerRef = useRef(null);
  const [editorContent, setEditorContent] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [textAlignment, setTextAlignment] = useState('left');
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState(new Set());
  const [textDirection, setTextDirection] = useState('ltr');

  // Calculate current module and resource
  const currentModule = course?.modules?.[currentModuleIndex];
  const currentResource = currentModule?.resources?.[currentResourceIndex];

  // Function to extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  console.log({user})

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const courseData = await courseService.getCourseById(courseId);
        setCourse(courseData);
        
        // Initialize unlocked modules based on completion status
        const unlocked = new Set([0]); // First module always unlocked
        courseData.modules.forEach((module, index) => {
          if (index > 0) { // Skip first module as it's always unlocked
            const prevModule = courseData.modules[index - 1];
            
            // If previous module has no MCQ, automatically unlock current module
            if (!prevModule.mcqQuestion) {
              unlocked.add(index);
            } else {
              // Check if user has completed the MCQ in previous module
              const isUserCompletedPrevModule = prevModule.completedBy?.some(
                completion => completion.user === user?._id
              );
              if (isUserCompletedPrevModule) {
                unlocked.add(index);
              }
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
  }, [courseId, user?._id]);

  const handleModuleChange = (index) => {
    if (!unlockedModules.has(index)) {
      const prevModule = course.modules[index - 1];
      const message = prevModule.mcqQuestion 
        ? "Please complete the previous module's quiz to unlock this module."
        : "This module is currently locked.";
      alert(message);
      return;
    }
    setCurrentModuleIndex(index);
    setCurrentResourceIndex(0);
  };

  const handleResourceChange = (moduleIndex, resourceIndex) => {
    if (!unlockedModules.has(moduleIndex)) {
      const prevModule = course.modules[moduleIndex - 1];
      const message = prevModule.mcqQuestion 
        ? "This module is locked. Complete the previous module's quiz first."
        : "This module is currently locked.";
      alert(message);
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
    const prevModule = course.modules[currentModuleIndex - 1];
    const message = prevModule.mcqQuestion 
      ? "This module is locked. Complete the previous module's quiz first to unlock this content."
      : "This module is currently locked.";
    alert(message);
  };

  const handleMcqClick = (mcqId) => {
    if (mcqId) {
      navigate(`/practice/mcq/${mcqId}?courseId=${courseId}&moduleIndex=${currentModuleIndex}`);
    }
  };

  const isModuleLocked = (moduleIndex) => {
    return !unlockedModules.has(moduleIndex);
  };

  // Function to format seconds to mm:ss
  const formatTimestamp = (seconds) => {
    if (seconds === null || seconds === undefined) return "";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Function to parse timestamp input (mm:ss)
  const parseTimestamp = (input) => {
    const [minutes, seconds] = input.split(":").map(Number);
    if (isNaN(minutes) || isNaN(seconds) || seconds >= 60) return null;
    return minutes * 60 + seconds;
  };

  // Function to validate timestamp format
  const validateTimestamp = (input) => {
    return /^[0-9]{1,2}:[0-5][0-9]$/.test(input);
  };

  // Function to handle timestamp input change
  const handleTimestampChange = (e) => {
    const value = e.target.value;
    if (value.length <= 5) {
      setTimestampInput(value);
    }
  };

  // Function to handle timestamp input blur
  const handleTimestampBlur = () => {
    if (validateTimestamp(timestampInput)) {
      const seconds = parseTimestamp(timestampInput);
      if (seconds !== null) {
        setCurrentVideoTime(seconds);
      }
    }
    setEditingTimestamp(false);
  };

  // Function to handle timestamp input key press
  const handleTimestampKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleTimestampBlur();
    }
  };

  // Function to handle time update from video player
  const handleTimeUpdate = (time) => {
    setCurrentVideoTime(Math.floor(time));
  };

  // Function to fetch notes for current resource
  const fetchNotes = async () => {
    if (!course || !currentResource || !user?._id) return;
    try {
      const response = await courseService.getResourceNotes(courseId, currentModuleIndex, currentResourceIndex);
      setNotes(response.notes);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  // Add useEffect to fetch notes when resource changes
  useEffect(() => {
    if (course && currentResource && user?._id) {
      fetchNotes();
    } else {
      setNotes([]); // Reset notes when no resource is selected
    }
  }, [course, currentModuleIndex, currentResourceIndex, user?._id]);

  // Function to check if format is active
  const isFormatActive = (command) => {
    try {
      return document.queryCommandState(command);
    } catch (e) {
      return false;
    }
  };

  // Function to check text alignment
  const checkTextAlignment = () => {
    if (isFormatActive('justifyCenter')) return 'center';
    if (isFormatActive('justifyRight')) return 'right';
    return 'left';
  };

  // Function to update active formats
  const updateActiveFormats = () => {
    if (!editorRef.current) return;
    
    const formats = new Set();
    ['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList'].forEach(format => {
      if (isFormatActive(format)) {
        formats.add(format);
      }
    });
    setActiveFormats(formats);
    setTextAlignment(checkTextAlignment());
  };

  // Function to handle editor input with proper cursor positioning
  const handleEditorInput = (e) => {
    const content = e.currentTarget.innerHTML;
    
    // Save current selection before React updates
    const selection = window.getSelection();
    let cursorPosition = null;
    
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(e.currentTarget);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      cursorPosition = preCaretRange.toString().length;
    }

    // Update content state
    if (editingNoteId) {
      setEditingContent(content);
    } else {
      setEditorContent(content);
    }
    updateActiveFormats();

    // Restore cursor position after React re-render
    if (cursorPosition !== null) {
      requestAnimationFrame(() => {
        if (!editorRef.current) return;

        // Get all text nodes in the editor
        const walker = document.createTreeWalker(
          editorRef.current,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );

        let node;
        let currentLength = 0;
        let targetNode = null;
        let targetOffset = 0;

        // Find the text node and offset where cursor should be placed
        while ((node = walker.nextNode())) {
          const nodeLength = node.length;
          if (currentLength + nodeLength >= cursorPosition) {
            targetNode = node;
            targetOffset = cursorPosition - currentLength;
            break;
          }
          currentLength += nodeLength;
        }

        // If we found the target node, set the cursor position
        if (targetNode) {
          const newRange = document.createRange();
          newRange.setStart(targetNode, targetOffset);
          newRange.setEnd(targetNode, targetOffset);
          
          selection.removeAllRanges();
          selection.addRange(newRange);
        } else {
          // If target node not found, move cursor to end
          const newRange = document.createRange();
          newRange.selectNodeContents(editorRef.current);
          newRange.collapse(false);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      });
    }
  };

  // Function to handle editor key events with cursor control
  const handleEditorKeyDown = (e) => {
    e.stopPropagation(); // Prevent video player from capturing the event

    // Handle special keys
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertLineBreak', false, null);
      return;
    }

    // Allow all navigation keys to work normally
    if ([
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
      'PageUp',
      'PageDown',
      'Backspace',
      'Delete'
    ].includes(e.key)) {
      return; // Let default behavior handle these keys
    }
  };

  // Function to toggle text direction
  const toggleTextDirection = () => {
    const newDirection = textDirection === 'ltr' ? 'rtl' : 'ltr';
    setTextDirection(newDirection);
    if (editorRef.current) {
      editorRef.current.style.direction = newDirection;
      editorRef.current.focus();
    }
  };

  // Function to initialize editor content
  const initializeEditor = (content = '') => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
      editorRef.current.focus();
      
      // Place cursor at the end
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  // Update startEditingNote function
  const startEditingNote = (note) => {
    setEditingNoteId(note._id);
    setEditingContent(note.content);
    setTextDirection('ltr');
    setActiveFormats(new Set());
    setTextAlignment('left');
    
    // Initialize editor with content after state update
    requestAnimationFrame(() => {
      initializeEditor(note.content);
    });
  };

  // Update useEffect for editor initialization
  useEffect(() => {
    if (isAddingNote) {
      initializeEditor();
    }
  }, [isAddingNote]);

  // Function to handle note saving
  const handleAddNote = async (noteData) => {
    try {
      await courseService.addResourceNote(
        courseId,
        currentModuleIndex,
        currentResourceIndex,
        noteData
      );
      fetchNotes();
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  // Function to update a note
  const handleUpdateNote = async (noteId, content) => {
    try {
      await courseService.updateResourceNote(
        courseId,
        currentModuleIndex,
        currentResourceIndex,
        noteId,
        { content }
      );
      fetchNotes();
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  // Function to delete a note
  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await courseService.deleteResourceNote(
        courseId,
        currentModuleIndex,
        currentResourceIndex,
        noteId
      );
      fetchNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  // Function to seek to specific time in video
  const handleSeekToTimestamp = (timestamp) => {
    if (videoPlayerRef.current && timestamp !== null) {
      videoPlayerRef.current.seekTo(Math.floor(timestamp));
      const videoElement = document.querySelector('.video-container');
      if (videoElement) {
        videoElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
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
                  <div className="video-container bg-gray-800/50 rounded-xl overflow-hidden shadow-lg">
                    <div className="relative" style={{ paddingTop: "56.25%" }}>
                      {videoId ? (
                        <div className="absolute inset-0">
                          <VideoPlayer
                            ref={videoPlayerRef}
                            videoId={videoId}
                            onTimeUpdate={handleTimeUpdate}
                          />
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

                  {/* Notes Section */}
                  <Notes
                    notes={notes}
                    currentVideoTime={currentVideoTime}
                    onAddNote={handleAddNote}
                    onUpdateNote={handleUpdateNote}
                    onDeleteNote={handleDeleteNote}
                    onSeekToTimestamp={handleSeekToTimestamp}
                    formatTimestamp={formatTimestamp}
                  />

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

<style jsx>{`
  .editor-content {
    position: relative;
  }
  .editor-content:empty:before {
    content: attr(placeholder);
    position: absolute;
    color: #6B7280;
    pointer-events: none;
  }
  .editor-content[contenteditable="true"] {
    -webkit-user-modify: read-write-plaintext-only;
    user-modify: read-write-plaintext-only;
    overflow-wrap: break-word;
    -webkit-line-break: after-white-space;
    line-break: after-white-space;
  }
  .editor-content p {
    margin: 0;
    min-height: 1.2em;
  }
  .editor-content div {
    margin: 0;
    min-height: 1.2em;
  }
`}</style>