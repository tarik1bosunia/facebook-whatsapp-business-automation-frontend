import { apiSlice } from '../api/apiSlice';
import { BusinessProfile, BusinessHour } from '@/types/business';

export const businessApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBusinessProfile: builder.query<BusinessProfile, void>({
      query: () => 'business/business-profile/',
      providesTags: ['BusinessProfile'],
    }),
    updateBusinessProfile: builder.mutation<BusinessProfile, Partial<BusinessProfile>>({
      query: (body) => ({
        url: `business/business-profile/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['BusinessProfile'],
    }),
    getBusinessHours: builder.query<BusinessHour[], void>({
      query: () => 'business/business-hours/',
      providesTags: ['BusinessHours'],
    }),
    updateBusinessHours: builder.mutation<BusinessHour[], Partial<BusinessHour>[]>({
      query: (body) => ({
        url: 'business/business-hours/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['BusinessHours'],
    }),
  }),
});

export const {
  useGetBusinessProfileQuery,
  useUpdateBusinessProfileMutation,
  useGetBusinessHoursQuery,
  useUpdateBusinessHoursMutation,
} = businessApi;
