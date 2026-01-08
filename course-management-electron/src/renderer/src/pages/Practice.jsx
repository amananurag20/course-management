import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { MdCode, MdQuiz, MdSearch, MdCheck, MdSort } from "react-icons/md";
import { problemService } from "../services/problemService";
import { mcqService } from "../services/mcqService";

const Practice = () => {
  const { isGlobalSidebarOpen } = useSidebar();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("coding");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("id");
  
  // Separate states for coding and MCQ questions
  const [codingQuestions, setCodingQuestions] = useState([]);
  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [loading, setLoading] = useState({
    coding: false,
    mcq: false
  });
  const [error, setError] = useState({
    coding: null,
    mcq: null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch both types of questions when component mounts
  useEffect(() => {
    const fetchAllQuestions = async () => {
      // Fetch coding questions
      setLoading(prev => ({ ...prev, coding: true }));
      try {
        const codingResponse = await problemService.getAllProblems();
        const problems = Array.isArray(codingResponse)
          ? codingResponse
          : codingResponse.problems || [];
        setCodingQuestions(problems);
      } catch (err) {
        console.error("Error fetching coding questions:", err);
        setError(prev => ({
          ...prev,
          coding: err.message || "Failed to fetch coding questions"
        }));
      } finally {
        setLoading(prev => ({ ...prev, coding: false }));
      }

      // Fetch MCQ questions
      setLoading(prev => ({ ...prev, mcq: true }));
      try {
        const mcqResponse = await mcqService.getAllMcqQuestions();
        const mcqs = mcqResponse.data?.mcqQuestions || [];
        console.log({mcqs});
        setMcqQuestions(mcqs);
      } catch (err) {
        console.error("Error fetching MCQ questions:", err);
        setError(prev => ({
          ...prev,
          mcq: err.message || "Failed to fetch MCQ questions"
        }));
      } finally {
        setLoading(prev => ({ ...prev, mcq: false }));
      }
    };

    fetchAllQuestions();
  }, []);

  // Get current questions based on active tab
  const currentQuestions = useMemo(() => {
    return activeTab === "coding" ? codingQuestions : mcqQuestions;
  }, [activeTab, codingQuestions, mcqQuestions]);

  // Get unique topics from current questions
  const topics = useMemo(() => {
    const allTopics = currentQuestions.map((q) => q.topic || "Uncategorized");
    return [...new Set(allTopics)];
  }, [currentQuestions]);

  // Get unique difficulties from current questions
  const difficulties = useMemo(() => {
    const allDifficulties = currentQuestions.map(
      (q) => q.difficulty?.toLowerCase() || "medium"
    );
    return [...new Set(allDifficulties)];
  }, [currentQuestions]);

  // Filter and sort questions based on selected filters
  const filteredQuestions = useMemo(() => {
    const filtered = currentQuestions
      .filter((q) => {
        const topicMatch =
          selectedTopic === "all" ||
          (q.topic || "Uncategorized") === selectedTopic;
        const difficultyMatch =
          selectedDifficulty === "all" ||
          (q.difficulty?.toLowerCase() || "medium") ===
            selectedDifficulty.toLowerCase();
        const searchMatch =
          searchQuery === "" ||
          q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (q.topic || "").toLowerCase().includes(searchQuery.toLowerCase());

        return topicMatch && difficultyMatch && searchMatch;
      })
      .sort((a, b) => {
        if (sortBy === "difficulty") {
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          return (
            difficultyOrder[a.difficulty?.toLowerCase() || "medium"] -
            difficultyOrder[b.difficulty?.toLowerCase() || "medium"]
          );
        }
        return a._id.localeCompare(b._id);
      });

    return filtered;
  }, [currentQuestions, selectedTopic, selectedDifficulty, searchQuery, sortBy]);

  // Reset filters when tab changes
  useEffect(() => {
    setSelectedTopic("all");
    setSelectedDifficulty("all");
    setSearchQuery("");
  }, [activeTab]);

  const handleQuestionClick = (question) => {
    if (activeTab === "coding") {
      navigate(`/practice/coding/${question._id}`);
    } else {
      navigate(`/practice/mcq/${question._id}`);
    }
  };

  const mainContentStyle = {
    marginLeft: isGlobalSidebarOpen ? "16rem" : "5rem",
    width: `calc(100% - ${isGlobalSidebarOpen ? "16rem" : "5rem"})`,
    transition: "all 0.3s ease-in-out",
  };

  const isLoading = loading.coding || loading.mcq;
  const currentError = activeTab === "coding" ? error.coding : error.mcq;

  return (
    <div
      style={mainContentStyle}
      className="p-8 bg-gray-900 min-h-screen text-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Practice</h1>
          <p className="text-gray-400">
            Enhance your skills with coding challenges and quizzes
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-4 mb-6">
          <button
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === "coding"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("coding")}
          >
            <MdCode className="mr-2" size={20} />
            Coding Questions
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === "mcq"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("mcq")}
          >
            <MdQuiz className="mr-2" size={20} />
            MCQ Questions
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="relative flex-grow max-w-md">
            <MdSearch
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search questions..."
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value="all">All Topics</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>

          {activeTab === "coding" && (
            <select
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="all">All Difficulties</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          )}

          <select
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="id">Sort by ID</option>
            <option value="difficulty">Sort by Difficulty</option>
          </select>
        </div>

        {/* Questions Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : currentError ? (
            <div className="text-center py-12 text-red-500">{currentError}</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Topic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {activeTab === "coding" ? "Difficulty" : "Time Limit"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredQuestions.map((question) => (
                  <tr
                    key={question._id}
                    onClick={() => handleQuestionClick(question)}
                    className="hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap w-16">
                      {question.completed ? (
                        <MdCheck className="text-green-500" size={20} />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-600 rounded-full" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">
                        {question.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-900 text-purple-200 rounded-full text-xs">
                        {question.topic || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {activeTab === "coding" ? (
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            (question.difficulty?.toLowerCase() || "medium") ===
                            "easy"
                              ? "bg-green-900 text-green-200"
                              : (question.difficulty?.toLowerCase() || "medium") ===
                                "medium"
                              ? "bg-yellow-900 text-yellow-200"
                              : "bg-red-900 text-red-200"
                          }`}
                        >
                          {question.difficulty?.charAt(0).toUpperCase() +
                            question.difficulty?.slice(1) || "Medium"}
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-xs">
                          {question.timeLimit} mins
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!isLoading && !currentError && filteredQuestions.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No questions found matching your criteria.
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center py-4 border-t border-gray-700">
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Practice;
