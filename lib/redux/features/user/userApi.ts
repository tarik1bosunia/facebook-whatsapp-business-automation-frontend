// services/userApi.ts
import { UpdateUserProfilePayload, UserProfile } from '@/types/user';
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api/baseQueryWithReauth';


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
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = userApi;