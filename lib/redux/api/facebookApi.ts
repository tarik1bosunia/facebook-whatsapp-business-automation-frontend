import { apiSlice } from './apiSlice';

export const facebookApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitShortLivedToken: builder.mutation<void, { access_token: string }>({
      query: (data) => ({
        url: 'facebook-integration/facebook-auth/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FacebookIntegration'],
    }),
  }),
});

export const { useSubmitShortLivedTokenMutation } = facebookApi;