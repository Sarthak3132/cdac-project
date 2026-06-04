import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/slice/authSlice";
import compilerReducer from "../features/code-compiler/slice/compilerSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    compiler: compilerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
