import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { resetAllApiState } from "../utils/resetAllApiState";
import { AppDispatch } from "../store";

interface FieldErrors {
  email?: string[];
  password?: string[];
  [key: string]: string[] | undefined; // Allow other field errors
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  fieldErrors: FieldErrors;
}

interface LoginFailurePayload {
  error: string;
  fieldErrors?: FieldErrors;
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
  } catch {
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
      action: PayloadAction<LoginFailurePayload>
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

    tokenRefreshSuccess: (
      state,
      action: PayloadAction<{ accessToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      // Persist the new state
      localStorage.setItem("authState", JSON.stringify(state));
    },
    tokenRefreshFailure: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("authState");
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setCredentials,
  finishedInitialLoad,
  tokenRefreshSuccess,
  tokenRefreshFailure,
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


export const logoutAndReset = () => (dispatch: AppDispatch) => {
  dispatch(logout());
  dispatch(resetAllApiState());
};
