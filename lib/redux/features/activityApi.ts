import { PaginatedResponse } from "@/types/pagination";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../api/baseQueryWithReauth";

export type ActivityType = "conversation" | "order" | "faq";
export type ActivitySource = "Facebook" | "WhatsApp" | null;

export interface Activity {
  id: number;
  type: ActivityType;
  title: string;
  description: string;
  source: ActivitySource;
  time: string;
}



// http://127.0.0.1:8000/api/analytics/

export const activityApi = createApi({
  reducerPath: "activityApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Activities"],
  endpoints: (builder) => ({
    getActivities: builder.query<
      PaginatedResponse<Activity>,
      { page?: number }
    >({
      query: ({ page = 1 }) => `/analytics/activities/?page=${page}`,
      providesTags: ["Activities"],
    }),
  }),
});

export const { useGetActivitiesQuery } = activityApi;

// query: (queryParams) => {
//   if ("url" in queryParams) {
//     // Handle the case when a full URL is provided
//     return queryParams.url;
//   } else {
//     // Handle the case when search parameters are provided
//     const { q, page, pageSize } = queryParams;
//     return `/search/schools/?q=${q}&page=${page}&page_size=${pageSize}`;
//   }
