import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  questions: [],
  loading: false,
  error: null,
  lecture_id: null,
  lecture_name: null,
};

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload;
    },

    setLecture: (state, action) => {
      state.lecture_id = action.payload.lecture_id;
      state.lecture_name = action.payload.lecture_name;
      console.log(state.lecture_id);
    },

    addQuestion: (state, action) => {
      state.questions.push(action.payload);
    },
    updateQuestion: (state, action) => {
      // update entire question object if the new object has with same id has been passed
      const questionId = action.payload._id;

      const questionIndex = state.questions.findIndex(
        (q) => q.questionId === questionId
      );

      if (questionIndex !== -1) {
        state.questions[questionIndex] = {
          ...state.questions[questionIndex],
          ...action.payload,
        };
      } else {
        state.questions.push(action.payload);
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
    resetQuestions: (state) => {
      state.questions = [];
      // state.loading = false;
      // state.error = null;
      // state.lecture_id = null;
      // state.lecture_name = null;
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
  setLecture,
  resetQuestions,
} = questionsSlice.actions;

export default questionsSlice.reducer;
