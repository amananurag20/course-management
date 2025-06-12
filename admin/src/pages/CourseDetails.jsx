import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  MdEdit,
  MdDelete,
  MdAdd,
  MdPeople,
  MdBook,
  MdCalendarToday,
  MdAccessTime,
  MdSchool,
  MdArrowBack,
  MdCheck,
  MdClose,
  MdPlayCircle,
  MdQuiz,
  MdAssignment,
  MdPerson,
  MdAnalytics,
  MdSettings
} from 'react-icons/md';
import {
  fetchCourseById,
  updateCourse,
  deleteCourse,
  addModule,
  updateModule,
  deleteModule,
  fetchModuleMCQs,
  addModuleQuiz,
  updateModuleQuiz,
  deleteModuleQuiz
} from '../store/slices/courseSlice';

// Course Edit Form Component
const CourseEditForm = ({ course, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail,
    startDate: course.startDate.split('T')[0],
    endDate: course.endDate.split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          rows={4}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
        <input
          type="url"
          value={formData.thumbnail}
          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            required
          />
        </div>
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
          Save Changes
        </button>
      </div>
    </form>
  );
};

// Module Edit Form Component
const ModuleEditForm = ({ module, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: module?.title || '',
    content: module?.content || '',
    resources: module?.resources || []
  });

  const [newResource, setNewResource] = useState({ title: '', type: 'video', url: '' });

  const handleAddResource = () => {
    if (newResource.title && newResource.url) {
      setFormData({
        ...formData,
        resources: [...formData.resources, { ...newResource }]
      });
      setNewResource({ title: '', type: 'video', url: '' });
    }
  };

  const handleRemoveResource = (index) => {
    setFormData({
      ...formData,
      resources: formData.resources.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Module Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          rows={4}
          required
        />
      </div>
      
      {/* Resources Section */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Resources</h4>
        <div className="space-y-2">
          {formData.resources.map((resource, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium">{resource.title}</p>
                <p className="text-sm text-gray-500">{resource.type} • {resource.url}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveResource(index)}
                className="text-red-600 hover:text-red-700"
              >
                <MdDelete />
              </button>
            </div>
          ))}
        </div>
        
        {/* Add Resource Form */}
        <div className="grid grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="Resource Title"
            value={newResource.title}
            onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
            className="col-span-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
          <select
            value={newResource.type}
            onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
            className="col-span-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="video">Video</option>
            <option value="document">Document</option>
            <option value="link">Link</option>
          </select>
          <input
            type="url"
            placeholder="Resource URL"
            value={newResource.url}
            onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
            className="col-span-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
          <button
            type="button"
            onClick={handleAddResource}
            className="col-span-1 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
          >
            Add Resource
          </button>
        </div>
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
          Save Module
        </button>
      </div>
    </form>
  );
};

// Quiz Form Component
const QuizForm = ({ moduleId, quiz, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    question: quiz?.question || '',
    options: quiz?.options || ['', '', '', ''],
    correctOption: quiz?.correctOption || 0,
    explanation: quiz?.explanation || ''
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
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          rows={3}
          required
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Options</label>
        {formData.options.map((option, index) => (
          <div key={index} className="flex items-center space-x-3">
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
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Explanation</label>
        <textarea
          value={formData.explanation}
          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          rows={2}
          placeholder="Explain why the correct answer is right (optional)"
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
          {quiz ? 'Update Quiz' : 'Add Quiz'}
        </button>
      </div>
    </form>
  );
};

// MCQ Question List Component
const MCQQuestionList = ({ questions, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <div key={question._id} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h4 className="text-lg font-medium text-gray-900">Question {index + 1}</h4>
              <p className="mt-2 text-gray-700">{question.question}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(question)}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-full"
              >
                <MdEdit size={20} />
              </button>
              <button
                onClick={() => onDelete(question._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
              >
                <MdDelete size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {question.options.map((option, optIndex) => (
              <div
                key={optIndex}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  optIndex === question.correctOption
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50'
                }`}
              >
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full border ${
                    optIndex === question.correctOption
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {optIndex === question.correctOption && <MdCheck size={16} />}
                </div>
                <span className={`flex-1 ${
                  optIndex === question.correctOption
                    ? 'text-green-700 font-medium'
                    : 'text-gray-700'
                }`}>
                  {option}
                </span>
              </div>
            ))}
          </div>

          {question.explanation && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h5 className="text-sm font-medium text-blue-800 mb-1">Explanation</h5>
              <p className="text-sm text-blue-700">{question.explanation}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Enhanced Quiz Management Component
const QuizManagement = ({ courseId, module }) => {
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const fetchedRef = React.useRef('');
  const abortRef = React.useRef();

  useEffect(() => {
    if (!module?._id) {
      setLoading(false);
      return;
    }
    if (fetchedRef.current === module._id) return;
    fetchedRef.current = module._id;

    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;
    const fetchMCQQuestions = async () => {
      try {
        setLoading(true);
        const response = await dispatch(
          fetchModuleMCQs({ courseId, moduleId: module._id })
        ).unwrap();
        setMcqQuestions(response.questions);
      } catch (err) {
        console.error('Failed to fetch MCQ questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMCQQuestions();
    return () => controller.abort();
  }, [dispatch, courseId, module?._id]);

  const handleAddQuiz = async (quizData) => {
    if (!module?._id) return;
    try {
      await dispatch(addModuleQuiz({ 
        courseId, 
        moduleId: module._id, 
        quizData 
      })).unwrap();
      setShowQuizForm(false);
      // Refresh questions list
      const response = await dispatch(fetchModuleMCQs({
        courseId,
        moduleId: module._id
      })).unwrap();
      setMcqQuestions(response.questions);
    } catch (err) {
      console.error('Failed to add quiz:', err);
    }
  };

  const handleUpdateQuiz = async (quizData) => {
    if (!module?._id) return;
    try {
      await dispatch(updateModuleQuiz({
        courseId,
        moduleId: module._id,
        quizId: selectedQuiz._id,
        quizData
      })).unwrap();
      setShowQuizForm(false);
      setSelectedQuiz(null);
      // Refresh questions list
      const response = await dispatch(fetchModuleMCQs({
        courseId,
        moduleId: module._id
      })).unwrap();
      setMcqQuestions(response.questions);
    } catch (err) {
      console.error('Failed to update quiz:', err);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!module?._id) return;
    if (!window.confirm('Are you sure you want to delete this quiz question?')) return;

    try {
      await dispatch(deleteModuleQuiz({
        courseId,
        moduleId: module._id,
        quizId
      })).unwrap();
      // Refresh questions list
      const response = await dispatch(fetchModuleMCQs({
        courseId,
        moduleId: module._id
      })).unwrap();
      setMcqQuestions(response.questions);
    } catch (err) {
      console.error('Failed to delete quiz:', err);
    }
  };

  if (!module) {
    return (
      <div className="text-center py-12">
        <MdQuiz className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-500">Please select a module to manage its quizzes.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Module Quiz Questions</h3>
          <p className="text-sm text-gray-500 mt-1">
            Managing quizzes for: {module.title}
          </p>
          <p className="text-sm text-gray-500">
            {mcqQuestions.length} question{mcqQuestions.length !== 1 ? 's' : ''} in this module
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedQuiz(null);
            setShowQuizForm(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 flex items-center"
        >
          <MdAdd className="mr-2" /> Add Question
        </button>
      </div>

      {showQuizForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <QuizForm
            moduleId={module._id}
            quiz={selectedQuiz}
            onSubmit={selectedQuiz ? handleUpdateQuiz : handleAddQuiz}
            onCancel={() => {
              setShowQuizForm(false);
              setSelectedQuiz(null);
            }}
          />
        </div>
      ) : mcqQuestions.length > 0 ? (
        <>
          <MCQQuestionList
            questions={mcqQuestions}
            onEdit={(quiz) => {
              setSelectedQuiz(quiz);
              setShowQuizForm(true);
            }}
            onDelete={handleDeleteQuiz}
          />

          {/* Quiz Statistics */}
          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Quiz Statistics</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Total Questions</p>
                <p className="text-2xl font-semibold text-gray-900">{mcqQuestions.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Students Attempted</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {module.completedBy?.length || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Pass Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {module.completedBy?.length ? 
                    `${Math.round((module.completedBy.filter(c => c.mcqPassed).length / module.completedBy.length) * 100)}%` 
                    : '0%'}
                </p>
              </div>
            </div>
          </div>

          {/* Student Performance */}
          {module.completedBy?.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Student Performance</h4>
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4">
                      <span className="text-sm font-medium text-gray-500">Student</span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-sm font-medium text-gray-500">Score</span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-sm font-medium text-gray-500">Status</span>
                    </div>
                    <div className="col-span-4 text-right">
                      <span className="text-sm font-medium text-gray-500">Completed On</span>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {module.completedBy.map((completion) => (
                    <div key={completion._id} className="px-6 py-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-4">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full ${
                              completion.mcqPassed ? 'bg-green-500' : 'bg-red-500'
                            } mr-3`} />
                            <span className="text-sm font-medium text-gray-900">
                              {completion.user}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-2 text-center">
                          <span className="text-sm text-gray-500">
                            {completion.mcqScore}
                          </span>
                        </div>
                        <div className="col-span-2 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            completion.mcqPassed
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {completion.mcqPassed ? 'Passed' : 'Failed'}
                          </span>
                        </div>
                        <div className="col-span-4 text-right">
                          <span className="text-sm text-gray-500">
                            {new Date(completion.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MdQuiz className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">No quiz questions added for this module yet.</p>
          <button
            onClick={() => setShowQuizForm(true)}
            className="mt-4 text-purple-600 hover:text-purple-700 font-medium flex items-center justify-center mx-auto"
          >
            <MdAdd className="mr-2" /> Add your first question
          </button>
        </div>
      )}
    </div>
  );
};

// Student Progress Component
const StudentProgress = ({ courseId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch student progress data
    // Implementation here
  }, [courseId]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Student Progress</h3>
      {/* Student progress implementation */}
    </div>
  );
};

// Main CourseDetails Component
const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCourse: course, loading, error } = useSelector((state) => state.courses);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCourseEdit, setShowCourseEdit] = useState(false);
  const [showModuleEdit, setShowModuleEdit] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    dispatch(fetchCourseById(id));
  }, [dispatch, id]);

  const handleEditCourse = async (courseData) => {
    try {
      await dispatch(updateCourse({ id: course._id, data: courseData })).unwrap();
      setShowCourseEdit(false);
    } catch (err) {
      console.error('Failed to update course:', err);
    }
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      await dispatch(deleteCourse(course._id)).unwrap();
      navigate('/courses');
    } catch (err) {
      console.error('Failed to delete course:', err);
    }
  };

  const handleAddModule = async (moduleData) => {
    try {
      await dispatch(addModule({ courseId: course._id, moduleData })).unwrap();
      setShowModuleEdit(false);
      setSelectedModule(null);
    } catch (err) {
      console.error('Failed to add module:', err);
    }
  };

  const handleEditModule = async (moduleData) => {
    try {
      await dispatch(updateModule({
        courseId: course._id,
        moduleIndex: course.modules.findIndex(m => m._id === selectedModule._id),
        moduleData
      })).unwrap();
      setShowModuleEdit(false);
      setSelectedModule(null);
    } catch (err) {
      console.error('Failed to update module:', err);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm('Are you sure you want to delete this module?')) return;

    try {
      const moduleIndex = course.modules.findIndex(m => m._id === moduleId);
      await dispatch(deleteModule({ courseId: course._id, moduleIndex })).unwrap();
    } catch (err) {
      console.error('Failed to delete module:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate('/courses')}
            className="mt-2 text-red-600 hover:text-red-700 font-medium flex items-center"
          >
            <MdArrowBack className="mr-2" /> Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <button
          onClick={() => navigate('/courses')}
          className="text-gray-600 hover:text-gray-700 flex items-center"
        >
          <MdArrowBack className="mr-2" /> Back to Courses
        </button>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowCourseEdit(true)}
            className="px-4 py-2 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 flex items-center"
          >
            <MdEdit className="mr-2" /> Edit Course
          </button>
          <button
            onClick={handleDeleteCourse}
            className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 flex items-center"
          >
            <MdDelete className="mr-2" /> Delete Course
          </button>
        </div>
      </div>

      {/* Course Info */}
      {showCourseEdit ? (
        <div className="bg-white rounded-xl shadow-md p-6">
          <CourseEditForm
            course={course}
            onSubmit={handleEditCourse}
            onCancel={() => setShowCourseEdit(false)}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative h-48">
            <img
              src={course.thumbnail || 'https://via.placeholder.com/800x400?text=Course+Thumbnail'}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                <p className="text-gray-200">{course.description}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center">
                <MdPeople className="text-purple-500 mr-3" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Students</p>
                  <p className="text-lg font-semibold">{course.students?.length || 0}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MdBook className="text-purple-500 mr-3" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Modules</p>
                  <p className="text-lg font-semibold">{course.modules?.length || 0}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MdCalendarToday className="text-purple-500 mr-3" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="text-lg font-semibold">{new Date(course.startDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MdAccessTime className="text-purple-500 mr-3" size={24} />
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="text-lg font-semibold">{new Date(course.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MdBook className="inline-block mr-2" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'students'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MdPerson className="inline-block mr-2" /> Students
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'quizzes'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MdQuiz className="inline-block mr-2" /> Quizzes
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'assignments'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MdAssignment className="inline-block mr-2" /> Assignments
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'progress'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MdAnalytics className="inline-block mr-2" /> Progress
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MdSettings className="inline-block mr-2" /> Settings
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* Modules Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Course Modules</h2>
                <button
                  onClick={() => {
                    setSelectedModule(null);
                    setShowModuleEdit(true);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                >
                  <MdAdd className="mr-2" /> Add Module
                </button>
              </div>

              {showModuleEdit ? (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <ModuleEditForm
                    module={selectedModule}
                    onSubmit={selectedModule ? handleEditModule : handleAddModule}
                    onCancel={() => {
                      setShowModuleEdit(false);
                      setSelectedModule(null);
                    }}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {course.modules?.map((module, index) => (
                    <div
                      key={module._id}
                      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedModule(module);
                                setShowModuleEdit(true);
                              }}
                              className="p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-purple-600"
                            >
                              <MdEdit size={20} />
                            </button>
                            <button
                              onClick={() => handleDeleteModule(module._id)}
                              className="p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-600"
                            >
                              <MdDelete size={20} />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{module.content}</p>
                        
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-gray-700">Resources:</h4>
                          {module.resources?.map((resource) => (
                            <div key={resource._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center">
                                <MdPlayCircle className="text-purple-500 mr-2" size={20} />
                                <div>
                                  <p className="text-sm font-medium text-gray-700">{resource.title}</p>
                                  <p className="text-xs text-gray-500">Type: {resource.type}</p>
                                </div>
                              </div>
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                              >
                                View Resource →
                              </a>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-sm text-gray-500">
                              <MdPeople className="mr-2 text-purple-500" />
                              {module.completedBy?.length || 0} Completed
                            </div>
                            {module.mcqQuestion ? (
                              <div className="flex items-center space-x-2">
                                <MdQuiz className="text-purple-500" />
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                  Has Quiz
                                </span>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedModule(module);
                                  setActiveTab('quizzes');
                                }}
                                className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
                              >
                                <MdAdd className="mr-1" /> Add Quiz
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(!course.modules || course.modules.length === 0) && !showModuleEdit && (
                <div className="text-center py-12">
                  <MdBook className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">No modules added yet.</p>
                  <button
                    onClick={() => {
                      setSelectedModule(null);
                      setShowModuleEdit(true);
                    }}
                    className="mt-4 text-purple-600 hover:text-purple-700 font-medium flex items-center justify-center mx-auto"
                  >
                    <MdAdd className="mr-2" /> Add your first module
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <StudentProgress courseId={course._id} />
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            {selectedModule ? (
              <QuizManagement courseId={course._id} module={selectedModule} />
            ) : (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Module Quizzes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {course.modules?.map((module) => (
                    <div
                      key={module._id}
                      onClick={() => setSelectedModule(module)}
                      className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-medium text-gray-900">{module.title}</h4>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {module.mcqQuestion ? 'Has Quiz' : 'No Quiz'}
                        </span>
                        {module.completedBy?.length > 0 && (
                          <span className="text-sm text-gray-500">
                            {module.completedBy.length} Attempted
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            {/* Assignments implementation */}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            {/* Progress tracking implementation */}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            {/* Course settings implementation */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails; 