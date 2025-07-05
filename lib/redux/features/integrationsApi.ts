// services/integrationsApi.ts

import { apiSlice } from "../api/apiSlice";

const FACEBOOK_INTIGRATIONS_URL = "business/facebook/"
const WHATSAPP_INTIGRATIONS_URL = "business/whatsapp/"


export interface IntegrationConfig {
  is_connected: boolean;
  is_send_auto_reply: boolean;
  is_send_notification: boolean;
  access_token?: string;
}

export const integrationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFacebookIntegration: builder.query<IntegrationConfig, void>({
      query: () => FACEBOOK_INTIGRATIONS_URL,
    }),
    updateFacebookIntegration: builder.mutation<IntegrationConfig, Partial<IntegrationConfig>>({
      query: (data) => ({
        url: FACEBOOK_INTIGRATIONS_URL,
        method: "PATCH",
        body: data,
      }),
    }),

    getWhatsAppIntegration: builder.query<IntegrationConfig, void>({
      query: () => WHATSAPP_INTIGRATIONS_URL,
    }),
    updateWhatsAppIntegration: builder.mutation<IntegrationConfig, Partial<IntegrationConfig>>({
      query: (data) => ({
        url: WHATSAPP_INTIGRATIONS_URL,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetFacebookIntegrationQuery,
  useUpdateFacebookIntegrationMutation,
  useGetWhatsAppIntegrationQuery,
  useUpdateWhatsAppIntegrationMutation,
} = integrationsApi;
