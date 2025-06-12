import React, { useState, useEffect } from 'react';
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdQuiz,
  MdCheck,
  MdClose,
  MdMoreVert,
} from 'react-icons/md';
import axios from 'axios';

const MCQCard = ({ question, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{question.question}</h3>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg flex items-center justify-between ${
                    option.isCorrect
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <span className={option.isCorrect ? 'text-green-700' : 'text-gray-700'}>
                    {option.text}
                  </span>
                  {option.isCorrect && (
                    <MdCheck className="text-green-500" size={20} />
                  )}
                </div>
              ))}
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
                    onEdit(question);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <MdEdit className="mr-2" /> Edit Question
                </button>
                <button
                  onClick={() => {
                    onDelete(question._id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <MdDelete className="mr-2" /> Delete Question
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
              Topic: {question.topic || 'General'}
            </span>
            <span className="text-sm text-gray-500">
              Difficulty: {question.difficulty || 'Medium'}
            </span>
          </div>
          <button
            onClick={() => onEdit(question)}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            Edit Question →
          </button>
        </div>
      </div>
    </div>
  );
};

const MCQForm = ({ question, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    question: question?.question || '',
    topic: question?.topic || '',
    difficulty: question?.difficulty || 'medium',
    options: question?.options || [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ],
    explanation: question?.explanation || '',
  });

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    if (field === 'isCorrect') {
      // Uncheck all other options
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index ? value : false;
      });
    } else {
      newOptions[index][field] = value;
    }
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        {question ? 'Edit Question' : 'Create New Question'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label" htmlFor="question">
            Question
          </label>
          <textarea
            id="question"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            className="input min-h-[100px]"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="topic">
              Topic
            </label>
            <input
              type="text"
              id="topic"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
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

        <div>
          <label className="label">Options</label>
          <div className="space-y-4">
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                  className="input flex-1"
                  placeholder={`Option ${index + 1}`}
                  required
                />
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={option.isCorrect}
                    onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                    className="form-radio h-5 w-5 text-purple-600"
                  />
                  <span className="text-sm text-gray-600">Correct Answer</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="explanation">
            Explanation
          </label>
          <textarea
            id="explanation"
            value={formData.explanation}
            onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
            className="input min-h-[100px]"
            placeholder="Explain why the correct answer is right..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {question ? 'Update Question' : 'Create Question'}
          </button>
        </div>
      </form>
    </div>
  );
};

const MCQQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/mcq-questions');
      setQuestions(response.data);
    } catch (err) {
      setError('Failed to fetch questions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (questionData) => {
    try {
      await axios.post('/api/mcq-questions', questionData);
      fetchQuestions();
      setShowForm(false);
    } catch (err) {
      setError('Failed to create question');
      console.error(err);
    }
  };

  const handleUpdateQuestion = async (questionData) => {
    try {
      await axios.put(`/api/mcq-questions/${selectedQuestion._id}`, questionData);
      fetchQuestions();
      setShowForm(false);
      setSelectedQuestion(null);
    } catch (err) {
      setError('Failed to update question');
      console.error(err);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      await axios.delete(`/api/mcq-questions/${questionId}`);
      fetchQuestions();
    } catch (err) {
      setError('Failed to delete question');
      console.error(err);
    }
  };

  const filteredQuestions = questions.filter(
    (question) =>
      question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.topic.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-2xl font-bold text-gray-900">MCQ Questions</h1>
        <button
          onClick={() => {
            setSelectedQuestion(null);
            setShowForm(true);
          }}
          className="btn btn-primary flex items-center"
        >
          <MdAdd className="mr-2" /> Add New Question
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {showForm ? (
        <MCQForm
          question={selectedQuestion}
          onSubmit={selectedQuestion ? handleUpdateQuestion : handleCreateQuestion}
          onCancel={() => {
            setShowForm(false);
            setSelectedQuestion(null);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQuestions.map((question) => (
            <MCQCard
              key={question._id}
              question={question}
              onEdit={(question) => {
                setSelectedQuestion(question);
                setShowForm(true);
              }}
              onDelete={handleDeleteQuestion}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MCQQuestions; 