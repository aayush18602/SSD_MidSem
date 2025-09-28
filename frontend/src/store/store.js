import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducers/userSlice';
import questionsReducer from '../reducers/questionsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    questions: questionsReducer,
  },
});