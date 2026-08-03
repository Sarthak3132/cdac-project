import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ProblemEditorState {
  selectedLanguage: string;
  codeByProblem: Record<number, Record<string, string>>;
}

const initialState: ProblemEditorState = {
  selectedLanguage: "",
  codeByProblem: {},
};

const problemEditorSlice = createSlice({
  name: "problemEditor",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.selectedLanguage = action.payload;
    },

    setCode: (
      state,
      action: PayloadAction<{
        problemId: number;
        language: string;
        code: string;
      }>,
    ) => {
      const { problemId, language, code } = action.payload;

      if (!state.codeByProblem[problemId]) {
        state.codeByProblem[problemId] = {};
      }

      state.codeByProblem[problemId][language] = code;
    },

    resetCode: (
      state,
      action: PayloadAction<{
        problemId: number;
      }>,
    ) => {
      const { problemId } = action.payload;

      if (state.codeByProblem[problemId]) {
        state.codeByProblem[problemId][state.selectedLanguage] = "";
      }
    },
  },
});

export const { setLanguage, setCode, resetCode } = problemEditorSlice.actions;

export default problemEditorSlice.reducer;
