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
    updateFacebookAutoReplyStatus: builder.mutation<void, { is_send_auto_reply: boolean }>({
      query: (data) => ({
        url: 'integrations/update-facebook-auto-reply-status/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FacebookIntegration'],
    }),
    updateFacebookNotificationStatus: builder.mutation<void, { is_send_notification: boolean }>({
      query: (data) => ({
        url: 'integrations/update-facebook-notification-status/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FacebookIntegration'],
    }),
    getFacebookIntegrationStatus: builder.query<
      {
        app_id_set: boolean;
        app_secret_set: boolean;
        long_live_token_set: boolean;
        verify_token_set: boolean;
        is_connected: boolean;
        is_send_auto_reply: boolean;
        is_send_notification: boolean;
      },
      void
    >({
      query: () => 'integrations/facebook-integration-status/',
      providesTags: ['FacebookIntegration'],
    }),

    updateFacebookConnectionStatus: builder.mutation<void, { is_connected: boolean }>({
      query: (data) => ({
        url: 'integrations/update-facebook-connection-status/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FacebookIntegration'],
    }),
  }),
});

export const { useSubmitFacebookAppConfigMutation, useSubmitFacebookAccessTokenMutation, useSubmitFacebookVerifyTokenMutation, useGetFacebookIntegrationStatusQuery, useUpdateFacebookAutoReplyStatusMutation, useUpdateFacebookNotificationStatusMutation, useUpdateFacebookConnectionStatusMutation } = facebookApi;