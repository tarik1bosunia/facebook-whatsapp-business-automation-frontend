import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../api/baseQueryWithReauth'


export interface BusinessHour {
  id: number
  day: string
  open_time: string | null
  close_time: string | null
  is_closed: boolean
}

export interface BusinessProfile {
  id: number
  name: string
  email: string
  phone: string
  website?: string
  description?: string
  hours?: BusinessHour[]
}

export interface CreateBusinessHourInput {
  day: string
  open_time: string | null
  close_time: string | null
  is_closed: boolean
}

export interface UpdateBusinessHourInput extends CreateBusinessHourInput {
  id: number
}

export interface UpdateBusinessProfileInput {
  name: string
  email: string
  phone: string
  website?: string
  description?: string
}

// ---------- API Setup ----------

export const businessApi = createApi({
  reducerPath: 'businessApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['BusinessProfile', 'BusinessHours'],
  endpoints: (builder) => ({
    // Business Profile (singleton)
    getBusinessProfile: builder.query<BusinessProfile, void>({
      query: () => 'business/business-profile/',
      providesTags: ['BusinessProfile'],
    }),

    updateBusinessProfile: builder.mutation<BusinessProfile, UpdateBusinessProfileInput>({
      query: (data) => ({
        url: 'business/business-profile/',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['BusinessProfile'],
    }),

    // Business Hours
    getBusinessHours: builder.query<BusinessHour[], void>({
      query: () => 'business/business-hours/',
      providesTags: ['BusinessHours'],
    }),
    createBusinessHour: builder.mutation<BusinessHour, CreateBusinessHourInput>({
      query: (data) => ({
        url: 'business/business-hours/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['BusinessHours'],
    }),
    updateBusinessHour: builder.mutation<BusinessHour, UpdateBusinessHourInput>({
      query: ({ id, ...data }) => ({
        url: `business/business-hours/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['BusinessHours'],
    }),
  }),
})

export const {
  useGetBusinessProfileQuery,
  useUpdateBusinessProfileMutation,
  useGetBusinessHoursQuery,
  useCreateBusinessHourMutation,
  useUpdateBusinessHourMutation,
} = businessApi
