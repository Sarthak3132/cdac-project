import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/slice/authSlice";
import compilerReducer from "../features/code-compiler/slice/compilerSlice";

import problemEditorReducer from "../features/problem-detail/slice/ProblemEditorSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    compiler: compilerReducer,
    problemEditor: problemEditorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
