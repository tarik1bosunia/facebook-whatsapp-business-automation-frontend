import { ErrorResponse, LoginRequest, LoginResponse } from "@/types/auth";
import { apiSlice } from "../../api/apiSlice";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/account/login",
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "account/login/",
        method: "POST",
        body: credentials,
      }),
      transformErrorResponse: (response: {
        status: number;
        data: ErrorResponse;
      }) => {
        // Handle different error responses
        if (response.status === 400) {
          return {
            status: response.status,
            message: "Validation Error",
            errors: response.data.errors,
          };
        }
        if (response.status === 404) {
          return {
            status: response.status,
            message: "Invalid Credentials",
            errors: response.data.errors,
          };
        }
        return {
          status: response.status,
          message: "Login Failed",
        };
      },
    }),

    logout: builder.mutation<
      { message: string }, // Success response
      { refresh: string } // Request payload
    >({
      query: (data) => ({
        url: "account/auth/logout/",
        method: "POST",
        body: data,
      }),
    }),

    verifyToken: builder.mutation<{ detail: string }, void>({
      query: () => ({
        url: "account/token/verify/",
        method: "POST",
      }),
    }),
    refreshToken: builder.mutation<{ access: string }, { refresh: string }>({
      query: (credentials) => ({
        url: "account/token/refresh/",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery, useLoginMutation, useLogoutMutation, useVerifyTokenMutation, useRefreshTokenMutation } =
  authApi;
