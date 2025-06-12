import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import userReducer from './slices/userSlice';
import mcqReducer from './slices/mcqSlice';
import problemReducer from './slices/problemSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    users: userReducer,
    mcq: mcqReducer,
    problems: problemReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 