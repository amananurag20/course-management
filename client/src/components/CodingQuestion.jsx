import React, { useState, useEffect } from "react";
import {
  MdArrowBack,
  MdPlayArrow,
  MdCheck,
  MdSend,
  MdRefresh,
  MdHistory,
  MdCode,
  MdDescription,
  MdLeaderboard,
  MdQuestionAnswer,
  MdTerminal,
} from "react-icons/md";
import { VscDebugConsole } from "react-icons/vsc";
import Editor from "@monaco-editor/react";
import { useSidebar } from "../context/SidebarContext";
import { useParams, useNavigate } from "react-router-dom";
import codingQuestions from "../constants/codingQuestions";
import Timer from "./Timer";
import TimeUpModal from "./TimeUpModal";

function CodingQuestion() {
  const { isGlobalSidebarOpen } = useSidebar();
  const navigate = useNavigate();
  const { id } = useParams();

  // Core state
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [panelWidth, setPanelWidth] = useState(40);
  const [isDragging, setIsDragging] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState("description");
  const [activeSolutionTab, setActiveSolutionTab] = useState("code");

  // Execution state
  const [testResults, setTestResults] = useState(null);
  const [executionStatus, setExecutionStatus] = useState(null);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [customInput, setCustomInput] = useState("");

  const question = codingQuestions.find((q) => q.id === parseInt(id));

  const languages = [
    { id: "javascript", name: "JavaScript" },
    { id: "python", name: "Python" },
    { id: "java", name: "Java" },
    { id: "cpp", name: "C++" },
  ];

  const getDefaultCode = (lang) => {
    switch (lang) {
      case "javascript":
        return "// Write your JavaScript code here\n\nfunction solution() {\n  \n}";
      case "python":
        return "# Write your Python code here\n\ndef solution():\n    pass";
      case "java":
        return "public class Solution {\n    public static void main(String[] args) {\n        \n    }\n}";
      case "cpp":
        return "#include <iostream>\n\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}";
      default:
        return "// Write your code here";
    }
  };

  const mockExecuteCode = (code, input) => {
    setExecutionStatus("Running...");
    setConsoleOutput([]);

    return new Promise((resolve) => {
      setTimeout(() => {
        const logs = [];
        const mockConsole = {
          log: (...args) => logs.push(args.join(" ")),
        };

        try {
          const safeEval = new Function(
            "input",
            "console",
            `
              ${code}
              return solution(JSON.parse(input));
            `
          );

          const result = safeEval(input, mockConsole);
          setConsoleOutput(logs);

          resolve({
            success: true,
            output: JSON.stringify(result),
            time: Math.random() * 100,
            memory: Math.floor(Math.random() * 40) + 30,
          });
        } catch (error) {
          setConsoleOutput([...logs, `Error: ${error.message}`]);
          resolve({
            success: false,
            error: error.message,
          });
        }
      }, 1000);
    });
  };

  const handleRunCode = async () => {
    if (!question || !question.testCases) return;

    const results = {
      passed: 0,
      total: question.testCases.length,
      cases: [],
      time: 0,
      memory: 0,
    };

    for (const testCase of question.testCases) {
      const result = await mockExecuteCode(
        code || getDefaultCode(language),
        testCase.input
      );

      if (result.success) {
        const passed = result.output === testCase.expectedOutput;
        results.cases.push({
          passed,
          input: testCase.input,
          output: result.output,
          expected: testCase.expectedOutput,
          time: result.time,
          memory: result.memory,
        });
        if (passed) results.passed++;
        results.time = Math.max(results.time, result.time);
        results.memory = Math.max(results.memory, result.memory);
      } else {
        results.cases.push({
          passed: false,
          input: testCase.input,
          error: result.error,
          expected: testCase.expectedOutput,
        });
      }
    }

    setTestResults(results);
    setExecutionStatus(
      results.passed === results.total ? "Accepted" : "Wrong Answer"
    );
  };

  const handleSubmit = async () => {
    await handleRunCode();
    setIsSubmitted(true);
  };

  const resetCode = () => {
    setCode(getDefaultCode(language));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSolutionTabChange = (tab) => {
    setActiveSolutionTab(tab);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Timer handlers
  const handleTimeUp = () => {
    if (!isSubmitted) {
      setShowTimeUpModal(true);
    }
  };

  const handleForceSubmit = async () => {
    setShowTimeUpModal(false);
    setIsSubmitted(true);
    await handleSubmit();
    // Add a small delay before navigation to ensure submission is processed
    setTimeout(() => {
      navigate("/practice");
    }, 1500);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const container = document.getElementById("coding-container");
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const sidebarWidth = isGlobalSidebarOpen ? 256 : 80; // 16rem or 5rem in pixels
      const mouseX = e.clientX - sidebarWidth;
      const containerWidth = containerRect.width;

      // Calculate percentage based on mouse position
      const percentage = (mouseX / containerWidth) * 100;

      // Limit between 20% and 75%
      const newWidth = Math.min(Math.max(percentage, 20), 75);
      setPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isGlobalSidebarOpen]);

  if (!question) {
    return (
      <div
        style={{ marginLeft: isGlobalSidebarOpen ? "16rem" : "5rem" }}
        className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Question not found</h2>
          <button
            onClick={() => navigate("/practice")}
            className="text-purple-400 hover:text-purple-300 flex items-center justify-center"
          >
            <MdArrowBack size={20} className="mr-2" />
            Back to Practice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-gray-900 transition-all duration-300"
      style={{
        marginLeft: isGlobalSidebarOpen ? "16rem" : "5rem",
        paddingLeft: "1.5rem",
      }}
    >
      <div id="coding-container" className="flex h-full w-full">
        {/* Question Panel */}
        <div
          style={{ width: `${panelWidth}%` }}
          className="h-full overflow-y-auto border-r border-gray-700 flex-shrink-0 bg-gray-900 pr-4"
        >
          <div className="sticky top-0 bg-gray-900 pt-4 pb-2 z-10">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => navigate("/practice")}
                className="flex items-center text-purple-400 hover:text-purple-300"
              >
                <MdArrowBack size={20} className="mr-2" />
                Back to Questions
              </button>
              {!isSubmitted && (
                <Timer timeLimit={question.timeLimit} onTimeUp={handleTimeUp} />
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-white">
                {question.title}
              </h1>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    question.difficulty === "Easy"
                      ? "bg-green-900/50 text-green-400"
                      : question.difficulty === "Medium"
                      ? "bg-yellow-900/50 text-yellow-400"
                      : "bg-red-900/50 text-red-400"
                  }`}
                >
                  {question.difficulty}
                </span>
                <span className="px-3 py-1 bg-purple-900/50 text-purple-400 rounded-full text-sm">
                  {question.topic}
                </span>
              </div>
            </div>

            {/* Tab Navigation for Question Panel */}
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => handleTabChange("description")}
                className={`px-4 py-2 font-medium flex items-center ${
                  activeTab === "description"
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <MdDescription className="mr-1" size={18} />
                Description
              </button>
              <button
                onClick={() => handleTabChange("solutions")}
                className={`px-4 py-2 font-medium flex items-center ${
                  activeTab === "solutions"
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <MdQuestionAnswer className="mr-1" size={18} />
                Solutions
              </button>
              <button
                onClick={() => handleTabChange("submissions")}
                className={`px-4 py-2 font-medium flex items-center ${
                  activeTab === "submissions"
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <MdHistory className="mr-1" size={18} />
                Submissions
              </button>
            </div>
          </div>

          <div className="py-4">
            {activeTab === "description" && (
              <div className="space-y-6 text-gray-300">
                <div>
                  <h2 className="text-lg font-semibold text-purple-400 mb-2">
                    Description
                  </h2>
                  <p className="leading-relaxed">{question.description}</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 shadow-md">
                  <h2 className="text-lg font-semibold text-purple-400 mb-2">
                    Example
                  </h2>
                  <pre className="font-mono text-sm whitespace-pre-wrap bg-gray-850 p-3 rounded border border-gray-700">
                    {question.example}
                  </pre>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 shadow-md">
                  <h2 className="text-lg font-semibold text-purple-400 mb-2">
                    Constraints
                  </h2>
                  <pre className="font-mono text-sm whitespace-pre-wrap bg-gray-850 p-3 rounded border border-gray-700">
                    {question.constraints}
                  </pre>
                </div>
              </div>
            )}

            {activeTab === "solutions" && (
              <div className="text-gray-300 space-y-4">
                <h2 className="text-xl font-semibold text-purple-400 mb-4">
                  Community Solutions
                </h2>
                <div className="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium text-white">
                      Optimal Time Complexity Solution
                    </div>
                    <div className="text-sm text-gray-400">by CodeMaster</div>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">
                    Time: O(n), Space: O(1)
                  </div>
                  <pre className="font-mono text-sm whitespace-pre-wrap bg-gray-850 p-3 rounded border border-gray-700">
                    {`function solution(arr) {
  // Optimal implementation
  let result = 0;
  for (let i = 0; i < arr.length; i++) {
    // Do optimal calculations...
  }
  return result;
}`}
                  </pre>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium text-white">
                      Dynamic Programming Approach
                    </div>
                    <div className="text-sm text-gray-400">by AlgoNinja</div>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">
                    Time: O(n²), Space: O(n)
                  </div>
                  <pre className="font-mono text-sm whitespace-pre-wrap bg-gray-850 p-3 rounded border border-gray-700">
                    {`function solution(arr) {
  // DP approach
  const dp = new Array(arr.length).fill(0);
  // Dynamic programming implementation...
  return dp[arr.length - 1];
}`}
                  </pre>
                </div>
              </div>
            )}

            {activeTab === "submissions" && (
              <div className="text-gray-300">
                <h2 className="text-xl font-semibold text-purple-400 mb-4">
                  Your Submissions
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      status: "Accepted",
                      date: "May 14, 2025",
                      runtime: "75ms",
                      memory: "38.2MB",
                    },
                    {
                      status: "Wrong Answer",
                      date: "May 13, 2025",
                      runtime: "82ms",
                      memory: "40.1MB",
                    },
                  ].map((submission, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700 flex justify-between items-center"
                    >
                      <div>
                        <div
                          className={`font-medium ${
                            submission.status === "Accepted"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {submission.status}
                        </div>
                        <div className="text-sm text-gray-400">
                          {submission.date}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-300">
                          Runtime: {submission.runtime}
                        </div>
                        <div className="text-sm text-gray-300">
                          Memory: {submission.memory}
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* No submissions message */}
                  {false && (
                    <div className="text-center py-8 text-gray-500">
                      No submissions yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resizable Divider */}
        <div
          className={`w-2 cursor-col-resize hover:bg-purple-500 active:bg-purple-600 relative group flex-shrink-0 ${
            isDragging ? "bg-purple-600" : "bg-gray-700"
          }`}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-12 opacity-0 group-hover:opacity-100 bg-purple-500 rounded-full transition-opacity" />
        </div>

        {/* Code Editor Panel */}
        <div className="flex-1 h-full flex flex-col bg-gray-900">
          {/* Solution Tabs */}
          <div className="bg-gray-800 border-b border-gray-700">
            <div className="flex">
              <button
                onClick={() => handleSolutionTabChange("code")}
                className={`px-4 py-3 font-medium flex items-center ${
                  activeSolutionTab === "code"
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <MdCode className="mr-1" size={18} />
                Code
              </button>
              <button
                onClick={() => handleSolutionTabChange("console")}
                className={`px-4 py-3 font-medium flex items-center ${
                  activeSolutionTab === "console"
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <MdTerminal className="mr-1" size={18} />
                Console
              </button>
              <button
                onClick={() => handleSolutionTabChange("leaderboard")}
                className={`px-4 py-3 font-medium flex items-center ${
                  activeSolutionTab === "leaderboard"
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <MdLeaderboard className="mr-1" size={18} />
                Leaderboard
              </button>
            </div>
          </div>

          {activeSolutionTab === "code" && (
            <>
              {/* Editor Toolbar */}
              <div className="bg-gray-800 p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {languages.map((lang) => (
                        <option key={lang.id} value={lang.id}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={resetCode}
                      className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                      title="Reset Code"
                    >
                      <MdRefresh size={20} />
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleRunCode}
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center shadow-md"
                    >
                      <MdPlayArrow size={20} className="mr-1" />
                      Run
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors flex items-center shadow-md"
                    >
                      <MdSend size={20} className="mr-1" />
                      Submit
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 relative">
                <Editor
                  height="100%"
                  language={language}
                  theme="vs-dark"
                  value={code || getDefaultCode(language)}
                  onChange={(value) => setCode(value)}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>

              {testResults !== null && (
                <div className="bg-gray-800 border-t border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span
                        className={`mr-2 font-medium flex items-center ${
                          testResults.passed === testResults.total
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {testResults.passed === testResults.total ? (
                          <MdCheck className="mr-1" size={20} />
                        ) : null}
                        {executionStatus}
                      </span>
                      <span className="text-gray-400">
                        {testResults.passed}/{testResults.total} test cases
                        passed
                      </span>
                    </div>
                    <div className="text-gray-400 text-sm">
                      Time: {testResults.time.toFixed(2)}ms | Memory:{" "}
                      {testResults.memory}MB
                    </div>
                  </div>

                  {/* Test Case Details */}
                  <div className="mt-3 space-y-2">
                    {testResults.cases.map((testCase, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          testCase.passed
                            ? "bg-green-900/20 border-green-800"
                            : "bg-red-900/20 border-red-800"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span
                            className={`font-medium ${
                              testCase.passed
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            Test Case {index + 1}:{" "}
                            {testCase.passed ? "Passed" : "Failed"}
                          </span>
                          {testCase.passed && (
                            <span className="text-gray-400 text-sm">
                              {testCase.time.toFixed(2)}ms | {testCase.memory}MB
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-gray-400 mb-1">Input:</div>
                            <pre className="bg-gray-850 p-2 rounded text-gray-300 overflow-x-auto">
                              {testCase.input}
                            </pre>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">
                              {testCase.passed ? "Output:" : "Expected:"}
                            </div>
                            <pre className="bg-gray-850 p-2 rounded text-gray-300 overflow-x-auto">
                              {testCase.passed
                                ? testCase.output
                                : testCase.expected}
                            </pre>
                            {!testCase.passed && testCase.output && (
                              <div className="mt-2">
                                <div className="text-gray-400 mb-1">
                                  Your Output:
                                </div>
                                <pre className="bg-gray-850 p-2 rounded text-gray-300 overflow-x-auto">
                                  {testCase.output}
                                </pre>
                              </div>
                            )}
                            {!testCase.passed && testCase.error && (
                              <div className="mt-2">
                                <div className="text-red-400 mb-1">Error:</div>
                                <pre className="bg-gray-850 p-2 rounded text-red-300 overflow-x-auto">
                                  {testCase.error}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeSolutionTab === "console" && (
            <div className="flex-1 bg-gray-850 p-4 font-mono text-sm overflow-auto">
              <div className="mb-4">
                <h3 className="text-purple-400 mb-2 font-medium">
                  Console Output:
                </h3>
                {consoleOutput.length > 0 ? (
                  <div className="bg-gray-900 p-3 rounded border border-gray-700">
                    {consoleOutput.map((log, index) => (
                      <div key={index} className="text-gray-300">
                        {log}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 italic">
                    No output yet. Run your code to see results.
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-purple-400 mb-2 font-medium">
                  Custom Input:
                </h3>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder='Enter your test input here, e.g. "[1, 2, 3]"'
                  className="w-full h-32 bg-gray-900 text-gray-300 p-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => mockExecuteCode(code, customInput)}
                  className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors flex items-center shadow-md"
                >
                  <MdPlayArrow size={20} className="mr-1" />
                  Run with Custom Input
                </button>
              </div>
            </div>
          )}

          {activeSolutionTab === "leaderboard" && (
            <div className="flex-1 p-4 overflow-auto">
              <h2 className="text-xl font-semibold text-purple-400 mb-4">
                Leaderboard
              </h2>

              <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-850">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-4ppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Language
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Runtime
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Memory
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {[
                      {
                        rank: 1,
                        user: "JavaMaster",
                        language: "Java",
                        runtime: "54ms",
                        memory: "36.8MB",
                        time: "1 day ago",
                      },
                      {
                        rank: 2,
                        user: "AlgoNinja",
                        language: "JavaScript",
                        runtime: "62ms",
                        memory: "39.2MB",
                        time: "3 days ago",
                      },
                      {
                        rank: 3,
                        user: "PyDevPro",
                        language: "Python",
                        runtime: "68ms",
                        memory: "42.1MB",
                        time: "5 days ago",
                      },
                      {
                        rank: 4,
                        user: "CppWizard",
                        language: "C++",
                        runtime: "49ms",
                        memory: "45.4MB",
                        time: "1 week ago",
                      },
                      {
                        rank: 5,
                        user: "CodeGuru",
                        language: "JavaScript",
                        runtime: "71ms",
                        memory: "38.7MB",
                        time: "2 weeks ago",
                      },
                    ].map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                          {entry.rank}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {entry.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {entry.language}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">
                          {entry.runtime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400">
                          {entry.memory}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {entry.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Time Up Modal */}
      {Boolean(showTimeUpModal) && <TimeUpModal onSubmit={handleForceSubmit} />}
    </div>
  );
}

export default CodingQuestion;
