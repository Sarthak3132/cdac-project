import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/slice/authSlice";
import compilerReducer from "../features/code-compiler/slice/compilerSlice";
import problemReducer from "../features/problem-detail/slice/problemSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    compiler: compilerReducer,
    problem: problemReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
