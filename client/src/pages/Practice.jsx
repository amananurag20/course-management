import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import codingQuestions from "../constants/codingQuestions";
import mcqQuestions from "../constants/mcqQuestions";
import { MdCode, MdQuiz, MdSearch, MdCheck, MdSort } from "react-icons/md";

const Practice = () => {
  const { isGlobalSidebarOpen } = useSidebar();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("coding");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("id"); // 'id', 'difficulty'

  // Get unique topics from questions
  const topics = useMemo(() => {
    const codingTopics = [...new Set(codingQuestions.map((q) => q.topic))];
    const mcqTopics = [...new Set(mcqQuestions.map((q) => q.topic))];
    return activeTab === "coding" ? codingTopics : mcqTopics;
  }, [activeTab]);

  // Get unique difficulties (only for coding questions)
  const difficulties = useMemo(
    () => [...new Set(codingQuestions.map((q) => q.difficulty))],
    []
  );

  // Filter and sort questions based on selected filters
  const filteredQuestions = useMemo(() => {
    const questions = activeTab === "coding" ? codingQuestions : mcqQuestions;

    return questions
      .filter((q) => {
        const topicMatch = selectedTopic === "all" || q.topic === selectedTopic;
        const difficultyMatch =
          activeTab === "mcq" ||
          selectedDifficulty === "all" ||
          q.difficulty === selectedDifficulty;
        const searchMatch =
          searchQuery === "" ||
          (q.title || q.question)
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          q.topic.toLowerCase().includes(searchQuery.toLowerCase());

        return topicMatch && difficultyMatch && searchMatch;
      })
      .sort((a, b) => {
        if (sortBy === "difficulty") {
          const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        }
        return a.id - b.id;
      });
  }, [activeTab, selectedTopic, selectedDifficulty, searchQuery, sortBy]);

  const handleQuestionClick = (question) => {
    if (activeTab === "coding") {
      navigate(`/practice/coding/${question.id}`);
    } else {
      navigate(`/practice/mcq/${question.id}`);
    }
  };

  const mainContentStyle = {
    marginLeft: isGlobalSidebarOpen ? "16rem" : "5rem",
    width: `calc(100% - ${isGlobalSidebarOpen ? "16rem" : "5rem"})`,
    transition: "all 0.3s ease-in-out",
  };

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
                  {difficulty}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Questions Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
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
                {activeTab === "coding" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Difficulty
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredQuestions.map((question) => (
                <tr
                  key={question.id}
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
                      {question.title || question.question}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-purple-900 text-purple-200 rounded-full text-xs">
                      {question.topic}
                    </span>
                  </td>
                  {activeTab === "coding" && (
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          question.difficulty === "Easy"
                            ? "bg-green-900 text-green-200"
                            : question.difficulty === "Medium"
                            ? "bg-yellow-900 text-yellow-200"
                            : "bg-red-900 text-red-200"
                        }`}
                      >
                        {question.difficulty}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No questions found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;
