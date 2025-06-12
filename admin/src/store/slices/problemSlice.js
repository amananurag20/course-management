import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { problemService } from '../../services/problemService';

// Async thunks
export const fetchProblems = createAsyncThunk(
  'problems/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await problemService.getAll(params);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch problems');
    }
  }
);

export const fetchProblemById = createAsyncThunk(
  'problems/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await problemService.getById(id);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch problem');
    }
  }
);

export const createProblem = createAsyncThunk(
  'problems/create',
  async (problemData, { rejectWithValue }) => {
    try {
      return await problemService.create(problemData);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to create problem');
    }
  }
);

export const updateProblem = createAsyncThunk(
  'problems/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await problemService.update(id, data);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to update problem');
    }
  }
);

export const deleteProblem = createAsyncThunk(
  'problems/delete',
  async (id, { rejectWithValue }) => {
    try {
      await problemService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to delete problem');
    }
  }
);

export const submitSolution = createAsyncThunk(
  'problems/submit',
  async ({ id, solution }, { rejectWithValue }) => {
    try {
      return await problemService.submitSolution(id, solution);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to submit solution');
    }
  }
);

const initialState = {
  problems: [],
  currentProblem: null,
  loading: false,
  error: null,
  submissionResult: null,
};

const problemSlice = createSlice({
  name: 'problems',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProblem: (state) => {
      state.currentProblem = null;
    },
    clearSubmissionResult: (state) => {
      state.submissionResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all problems
      .addCase(fetchProblems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.problems = action.payload;
      })
      .addCase(fetchProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch problem by id
      .addCase(fetchProblemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProblemById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProblem = action.payload;
      })
      .addCase(fetchProblemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create problem
      .addCase(createProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.problems.push(action.payload);
      })
      .addCase(createProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update problem
      .addCase(updateProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProblem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.problems.findIndex((problem) => problem.id === action.payload.id);
        if (index !== -1) {
          state.problems[index] = action.payload;
        }
        if (state.currentProblem?.id === action.payload.id) {
          state.currentProblem = action.payload;
        }
      })
      .addCase(updateProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete problem
      .addCase(deleteProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.problems = state.problems.filter((problem) => problem.id !== action.payload);
        if (state.currentProblem?.id === action.payload) {
          state.currentProblem = null;
        }
      })
      .addCase(deleteProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit solution
      .addCase(submitSolution.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.submissionResult = null;
      })
      .addCase(submitSolution.fulfilled, (state, action) => {
        state.loading = false;
        state.submissionResult = action.payload;
      })
      .addCase(submitSolution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentProblem, clearSubmissionResult } = problemSlice.actions;
export default problemSlice.reducer; 