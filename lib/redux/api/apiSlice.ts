import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Conversation', 'Messages', 'Customer', 'Order', 'FAQ', 'Category'],
  endpoints: () => ({}),
});


// export const apiSlice = createApi({
//   reducerPath: 'api',
//   baseQuery: fetchBaseQuery({
//     baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/',
//   }),
//   tagTypes: ['Conversation', 'Messages', 'Customer', 'Order', 'FAQ', 'Category'],
//   endpoints: () => ({}),
// });
