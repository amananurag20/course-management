import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mcqService } from '../../services/mcqService';

// Async thunks
export const fetchMCQs = createAsyncThunk(
  'mcq/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await mcqService.getAll(params);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch MCQs');
    }
  }
);

export const fetchMCQById = createAsyncThunk(
  'mcq/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await mcqService.getById(id);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch MCQ');
    }
  }
);

export const createMCQ = createAsyncThunk(
  'mcq/create',
  async (mcqData, { rejectWithValue }) => {
    try {
      return await mcqService.create(mcqData);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to create MCQ');
    }
  }
);

export const updateMCQ = createAsyncThunk(
  'mcq/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await mcqService.update(id, data);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to update MCQ');
    }
  }
);

export const deleteMCQ = createAsyncThunk(
  'mcq/delete',
  async (id, { rejectWithValue }) => {
    try {
      await mcqService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to delete MCQ');
    }
  }
);

const initialState = {
  mcqs: [],
  currentMCQ: null,
  loading: false,
  error: null,
};

const mcqSlice = createSlice({
  name: 'mcq',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentMCQ: (state) => {
      state.currentMCQ = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all MCQs
      .addCase(fetchMCQs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMCQs.fulfilled, (state, action) => {
        state.loading = false;
        state.mcqs = action.payload;
      })
      .addCase(fetchMCQs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch MCQ by id
      .addCase(fetchMCQById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMCQById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMCQ = action.payload;
      })
      .addCase(fetchMCQById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create MCQ
      .addCase(createMCQ.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMCQ.fulfilled, (state, action) => {
        state.loading = false;
        state.mcqs.push(action.payload);
      })
      .addCase(createMCQ.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update MCQ
      .addCase(updateMCQ.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMCQ.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.mcqs.findIndex((mcq) => mcq.id === action.payload.id);
        if (index !== -1) {
          state.mcqs[index] = action.payload;
        }
        if (state.currentMCQ?.id === action.payload.id) {
          state.currentMCQ = action.payload;
        }
      })
      .addCase(updateMCQ.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete MCQ
      .addCase(deleteMCQ.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMCQ.fulfilled, (state, action) => {
        state.loading = false;
        state.mcqs = state.mcqs.filter((mcq) => mcq.id !== action.payload);
        if (state.currentMCQ?.id === action.payload) {
          state.currentMCQ = null;
        }
      })
      .addCase(deleteMCQ.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentMCQ } = mcqSlice.actions;
export default mcqSlice.reducer; 