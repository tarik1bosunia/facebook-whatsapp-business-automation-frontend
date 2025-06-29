import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "@/types/auth";
import { getTokenExpiration } from "@/lib/utils/jwt";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  fieldErrors: {
    email?: string[];
    password?: string[];
  };
}

const initialDefaultState: AuthState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  fieldErrors: {},
};

const loadState = (): AuthState => {
  try {
    const serializedState = localStorage.getItem("authState");
    if (serializedState === null) return initialDefaultState;

    return JSON.parse(serializedState);
  } catch (err) {
    return {
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      refreshToken: null,
      error: "Failed to load auth state from localStorage.",
      fieldErrors: {},
    };
  }
};

const initialState: AuthState = loadState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.fieldErrors = {};
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ access: string; refresh: string }>
    ) => {
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: (
      state,
      action: PayloadAction<{ error: string; fieldErrors?: any }>
    ) => {
      state.isLoading = false;
      state.error = action.payload.error;
      state.fieldErrors = action.payload.fieldErrors || {};
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("authState");
    },

    // In your authSlice.ts
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      localStorage.setItem("authState", JSON.stringify(state));

    },
    finishedInitialLoad: (state) => {
      state.isLoading = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setCredentials,
  finishedInitialLoad
} = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAccessToken = (state: { auth: AuthState }) =>
  state.auth.accessToken;
export const selectRefreshToken = (state: { auth: AuthState }) =>
  state.auth.refreshToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
