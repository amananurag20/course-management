import React, { useState } from "react";
import {
  MdCode,
  MdChevronRight,
  MdSearch,
  MdQuiz,
  MdArrowBack,
} from "react-icons/md";
import { FaReact, FaJava, FaPython, FaJs } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import { useSidebar } from "../context/SidebarContext";
import { useNavigate, useParams } from "react-router-dom";
import PracticeQuestions from "./PracticeQuestions";
import CodingQuestion from "./CodingQuestion";

const practiceCategories = {
  javascript: {
    icon: FaJs,
    color: "text-yellow-400",
    sections: [
      {
        title: "Basic Concepts",
        questions: 20,
        type: "mcq",
      },
      {
        title: "Arrays and Objects",
        questions: 15,
        type: "mcq",
      },
      {
        title: "Functions & Closures",
        questions: 12,
        type: "mcq",
      },
      {
        title: "Array Problems",
        questions: 10,
        type: "coding",
        problems: [
          {
            id: "array_reverse",
            title: "Reverse an Array",
            difficulty: "Easy",
          },
          {
            id: "array_max",
            title: "Find Maximum Element",
            difficulty: "Easy",
          },
        ],
      },
      {
        title: "Async Programming",
        questions: 18,
        type: "mcq",
      },
      {
        title: "ES6+ Features",
        questions: 10,
        type: "mcq",
      },
    ],
  },
  react: {
    icon: FaReact,
    color: "text-blue-400",
    sections: [
      {
        title: "Components & Props",
        questions: 15,
        type: "mcq",
      },
      {
        title: "Hooks",
        questions: 20,
        type: "mcq",
      },
      {
        title: "State Management",
        questions: 12,
        type: "mcq",
      },
      {
        title: "React Router",
        questions: 8,
        type: "mcq",
      },
      {
        title: "Performance",
        questions: 10,
        type: "mcq",
      },
    ],
  },
  java: {
    icon: FaJava,
    color: "text-red-400",
    sections: [
      { title: "OOP Basics", questions: 25 },
      { title: "Collections", questions: 18 },
      { title: "Multithreading", questions: 15 },
      { title: "Exception Handling", questions: 12 },
      { title: "File I/O", questions: 10 },
    ],
  },
  python: {
    icon: FaPython,
    color: "text-green-400",
    sections: [
      { title: "Basic Syntax", questions: 20 },
      { title: "Data Structures", questions: 15 },
      { title: "File Handling", questions: 10 },
      { title: "OOP in Python", questions: 12 },
      { title: "Libraries & Modules", questions: 18 },
    ],
  },
  typescript: {
    icon: SiTypescript,
    color: "text-blue-500",
    sections: [
      { title: "Types & Interfaces", questions: 20 },
      { title: "Generics", questions: 15 },
      { title: "Advanced Types", questions: 12 },
      { title: "Decorators", questions: 8 },
      { title: "Type Utilities", questions: 10 },
    ],
  },
};

function Practice() {
  const { isGlobalSidebarOpen } = useSidebar();
  const navigate = useNavigate();
  const { sectionId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("javascript");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);

  // Find current section if sectionId exists
  const currentSection =
    sectionId &&
    Object.values(practiceCategories)
      .flatMap((category) => category.sections)
      .find((section) => section.title === sectionId);

  const filteredSections = practiceCategories[selectedCategory].sections.filter(
    (section) => section.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle section selection
  const handleSectionSelect = (section) => {
    if (section.type === "coding") {
      navigate(`/practice/${encodeURIComponent(section.title)}`);
    } else {
      navigate(`/practice/mcq/${encodeURIComponent(section.title)}`);
    }
  };

  // Handle problem selection
  const handleProblemSelect = (problem) => {
    navigate(`/practice/${encodeURIComponent(sectionId)}/${problem.id}`);
  };

  // Handle back navigation
  const handleBack = () => {
    if (selectedProblem) {
      setSelectedProblem(null);
    } else {
      setSelectedSection(null);
    }
  };

  // If we're viewing a specific coding section
  if (sectionId && currentSection?.type === "coding") {
    return (
      <div
        className="min-h-screen bg-gray-900 text-white p-6 transition-all duration-300"
        style={{
          marginLeft: isGlobalSidebarOpen ? "256px" : "80px",
          width: `calc(100% - ${isGlobalSidebarOpen ? "256px" : "80px"})`,
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/practice")}
              className="flex items-center text-purple-500 hover:text-purple-400 mb-4 transition-colors"
            >
              <MdArrowBack className="mr-2" size={24} />
              Back to Practice
            </button>
            <h1 className="text-3xl font-bold mb-2">{currentSection.title}</h1>
            <p className="text-gray-400">Select a problem to start coding</p>
          </div>

          {/* Problem List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSection.problems.map((problem) => (
              <div
                key={problem.id}
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02] cursor-pointer"
                onClick={() => handleProblemSelect(problem)}
              >
                <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium 
                  ${
                    problem.difficulty === "Easy"
                      ? "bg-green-500/20 text-green-400"
                      : problem.difficulty === "Medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render MCQ questions
  if (selectedSection && selectedSection.type === "mcq") {
    return (
      <PracticeQuestions
        section={selectedSection.title}
        category={selectedCategory}
        onBack={handleBack}
      />
    );
  }

  // Main practice page
  return (
    <div
      className="min-h-screen bg-gray-900 text-white p-6 transition-all duration-300"
      style={{
        marginLeft: isGlobalSidebarOpen ? "256px" : "80px",
        width: `calc(100% - ${isGlobalSidebarOpen ? "256px" : "80px"})`,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Practice Arena</h1>
          <p className="text-gray-400">
            Enhance your skills with our curated practice questions
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search practice sections..."
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div
          className={`grid grid-cols-1 ${
            isGlobalSidebarOpen ? "lg:grid-cols-4" : "lg:grid-cols-5"
          } gap-6`}
        >
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-4 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Categories</h2>
              <div className="space-y-2">
                {Object.entries(practiceCategories).map(([key, category]) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                        selectedCategory === key
                          ? "bg-purple-600 text-white"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <Icon className={`text-xl ${category.color}`} />
                      <span className="capitalize">{key}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Practice Sections */}
          <div
            className={`${
              isGlobalSidebarOpen ? "lg:col-span-3" : "lg:col-span-4"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSections.map((section, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02] cursor-pointer"
                  onClick={() => handleSectionSelect(section)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold">
                          {section.title}
                        </h3>
                        {section.type === "coding" ? (
                          <MdCode className="text-purple-500" size={20} />
                        ) : (
                          <MdQuiz className="text-purple-500" size={20} />
                        )}
                      </div>
                      <p className="text-gray-400">
                        {section.type === "coding"
                          ? `${section.problems.length} coding problems`
                          : `${section.questions} practice questions`}
                      </p>
                    </div>
                    <button
                      className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSectionSelect(section);
                      }}
                    >
                      <MdChevronRight className="text-2xl text-purple-500" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-gray-400">
                        0/
                        {section.type === "coding"
                          ? section.problems.length
                          : section.questions}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: "0%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Practice;
