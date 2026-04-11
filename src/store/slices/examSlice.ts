import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Exam, ExamAttempt } from "@/types";

interface ExamState {
  exams: Exam[];
  currentExam: Exam | null;
  currentAttempt: ExamAttempt | null;
  answers: Record<string, number | number[]>;
  isLoading: boolean;
}

const initialState: ExamState = {
  exams: [],
  currentExam: null,
  currentAttempt: null,
  answers: {},
  isLoading: false,
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    setExams: (state, action: PayloadAction<Exam[]>) => {
      state.exams = action.payload;
    },
    addExam: (state, action: PayloadAction<Exam>) => {
      state.exams.push(action.payload);
    },
    updateExam: (state, action: PayloadAction<Exam>) => {
      const index = state.exams.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.exams[index] = action.payload;
      }
    },
    setCurrentExam: (state, action: PayloadAction<Exam | null>) => {
      state.currentExam = action.payload;
    },
    setCurrentAttempt: (state, action: PayloadAction<ExamAttempt | null>) => {
      state.currentAttempt = action.payload;
    },
    setAnswer: (
      state,
      action: PayloadAction<{ questionId: string; answer: number | number[] }>
    ) => {
      state.answers[action.payload.questionId] = action.payload.answer;
    },
    setAnswers: (state, action: PayloadAction<Record<string, number | number[]>>) => {
      state.answers = action.payload;
    },
    clearAnswers: (state) => {
      state.answers = {};
    },
    setExamLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setExams,
  addExam,
  updateExam,
  setCurrentExam,
  setCurrentAttempt,
  setAnswer,
  setAnswers,
  clearAnswers,
  setExamLoading,
} = examSlice.actions;

export default examSlice.reducer;
