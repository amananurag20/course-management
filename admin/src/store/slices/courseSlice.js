import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { courseService } from '../../services/courseService';

// Async thunks
export const fetchCourses = createAsyncThunk(
  'courses/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await courseService.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await courseService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch course');
    }
  }
);

export const createCourse = createAsyncThunk(
  'courses/create',
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await courseService.create(courseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to create course');
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await courseService.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update course');
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/delete',
  async (id, { rejectWithValue }) => {
    try {
      await courseService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete course');
    }
  }
);

// Module management thunks
export const addModule = createAsyncThunk(
  'courses/addModule',
  async ({ courseId, moduleData }, { rejectWithValue }) => {
    try {
      const response = await courseService.addModule(courseId, moduleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to add module');
    }
  }
);

export const updateModule = createAsyncThunk(
  'courses/updateModule',
  async ({ courseId, moduleIndex, moduleData }, { rejectWithValue }) => {
    try {
      const response = await courseService.updateModule(courseId, moduleIndex, moduleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update module');
    }
  }
);

export const deleteModule = createAsyncThunk(
  'courses/deleteModule',
  async ({ courseId, moduleIndex }, { rejectWithValue }) => {
    try {
      await courseService.deleteModule(courseId, moduleIndex);
      return { courseId, moduleIndex };
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete module');
    }
  }
);

// Fetch MCQ questions for a module
export const fetchModuleMCQs = createAsyncThunk(
  'courses/fetchModuleMCQs',
  async ({ courseId, moduleId }) => {
    const response = await courseService.getModuleMCQs(courseId, moduleId);
    return response.data;
  }
);

// Add a new MCQ question to a module
export const addModuleQuiz = createAsyncThunk(
  'courses/addModuleQuiz',
  async ({ courseId, moduleId, quizData }) => {
    const response = await courseService.addModuleQuiz(courseId, moduleId, quizData);
    return response.data;
  }
);

// Update an existing MCQ question
export const updateModuleQuiz = createAsyncThunk(
  'courses/updateModuleQuiz',
  async ({ courseId, moduleId, quizId, quizData }) => {
    const response = await courseService.updateModuleQuiz(courseId, moduleId, quizId, quizData);
    return response.data;
  }
);

// Delete an MCQ question
export const deleteModuleQuiz = createAsyncThunk(
  'courses/deleteModuleQuiz',
  async ({ courseId, moduleId, quizId }) => {
    await courseService.deleteModuleQuiz(courseId, moduleId, quizId);
    return { courseId, moduleId, quizId };
  }
);

const initialState = {
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,
  mcqQuestions: [],
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch course by id
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create course
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update course
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.courses.findIndex(course => course._id === action.payload._id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        if (state.currentCourse?._id === action.payload._id) {
          state.currentCourse = action.payload;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete course
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter(course => course._id !== action.payload);
        if (state.currentCourse?._id === action.payload) {
          state.currentCourse = null;
        }
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add module
      .addCase(addModule.fulfilled, (state, action) => {
        if (state.currentCourse?._id === action.payload._id) {
          state.currentCourse = action.payload;
        }
      })
      // Update module
      .addCase(updateModule.fulfilled, (state, action) => {
        if (state.currentCourse?._id === action.payload._id) {
          state.currentCourse = action.payload;
        }
      })
      // Delete module
      .addCase(deleteModule.fulfilled, (state, action) => {
        if (state.currentCourse?._id === action.payload.courseId) {
          state.currentCourse.modules = state.currentCourse.modules.filter(
            (_, index) => index !== action.payload.moduleIndex
          );
        }
      })
      // Fetch MCQ questions
      .addCase(fetchModuleMCQs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModuleMCQs.fulfilled, (state, action) => {
        state.loading = false;
        state.mcqQuestions = action.payload;
      })
      .addCase(fetchModuleMCQs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add MCQ question
      .addCase(addModuleQuiz.fulfilled, (state, action) => {
        const course = state.currentCourse;
        if (course) {
          const module = course.modules.find(m => m._id === action.payload.moduleId);
          if (module) {
            module.mcqQuestion = action.payload.quiz._id;
          }
        }
      })
      // Update MCQ question
      .addCase(updateModuleQuiz.fulfilled, (state, action) => {
        state.mcqQuestions = state.mcqQuestions.map(q =>
          q._id === action.payload.quiz._id ? action.payload.quiz : q
        );
      })
      // Delete MCQ question
      .addCase(deleteModuleQuiz.fulfilled, (state, action) => {
        const course = state.currentCourse;
        if (course) {
          const module = course.modules.find(m => m._id === action.payload.moduleId);
          if (module) {
            module.mcqQuestion = null;
          }
        }
        state.mcqQuestions = state.mcqQuestions.filter(q => q._id !== action.payload.quizId);
      });
  },
});

export const { clearError, clearCurrentCourse } = courseSlice.actions;

export default courseSlice.reducer; 