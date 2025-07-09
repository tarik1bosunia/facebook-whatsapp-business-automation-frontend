// services/userApi.ts
import { UpdateUserProfilePayload, UserProfile } from '@/types/user';
import { createApi, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api/baseQueryWithReauth';

interface ChangePasswordRequest {
  old_password: string
  new_password: string
}

interface ChangePasswordResponse {
  message: string
}

interface ChangePasswordError {
  errors?: {
    old_password?: string[];
    new_password?: string[];
  };
  message?: string;
}


export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => 'account/auth/profile/',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<UserProfile, Partial<UpdateUserProfilePayload>>({
      query: (body) => ({
        url: 'account/auth/profile/',
        method: 'PATCH', 
        body,
      }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest, { rejectValue: ChangePasswordError }>({
      query: (body) => ({
        url: 'account/auth/change-password/',
        method: 'POST',
        body,
      }),
        transformErrorResponse: (
        response: FetchBaseQueryError & { data?: ChangePasswordError }
      ): ChangePasswordError => {
        return response.data || { message: 'Unknown error occurred' };
      },
      
    }),
    
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } = userApi;