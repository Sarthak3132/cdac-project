// this is the auth slice which will handle the authentication state of the user
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "@/types/auth";

const getInitialState = (): AuthState => {
  const user = localStorage.getItem("user");

  if (user) {
    return {
      isAuthenticated: true,
      user: JSON.parse(user),
    };
  }

  return {
    isAuthenticated: false,
    user: null,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;

      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;

      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
