import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth';
import { 
  LoginRequest, 
  RegistrationRequest, 
  TokenResponse,
  UserProfile,
  PasswordResetRequest,
  EmailChangeRequest,
  PasswordChangeRequest,
  LoginResponse,
  ErrorResponse
} from '@/types/auth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    // login: builder.mutation<LoginResponse, LoginRequest>({
    //   query: (credentials) => ({
    //     url: '/login/',
    //     method: 'POST',
    //     body: credentials
    //   }),


    // transformErrorResponse: (response: { status: number; data: ErrorResponse }) => {
    //     // Handle different error responses
    //     if (response.status === 400) {
    //       return {
    //         status: response.status,
    //         message: 'Validation Error',
    //         errors: response.data.errors,
    //       };
    //     }
    //     if (response.status === 404) {
    //       return {
    //         status: response.status,
    //         message: 'Invalid Credentials',
    //         errors: response.data.errors,
    //       };
    //     }
    //     return {
    //       status: response.status,
    //       message: 'Login Failed',
    //     };
    //   },
    // }),
    
    register: builder.mutation<void, RegistrationRequest>({
      query: (userData) => ({
        url: '/registration/',
        method: 'POST',
        body: userData
      }),
    }),
    
    verifyEmail: builder.mutation<void, { uid: string; token: string }>({
      query: ({ uid, token }) => ({
        url: `/activate/${uid}/${token}/`,
        method: 'POST'
      }),
    }),
    
    // logout: builder.mutation<void, void>({
    //   query: () => ({
    //     url: '/auth/logout/',
    //     method: 'POST'
    //   }),
    // }),
    
    verifyUser: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/verify/',
        method: 'POST'
      }),
    }),
    
    deleteAccount: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/delete-account/',
        method: 'POST'
      }),
    }),
    
    changeEmail: builder.mutation<void, EmailChangeRequest>({
      query: (data) => ({
        url: '/auth/change-email/',
        method: 'POST',
        body: data
      }),
    }),
    
    verifyEmailChange: builder.mutation<void, { token: string }>({
      query: ({ token }) => ({
        url: `/verify-email-change/${token}/`,
        method: 'POST'
      }),
    }),
    
    changePassword: builder.mutation<void, PasswordChangeRequest>({
      query: (data) => ({
        url: '/auth/change-password/',
        method: 'POST',
        body: data
      }),
    }),
    
    getProfile: builder.query<UserProfile, void>({
      query: () => '/auth/profile/',
      providesTags: ['Auth'],
    }),
    
    updateProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: (profile) => ({
        url: '/auth/profile/',
        method: 'PATCH',
        body: profile
      }),
      invalidatesTags: ['Auth'],
    }),
    
    checkEmail: builder.query<{ exists: boolean }, string>({
      query: (email) => ({
        url: '/check-email/',
        params: { email }
      }),
    }),
    
    sendPasswordResetEmail: builder.mutation<void, { email: string }>({
      query: (data) => ({
        url: '/send-password-reset-email/',
        method: 'POST',
        body: data
      }),
    }),
    
    passwordResetConfirm: builder.mutation<void, PasswordResetRequest & { uid: string; token: string }>({
      query: ({ uid, token, ...data }) => ({
        url: `/password-reset-confirm/${uid}/${token}/`,
        method: 'POST',
        body: data
      }),
    }),
    
    getToken: builder.mutation<TokenResponse, void>({
      query: () => ({
        url: '/token/',
        method: 'POST'
      }),
    }),
    
    refreshToken: builder.mutation<{ access: string }, void>({
      query: () => ({
        url: '/token/refresh/',
        method: 'POST',
        body: { refresh: '' } // Will be filled by baseQuery
      }),
    }),
  }),
});

export const {
  // useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  // useLogoutMutation,
  useVerifyUserMutation,
  useDeleteAccountMutation,
  useChangeEmailMutation,
  useVerifyEmailChangeMutation,
  useChangePasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useCheckEmailQuery,
  useSendPasswordResetEmailMutation,
  usePasswordResetConfirmMutation,
  useGetTokenMutation,
  useRefreshTokenMutation,
} = authApi;