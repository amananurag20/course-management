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
import Timer from "./Timer";
import TimeUpModal from "./TimeUpModal";
import { problemService } from "../services/problemService";
import { submissionService } from "../services/submissionService";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

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
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  // Tab state
  const [activeTab, setActiveTab] = useState("description");
  const [activeSolutionTab, setActiveSolutionTab] = useState("code");

  // Execution state
  const [testResults, setTestResults] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [consoleOutput, setConsoleOutput] = useState([]);

  // Add new state for panel height
  const [panelHeight, setPanelHeight] = useState(200);
  const [isDraggingPanel, setIsDraggingPanel] = useState(false);

  // Fetch question data and submissions when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [questionData, submissionsData] = await Promise.all([
          problemService.getProblemById(id),
          submissionService.getSubmissionHistory(id),
        ]);
        setQuestion(questionData);
        setSubmissions(submissionsData);

        // Set default code based on the selected language's userSnippet
        if (questionData.codeStubs && questionData.codeStubs.length > 0) {
          const defaultStub = questionData.codeStubs.find(
            (stub) => stub.language.toUpperCase() === language.toUpperCase()
          );
          if (defaultStub) {
            setCode(defaultStub.userSnippet);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Update code when language changes
  useEffect(() => {
    if (question?.codeStubs) {
      const newStub = question.codeStubs.find(
        (stub) => stub.language.toUpperCase() === language.toUpperCase()
      );
      if (newStub) {
        setCode(newStub.userSnippet);
      }
    }
  }, [language, question]);

  const languages = [
    { id: "javascript", name: "JavaScript" },
    { id: "python", name: "Python" },
    { id: "java", name: "Java" },
    { id: "cpp", name: "C++" },
  ];

  const getDefaultCode = (lang) => {
    if (question?.codeStubs) {
      const stub = question.codeStubs.find(
        (s) => s.language.toUpperCase() === lang.toUpperCase()
      );
      if (stub) {
        return stub.userSnippet;
      }
    }
    return "// Write your code here";
  };

  const mockExecuteCode = (code, input) => {
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

    setIsExecuting(true);
    setTestResults(null);

    try {
      // For JavaScript, ensure the code is a function
      let processedCode = code;
      if (language === "javascript") {
        // If the code doesn't start with 'function', wrap it in a function
        if (!code.trim().startsWith("function")) {
          processedCode = `function solution(input) {\n${code}\n}`;
        }
      }

      const results = await submissionService.executeCode({
        code: processedCode,
        language,
        problemId: question._id,
        testCases: question.testCases,
      });

      // Ensure we have valid results
      if (results && typeof results === "object") {
        setTestResults({
          ...results,
          cases: results.cases.map((testCase) => ({
            ...testCase,
            input: testCase.input || "",
            output: testCase.output || "",
            expected: testCase.expected || "",
            error: testCase.error || null,
            time: testCase.time || 0,
          })),
        });
      }
    } catch (error) {
      console.error("Code execution error:", error);
      setTestResults({
        passed: 0,
        total: question.testCases.length,
        cases: question.testCases.map((testCase) => ({
          passed: false,
          input: testCase.input,
          error: error.message || "Execution failed",
          expected: testCase.output,
          time: 0,
          memory: 0,
        })),
      });
    } finally {
      setIsExecuting(false);
    }
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

  // Add panel drag handlers
  const handlePanelDragStart = (e) => {
    e.preventDefault();
    setIsDraggingPanel(true);
  };

  useEffect(() => {
    const handlePanelDrag = (e) => {
      if (!isDraggingPanel) return;

      const container = document.getElementById("coding-container");
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const mouseY = e.clientY;
      const containerHeight = containerRect.height;
      const newHeight = containerHeight - (mouseY - containerRect.top);

      // Limit panel height between 100px and 80% of container height
      const minHeight = 100;
      const maxHeight = containerHeight * 0.8;
      const clampedHeight = Math.min(Math.max(newHeight, minHeight), maxHeight);

      setPanelHeight(clampedHeight);
    };

    const handlePanelDragEnd = () => {
      setIsDraggingPanel(false);
    };

    if (isDraggingPanel) {
      document.addEventListener("mousemove", handlePanelDrag);
      document.addEventListener("mouseup", handlePanelDragEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handlePanelDrag);
      document.removeEventListener("mouseup", handlePanelDragEnd);
    };
  }, [isDraggingPanel]);

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

  if (loading) {
    return (
      <div
        style={{ marginLeft: isGlobalSidebarOpen ? "16rem" : "5rem" }}
        className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{ marginLeft: isGlobalSidebarOpen ? "16rem" : "5rem" }}
        className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-500">{error}</h2>
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
                <div className="markdown-body">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code
                            className="bg-gray-800 px-1.5 py-0.5 rounded text-purple-300 font-mono text-sm"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      h1: ({ children }) => (
                        <h1 className="text-3xl font-bold text-purple-400 mt-6 mb-4">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-bold text-purple-400 mt-5 mb-3">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-bold text-purple-400 mt-4 mb-2">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="my-3 leading-7">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-6 my-3 space-y-1">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-6 my-3 space-y-1">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="leading-7">{children}</li>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-purple-500 pl-4 my-4 italic text-gray-400">
                          {children}
                        </blockquote>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          className="text-purple-400 hover:text-purple-300 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-4">
                          <table className="min-w-full border-collapse border border-gray-700">
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({ children }) => (
                        <th className="border border-gray-700 px-4 py-2 bg-gray-800 text-left">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border border-gray-700 px-4 py-2">
                          {children}
                        </td>
                      ),
                    }}
                  >
                    {question.description}
                  </ReactMarkdown>
                </div>

                {question.examples && question.examples.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-4 shadow-md">
                    <h2 className="text-lg font-semibold text-purple-400 mb-2">
                      Examples
                    </h2>
                    {question.examples.map((example, index) => (
                      <div key={example._id} className="mb-4 last:mb-0">
                        <div className="font-medium text-white mb-2">
                          Example {index + 1}:
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-gray-400 mb-1">Input:</div>
                            <pre className="font-mono text-sm whitespace-pre-wrap bg-gray-850 p-3 rounded border border-gray-700">
                              {example.input}
                            </pre>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Output:</div>
                            <pre className="font-mono text-sm whitespace-pre-wrap bg-gray-850 p-3 rounded border border-gray-700">
                              {example.output}
                            </pre>
                          </div>
                        </div>
                        {example.explanation && (
                          <div className="mt-2 text-gray-400">
                            <span className="font-medium">Explanation: </span>
                            {example.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {question.constraints && (
                  <div className="bg-gray-800 rounded-lg p-4 shadow-md">
                    <h2 className="text-lg font-semibold text-purple-400 mb-2">
                      Constraints
                    </h2>
                    <pre className="font-mono text-sm whitespace-pre-wrap bg-gray-850 p-3 rounded border border-gray-700">
                      {question.constraints}
                    </pre>
                  </div>
                )}

                {question.hints && question.hints.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-4 shadow-md">
                    <h2 className="text-lg font-semibold text-purple-400 mb-2">
                      Hints
                    </h2>
                    <ul className="list-disc list-inside space-y-2">
                      {question.hints.map((hint, index) => (
                        <li key={index} className="text-gray-300">
                          {hint}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === "solutions" && (
              <div className="text-gray-300 space-y-4">
                <h2 className="text-xl font-semibold text-purple-400 mb-4">
                  Solution
                </h2>
                {question.solution && (
                  <div className="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium text-white">
                        Optimal Solution
                      </div>
                    </div>
                    <pre className="font-mono text-sm whitespace-pre-wrap bg-gray-850 p-3 rounded border border-gray-700">
                      {question.solution}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {activeTab === "submissions" && (
              <div className="text-gray-300">
                <h2 className="text-xl font-semibold text-purple-400 mb-4">
                  Your Submissions
                </h2>
                <div className="space-y-4">
                  {submissions.length > 0 ? (
                    submissions.map((submission) => (
                      <div
                        key={submission._id}
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
                            {new Date(
                              submission.createdAt
                            ).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-300">
                            Runtime: {submission.runtime}ms
                          </div>
                          <div className="text-sm text-gray-300">
                            Memory: {submission.memory}MB
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
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
                      disabled={isExecuting}
                      className={`px-4 py-2 bg-gray-700 text-white rounded-lg transition-colors flex items-center shadow-md ${
                        isExecuting
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-600"
                      }`}
                    >
                      {isExecuting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Running...
                        </>
                      ) : (
                        <>
                          <MdPlayArrow size={20} className="mr-1" />
                          Run
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isExecuting}
                      className={`px-4 py-2 bg-purple-600 text-white rounded-lg transition-colors flex items-center shadow-md ${
                        isExecuting
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-purple-500"
                      }`}
                    >
                      {isExecuting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <MdSend size={20} className="mr-1" />
                          Submit
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col min-h-0 relative">
                {/* Editor */}
                <div
                  className="flex-1 relative"
                  style={{
                    height: testResults
                      ? `calc(100% - ${panelHeight}px)`
                      : "100%",
                    transition: isDraggingPanel
                      ? "none"
                      : "height 0.2s ease-in-out",
                  }}
                >
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

                {/* Test Results Panel */}
                {testResults !== null && (
                  <>
                    {/* Drag Handle */}
                    <div
                      className="h-1 bg-gray-700 hover:bg-purple-500 cursor-row-resize relative z-20"
                      onMouseDown={handlePanelDragStart}
                    >
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-gray-600 rounded-full opacity-0 hover:opacity-100 transition-opacity" />
                    </div>

                    <div
                      className="bg-gray-800 border-t border-gray-700 p-4 overflow-y-auto absolute bottom-0 left-0 right-0"
                      style={{
                        height: `${panelHeight}px`,
                        transition: isDraggingPanel
                          ? "none"
                          : "height 0.2s ease-in-out",
                        zIndex: 10,
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`flex items-center ${
                              testResults.passed === testResults.total
                                ? "text-green-500"
                                : "text-yellow-500"
                            }`}
                          >
                            {testResults.passed === testResults.total ? (
                              <MdCheck className="mr-2" size={24} />
                            ) : (
                              <MdPlayArrow className="mr-2" size={24} />
                            )}
                            <span className="font-medium">
                              {testResults.passed === testResults.total
                                ? "All Test Cases Passed"
                                : `${testResults.passed}/${testResults.total} Test Cases Passed`}
                            </span>
                          </div>
                          {testResults.time !== undefined && (
                            <div className="text-gray-400 text-sm">
                              Runtime: {testResults.time.toFixed(2)}ms
                            </div>
                          )}
                          {testResults.memory !== undefined && (
                            <div className="text-gray-400 text-sm">
                              Memory: {testResults.memory}MB
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => setTestResults(null)}
                          className="text-gray-400 hover:text-gray-300"
                        >
                          <MdRefresh size={20} />
                        </button>
                      </div>

                      {/* Test Case Details */}
                      <div className="space-y-3">
                        {testResults.cases.map((testCase, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border ${
                              testCase.passed
                                ? "bg-green-900/20 border-green-800"
                                : "bg-red-900/20 border-red-800"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center">
                                <span
                                  className={`font-medium flex items-center ${
                                    testCase.passed
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {testCase.passed ? (
                                    <MdCheck className="mr-2" size={20} />
                                  ) : (
                                    <MdPlayArrow className="mr-2" size={20} />
                                  )}
                                  Test Case {index + 1}
                                </span>
                                {testCase.time !== undefined &&
                                  testCase.time > 0 && (
                                    <span className="ml-4 text-gray-400 text-sm">
                                      Runtime: {testCase.time.toFixed(2)}ms
                                    </span>
                                  )}
                              </div>
                              <span
                                className={`px-2 py-1 rounded text-sm ${
                                  testCase.passed
                                    ? "bg-green-900/50 text-green-400"
                                    : "bg-red-900/50 text-red-400"
                                }`}
                              >
                                {testCase.passed ? "Passed" : "Failed"}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-gray-400 mb-1 text-sm">
                                  Input:
                                </div>
                                <pre className="bg-gray-850 p-3 rounded text-gray-300 overflow-x-auto text-sm">
                                  {typeof testCase.input === "object"
                                    ? JSON.stringify(testCase.input, null, 2)
                                    : testCase.input}
                                </pre>
                              </div>
                              <div>
                                <div className="text-gray-400 mb-1 text-sm">
                                  {testCase.passed ? "Output:" : "Expected:"}
                                </div>
                                <pre className="bg-gray-850 p-3 rounded text-gray-300 overflow-x-auto text-sm">
                                  {typeof testCase.expected === "object"
                                    ? JSON.stringify(testCase.expected, null, 2)
                                    : testCase.expected}
                                </pre>
                                {!testCase.passed && testCase.output && (
                                  <div className="mt-2">
                                    <div className="text-gray-400 mb-1 text-sm">
                                      Your Output:
                                    </div>
                                    <pre className="bg-gray-850 p-3 rounded text-gray-300 overflow-x-auto text-sm">
                                      {typeof testCase.output === "object"
                                        ? JSON.stringify(
                                            testCase.output,
                                            null,
                                            2
                                          )
                                        : testCase.output}
                                    </pre>
                                  </div>
                                )}
                                {!testCase.passed && testCase.error && (
                                  <div className="mt-2">
                                    <div className="text-red-400 mb-1 text-sm">
                                      Error:
                                    </div>
                                    <pre className="bg-gray-850 p-3 rounded text-red-300 overflow-x-auto text-sm">
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
                  </>
                )}
              </div>
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
