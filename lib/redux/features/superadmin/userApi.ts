// src/store/userApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api/baseQueryWithReauth';

export interface User {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_active: boolean;
  is_email_verified: boolean;
  role: string;
  created_at: string;
  updated_at: string;
}

export type UserListResponse = User[];

export interface CreateUserRequest {
  email: string;
  first_name?: string | null;  
  last_name?: string | null; 
  password?: string;
  is_active?: boolean;
  is_email_verified?: boolean;
  role?: string; 
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: number;
}

export interface ToggleUserStatusRequest {
  id: number;
  is_active: boolean;
}

export const userApi = createApi({
  reducerPath: 'userSuperAdminApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<UserListResponse, void>({
      query: () => 'account/users/',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    getUser: builder.query<User, number>({
      query: (id) => `account/users/${id}/`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    createUser: builder.mutation<User, CreateUserRequest>({
      query: (body) => ({
        url: 'account/users/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: ({ id, ...body }) => ({
        url: `account/users/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `account/users/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    toggleUserStatus: builder.mutation<User, ToggleUserStatusRequest>({
      query: ({ id, is_active }) => ({
        url: `account/users/${id}/`,
        method: 'PATCH',
        body: { is_active },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
} = userApi;
