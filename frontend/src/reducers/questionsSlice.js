import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  questions: [],
  loading: false,
  error: null,
};

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload;
    },
    addQuestion: (state, action) => {
      state.questions.push(action.payload);
    },
    updateQuestion: (state, action) => {
      const { questionId, updates } = action.payload;
      const questionIndex = state.questions.findIndex(
        (q) => q.questionId === questionId
      );
      if (questionIndex !== -1) {
        state.questions[questionIndex] = {
          ...state.questions[questionIndex],
          ...updates,
        };
      }
    },
    updateQuestionStatus: (state, action) => {
      const { questionId, status } = action.payload;
      const questionIndex = state.questions.findIndex(
        (q) => q.questionId === questionId
      );
      if (questionIndex !== -1) {
        state.questions[questionIndex].status = status;
      }
    },
    deleteQuestion: (state, action) => {
      const questionId = action.payload;
      state.questions = state.questions.filter(
        (q) => q.questionId !== questionId
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setQuestions,
  addQuestion,
  updateQuestion,
  updateQuestionStatus,
  deleteQuestion,
  setLoading,
  setError,
  clearError,
} = questionsSlice.actions;

export default questionsSlice.reducer;
