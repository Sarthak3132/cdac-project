// features/problem/slice/problemSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Problem, RunResult, SubmitResult } from "@/types/problem-detail";

const DEFAULT_CODE: Record<string, string> = {
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // write your solution\n    return 0;\n}`,
  python: `# write your solution\n`,
  javascript: `// write your solution\n`,
  java: `public class Solution {\n    public static void main(String[] args) {\n        // write your solution\n    }\n}`,
};

type ProblemState = {
  problem: Problem | null;
  loading: boolean;
  error: string | null;
  codeByLanguage: Record<string, string>;
  selectedLanguage: string;
  customInput: string;
  useCustomInput: boolean;
  runResult: RunResult | null;
  submitResult: SubmitResult | null;
  isRunning: boolean;
  isSubmitting: boolean;
};

const initialState: ProblemState = {
  problem: null,
  loading: false,
  error: null,
  codeByLanguage: { ...DEFAULT_CODE },
  selectedLanguage: "cpp",
  customInput: "",
  useCustomInput: false,
  runResult: null,
  submitResult: null,
  isRunning: false,
  isSubmitting: false,
};

import {
  DUMMY_PROBLEM,
  DUMMY_RUN_RESULT,
  DUMMY_SUBMIT_RESULT,
} from "@/features/problem-detail/data/dummy-problem-details";

// Replace fetchProblem
export const fetchProblem = createAsyncThunk("problem/fetchProblem", async (_id: string) => {
  await new Promise((r) => setTimeout(r, 600)); // simulate network
  return DUMMY_PROBLEM;
});

// Replace runCode
export const runCode = createAsyncThunk(
  "problem/runCode",
  async (_payload: { code: string; language: string; input: string; problemId: string }) => {
    await new Promise((r) => setTimeout(r, 1200)); // simulate execution
    return DUMMY_RUN_RESULT;
  },
);

// Replace submitCode
export const submitCode = createAsyncThunk(
  "problem/submitCode",
  async (_payload: { code: string; language: string; problemId: string }) => {
    await new Promise((r) => setTimeout(r, 2000)); // simulate grading
    return DUMMY_SUBMIT_RESULT;
  },
);

const problemSlice = createSlice({
  name: "problem",
  initialState,
  reducers: {
    setCode(state, action: PayloadAction<{ language: string; code: string }>) {
      state.codeByLanguage[action.payload.language] = action.payload.code;
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.selectedLanguage = action.payload;
    },
    setCustomInput(state, action: PayloadAction<string>) {
      state.customInput = action.payload;
    },
    setUseCustomInput(state, action: PayloadAction<boolean>) {
      state.useCustomInput = action.payload;
    },
    clearResults(state) {
      state.runResult = null;
      state.submitResult = null;
    },
    resetCode(state) {
      state.codeByLanguage[state.selectedLanguage] = DEFAULT_CODE[state.selectedLanguage] ?? "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.problem = action.payload;
      })
      .addCase(fetchProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Unknown error";
      })
      .addCase(runCode.pending, (state) => {
        state.isRunning = true;
        state.runResult = null;
        state.submitResult = null;
      })
      .addCase(runCode.fulfilled, (state, action) => {
        state.isRunning = false;
        state.runResult = action.payload;
      })
      .addCase(runCode.rejected, (state) => {
        state.isRunning = false;
      })
      .addCase(submitCode.pending, (state) => {
        state.isSubmitting = true;
        state.submitResult = null;
        state.runResult = null;
      })
      .addCase(submitCode.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.submitResult = action.payload;
      })
      .addCase(submitCode.rejected, (state) => {
        state.isSubmitting = false;
      });
  },
});

export const { setCode, setLanguage, setCustomInput, setUseCustomInput, clearResults, resetCode } =
  problemSlice.actions;
export default problemSlice.reducer;
