import React, { useState, useEffect } from 'react';
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdCode,
  MdMoreVert,
  MdTimer,
  MdSignalCellularAlt,
} from 'react-icons/md';
import axios from 'axios';

const ProblemCard = ({ problem, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'hard':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{problem.title}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                  problem.difficulty
                )}`}
              >
                {problem.difficulty}
              </span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">{problem.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <MdTimer className="mr-1" />
                {problem.timeLimit} sec
              </div>
              <div className="flex items-center">
                <MdSignalCellularAlt className="mr-1" />
                {problem.memoryLimit} MB
              </div>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <MdMoreVert className="text-gray-500" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                <button
                  onClick={() => {
                    onEdit(problem);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <MdEdit className="mr-2" /> Edit Problem
                </button>
                <button
                  onClick={() => {
                    onDelete(problem._id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <MdDelete className="mr-2" /> Delete Problem
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Category: {problem.category || 'General'}
            </span>
            <span className="text-sm text-gray-500">
              Points: {problem.points}
            </span>
          </div>
          <button
            onClick={() => onEdit(problem)}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            Manage Problem →
          </button>
        </div>
      </div>
    </div>
  );
};

const ProblemForm = ({ problem, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: problem?.title || '',
    description: problem?.description || '',
    category: problem?.category || '',
    difficulty: problem?.difficulty || 'medium',
    timeLimit: problem?.timeLimit || 1,
    memoryLimit: problem?.memoryLimit || 256,
    points: problem?.points || 100,
    testCases: problem?.testCases || [
      { input: '', output: '', explanation: '' }
    ],
    sampleCode: problem?.sampleCode || {
      python: '# Write your solution here\n',
      javascript: '// Write your solution here\n',
      java: '// Write your solution here\n'
    },
  });

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...formData.testCases];
    newTestCases[index][field] = value;
    setFormData({ ...formData, testCases: newTestCases });
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { input: '', output: '', explanation: '' }],
    });
  };

  const removeTestCase = (index) => {
    const newTestCases = formData.testCases.filter((_, i) => i !== index);
    setFormData({ ...formData, testCases: newTestCases });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        {problem ? 'Edit Problem' : 'Create New Problem'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label" htmlFor="title">
            Problem Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="description">
            Problem Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input min-h-[200px]"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="category">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="difficulty">
              Difficulty
            </label>
            <select
              id="difficulty"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="input"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label" htmlFor="timeLimit">
              Time Limit (seconds)
            </label>
            <input
              type="number"
              id="timeLimit"
              value={formData.timeLimit}
              onChange={(e) => setFormData({ ...formData, timeLimit: Number(e.target.value) })}
              className="input"
              min="1"
              step="0.5"
            />
          </div>
          <div>
            <label className="label" htmlFor="memoryLimit">
              Memory Limit (MB)
            </label>
            <input
              type="number"
              id="memoryLimit"
              value={formData.memoryLimit}
              onChange={(e) => setFormData({ ...formData, memoryLimit: Number(e.target.value) })}
              className="input"
              min="64"
              step="64"
            />
          </div>
          <div>
            <label className="label" htmlFor="points">
              Points
            </label>
            <input
              type="number"
              id="points"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
              className="input"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="label">Test Cases</label>
          <div className="space-y-4">
            {formData.testCases.map((testCase, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Test Case #{index + 1}</h4>
                  {formData.testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTestCase(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="label">Input</label>
                    <textarea
                      value={testCase.input}
                      onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                      className="input"
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="label">Expected Output</label>
                    <textarea
                      value={testCase.output}
                      onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                      className="input"
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="label">Explanation</label>
                    <textarea
                      value={testCase.explanation}
                      onChange={(e) => handleTestCaseChange(index, 'explanation', e.target.value)}
                      className="input"
                      rows="2"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addTestCase}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors"
            >
              + Add Test Case
            </button>
          </div>
        </div>

        <div>
          <label className="label">Sample Code</label>
          <div className="space-y-4">
            {Object.entries(formData.sampleCode).map(([language, code]) => (
              <div key={language}>
                <label className="label capitalize">{language}</label>
                <textarea
                  value={code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sampleCode: { ...formData.sampleCode, [language]: e.target.value },
                    })
                  }
                  className="input font-mono"
                  rows="4"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {problem ? 'Update Problem' : 'Create Problem'}
          </button>
        </div>
      </form>
    </div>
  );
};

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/problems');
      setProblems(response.data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProblem = async (problemData) => {
    try {
      await axios.post('/api/problems', problemData);
      fetchProblems();
      setShowForm(false);
    } catch (err) {
      setError('Failed to create problem');
      console.error(err);
    }
  };

  const handleUpdateProblem = async (problemData) => {
    try {
      await axios.put(`/api/problems/${selectedProblem._id}`, problemData);
      fetchProblems();
      setShowForm(false);
      setSelectedProblem(null);
    } catch (err) {
      setError('Failed to update problem');
      console.error(err);
    }
  };

  const handleDeleteProblem = async (problemId) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;

    try {
      await axios.delete(`/api/problems/${problemId}`);
      fetchProblems();
    } catch (err) {
      setError('Failed to delete problem');
      console.error(err);
    }
  };

  const filteredProblems = problems.filter(
    (problem) =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Coding Problems</h1>
        <button
          onClick={() => {
            setSelectedProblem(null);
            setShowForm(true);
          }}
          className="btn btn-primary flex items-center"
        >
          <MdAdd className="mr-2" /> Add New Problem
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search problems..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {showForm ? (
        <ProblemForm
          problem={selectedProblem}
          onSubmit={selectedProblem ? handleUpdateProblem : handleCreateProblem}
          onCancel={() => {
            setShowForm(false);
            setSelectedProblem(null);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProblems.map((problem) => (
            <ProblemCard
              key={problem._id}
              problem={problem}
              onEdit={(problem) => {
                setSelectedProblem(problem);
                setShowForm(true);
              }}
              onDelete={handleDeleteProblem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Problems; 