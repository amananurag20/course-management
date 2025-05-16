import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  MdPlayCircle,
  MdCheck,
  MdLock,
  MdChevronRight,
  MdNotes,
  MdEdit,
  MdDelete,
} from "react-icons/md";
import { useSidebar } from "../context/SidebarContext";
import VideoPlayer from "./VideoPlayer";

// Mock course content data

const mockCourseData = {
  1: {
    title: "Complete React Development",
    sections: [
      {
        title: "Getting Started",
        lessons: [
          {
            id: 1,
            title: "Course Introduction",
            duration: "5:30",
            completed: true,
            videoId: "HJ8PbXz04Uw",
            notes:
              "Welcome to the course! In this introduction, we'll cover the course structure and what you'll learn.",
          },
          {
            id: 2,
            title: "Setting Up Development Environment",
            duration: "10:15",
            completed: true,
            videoId: "ny2yB7dnWzE",
            notes:
              "Learn how to set up your development environment with Node.js, npm, and create-react-app.",
          },
        ],
      },
      {
        title: "React Fundamentals",
        lessons: [
          {
            id: 3,
            title: "Components and Props",
            duration: "15:45",
            completed: false,
            videoId: "ny2yB7dnWzE",
          },
          {
            id: 4,
            title: "State and Lifecycle",
            duration: "20:00",
            completed: false,
            videoId: "ny2yB7dnWzE",
          },
        ],
      },
      {
        title: "Advanced Concepts",
        lessons: [
          {
            id: 5,
            title: "Hooks Deep Dive",
            duration: "25:30",
            completed: false,
            videoId: "ny2yB7dnWzE",
          },
          {
            id: 6,
            title: "Context API",
            duration: "18:20",
            completed: false,
            videoId: "ny2yB7dnWzE",
          },
        ],
      },
    ],
  },
};

const CourseViewer = () => {
  const { courseId } = useParams();
  const { isGlobalSidebarOpen } = useSidebar();
  const [currentLesson, setCurrentLesson] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set([0]));
  const [notes, setNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [savedNotes, setSavedNotes] = useState({});

  const course = mockCourseData[courseId];

  // Handle section toggle
  const toggleSection = (index) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  // Select a lesson to play
  const selectLesson = (lesson) => {
    setCurrentLesson(lesson);
    setNotes(savedNotes[lesson.id] || lesson.notes || "");
    setIsEditingNotes(false);
  };

  const handleSaveNotes = () => {
    if (currentLesson) {
      setSavedNotes((prev) => ({
        ...prev,
        [currentLesson.id]: notes,
      }));
      setIsEditingNotes(false);
    }
  };

  const handleDeleteNotes = () => {
    if (currentLesson) {
      setSavedNotes((prev) => {
        const newNotes = { ...prev };
        delete newNotes[currentLesson.id];
        return newNotes;
      });
      setNotes(currentLesson.notes || "");
      setIsEditingNotes(false);
    }
  };

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div
      className="min-h-screen bg-gray-900 text-white transition-all duration-300"
      style={{
        marginLeft: isGlobalSidebarOpen ? "256px" : "80px",
        width: `calc(100% - ${isGlobalSidebarOpen ? "256px" : "80px"})`,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 h-screen">
        {/* Video Player Section */}
        <div className="lg:col-span-2 bg-gray-900 p-4 flex flex-col overflow-y-auto">
          <div className="flex flex-col flex-grow justify-center min-h-full">
            {/* Video Container */}
            <div className="w-full max-w-4xl mx-auto">
              <div className="relative" style={{ paddingTop: "56.25%" }}>
                {currentLesson ? (
                  <div className="absolute inset-0">
                    <VideoPlayer videoId={currentLesson.videoId} />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
                    <div className="text-center">
                      <MdPlayCircle
                        className="mx-auto text-purple-500"
                        size={48}
                      />
                      <p className="mt-4 text-gray-400">
                        Select a lesson to start learning
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes Section */}
            {currentLesson && (
              <div className="mt-6 max-w-4xl mx-auto w-full bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <MdNotes className="text-purple-500" size={24} />
                    <h3 className="text-xl font-semibold">Lesson Notes</h3>
                  </div>
                  <div className="flex space-x-2">
                    {!isEditingNotes ? (
                      <button
                        onClick={() => setIsEditingNotes(true)}
                        className="flex items-center space-x-1 px-3 py-1 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <MdEdit size={18} />
                        <span>Edit</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSaveNotes}
                          className="px-3 py-1 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditingNotes(false)}
                          className="px-3 py-1 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {savedNotes[currentLesson.id] && (
                      <button
                        onClick={handleDeleteNotes}
                        className="flex items-center space-x-1 px-3 py-1 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <MdDelete size={18} />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>
                {isEditingNotes ? (
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full h-40 px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Add your notes here..."
                  />
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">
                      {notes || "No notes available for this lesson."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Course Content Section */}
        <div className="lg:col-span-1 bg-gray-800 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{course.title}</h2>
            <div className="space-y-2">
              {course.sections.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className="border border-gray-700 rounded-lg overflow-hidden transition-all duration-300"
                >
                  <button
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-700 transition-colors"
                    onClick={() => toggleSection(sectionIndex)}
                  >
                    <span className="font-medium">{section.title}</span>
                    <MdChevronRight
                      size={24}
                      className={`transform transition-transform duration-300 ${
                        expandedSections.has(sectionIndex) ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      expandedSections.has(sectionIndex)
                        ? "max-h-[1000px] opacity-100"
                        : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    {section.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => selectLesson(lesson)}
                        className={`w-full flex items-center p-3 text-left text-sm transition-all duration-200 ${
                          currentLesson?.id === lesson.id
                            ? "bg-purple-600"
                            : "hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex-shrink-0 mr-3">
                          {lesson.completed ? (
                            <MdCheck className="text-green-400" size={20} />
                          ) : (
                            <MdPlayCircle className="text-gray-400" size={20} />
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium">{lesson.title}</div>
                          <div className="text-gray-400 text-xs mt-1">
                            {lesson.duration}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
