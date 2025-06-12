import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCourseById,
  fetchModuleMCQs,
  addModuleQuiz,
  updateModuleQuiz,
  deleteModuleQuiz,
} from '../store/slices/courseSlice';
import { MdArrowBack, MdAdd } from 'react-icons/md';

const QuizForm = ({ quiz, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    question: quiz?.question || '',
    options: quiz?.options || ['', '', '', ''],
    correctOption: quiz?.correctOption || 0,
    explanation: quiz?.explanation || '',
  });

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question</label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          rows={3}
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Options</label>
        {formData.options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="radio"
              name="correctOption"
              checked={formData.correctOption === index}
              onChange={() => setFormData({ ...formData, correctOption: index })}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500"
            />
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Explanation</label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          rows={2}
          value={formData.explanation}
          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
        >
          {quiz ? 'Update' : 'Add'} Question
        </button>
      </div>
    </form>
  );
};

const ModuleQuiz = () => {
  const { courseId, moduleId } = useParams();
  const dispatch = useDispatch();
  const { currentCourse } = useSelector((state) => state.courses);
  const [questions, setQuestions] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!currentCourse || currentCourse._id !== courseId) {
      dispatch(fetchCourseById(courseId));
    }
  }, [dispatch, courseId, currentCourse?._id]);

  const fetchedRef = React.useRef('');
  useEffect(() => {
    if (fetchedRef.current === moduleId) return;
    fetchedRef.current = moduleId;

    const controller = new AbortController();
    const load = async () => {
      try {
        const res = await dispatch(
          fetchModuleMCQs({ courseId, moduleId })
        ).unwrap();
        setQuestions(res.questions);
      } catch (err) {
        console.error('Failed to load module quiz:', err);
      }
    };
    load();
    return () => {
      controller.abort();
    };
  }, [dispatch, courseId, moduleId]);

  const handleAdd = async (data) => {
    await dispatch(addModuleQuiz({ courseId, moduleId, quizData: data })).unwrap();
    const res = await dispatch(fetchModuleMCQs({ courseId, moduleId })).unwrap();
    setQuestions(res.questions);
    setShowForm(false);
  };

  const handleUpdate = async (data) => {
    if (!selectedQuiz) return;
    await dispatch(
      updateModuleQuiz({ courseId, moduleId, quizId: selectedQuiz._id, quizData: data })
    ).unwrap();
    const res = await dispatch(fetchModuleMCQs({ courseId, moduleId })).unwrap();
    setQuestions(res.questions);
    setShowForm(false);
    setSelectedQuiz(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    await dispatch(deleteModuleQuiz({ courseId, moduleId, quizId: id })).unwrap();
    const res = await dispatch(fetchModuleMCQs({ courseId, moduleId })).unwrap();
    setQuestions(res.questions);
  };

  const module = currentCourse?.modules?.find((m) => m._id === moduleId);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Link to={`/courses/${courseId}`} className="text-purple-600 hover:text-purple-700 flex items-center">
          <MdArrowBack className="mr-1" /> Back to Course
        </Link>
        {module && <h2 className="text-xl font-semibold">Quiz: {module.title}</h2>}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => {
            setSelectedQuiz(null);
            setShowForm(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 flex items-center"
        >
          <MdAdd className="mr-2" /> Add Question
        </button>
      </div>

      {showForm ? (
        <QuizForm
          quiz={selectedQuiz}
          onSubmit={selectedQuiz ? handleUpdate : handleAdd}
          onCancel={() => {
            setShowForm(false);
            setSelectedQuiz(null);
          }}
        />
      ) : questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q._id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">Question {idx + 1}</h4>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setSelectedQuiz(q);
                      setShowForm(true);
                    }}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mb-2">{q.question}</p>
              <ul className="space-y-1">
                {q.options.map((opt, i) => (
                  <li key={i} className={i === q.correctOption ? 'font-semibold text-green-700' : ''}>
                    {opt}
                  </li>
                ))}
              </ul>
              {q.explanation && (
                <p className="text-sm text-gray-500 mt-2">{q.explanation}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No questions yet.</p>
      )}
    </div>
  );
};

export default ModuleQuiz;
