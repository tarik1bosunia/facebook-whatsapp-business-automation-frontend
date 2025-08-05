import { apiSlice } from './apiSlice';

export const facebookApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitFacebookAppConfig: builder.mutation<void, { app_id: string; app_secret: string }>({
      query: (data) => ({
        url: 'integrations/set-facebook-app-config/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FacebookIntegration'],
    }),
    submitFacebookAccessToken: builder.mutation<void, { access_token: string }>({
      query: (data) => ({
        url: 'integrations/set-facebook-access-token/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FacebookIntegration'],
    }),
    submitFacebookVerifyToken: builder.mutation<void, { verify_token: string }>({
      query: (data) => ({
        url: 'integrations/set-facebook-verify-token/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FacebookIntegration'],
    }),
  }),
});

export const { useSubmitFacebookAppConfigMutation, useSubmitFacebookAccessTokenMutation, useSubmitFacebookVerifyTokenMutation } = facebookApi;