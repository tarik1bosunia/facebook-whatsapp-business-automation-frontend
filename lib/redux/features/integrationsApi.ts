// services/integrationsApi.ts
import { ApiResponse } from "@/types/apiResponse";
import { apiSlice } from "../api/apiSlice";

const FACEBOOK_INTIGRATIONS_URL = "business/facebook-integration/";
const WHATSAPP_INTIGRATIONS_URL = "business/whatsapp-integration/";

export interface IntegrationConfig {
  is_connected: boolean;
  is_send_auto_reply: boolean;
  is_send_notification: boolean;

  platform_id?: string;
  access_token?: string;
  verify_token?: string;
}




export const integrationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFacebookIntegration: builder.query<ApiResponse<IntegrationConfig>, void>({
      query: () => FACEBOOK_INTIGRATIONS_URL,
      providesTags: ['FacebookIntegration'],
      // Changed: Added transformErrorResponse to standardize error format
      transformErrorResponse: (response) => {
        return {
          errors: {
            general: [typeof response === 'string' ? response : 'Failed to fetch Facebook integration']
          }
        };
      }
    }),
    updateFacebookIntegration: builder.mutation<ApiResponse<IntegrationConfig>, Partial<IntegrationConfig>>({
      query: (data) => ({
        url: FACEBOOK_INTIGRATIONS_URL,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ['FacebookIntegration'],
    }),

    getWhatsAppIntegration: builder.query<ApiResponse<IntegrationConfig>, void>({
      query: () => WHATSAPP_INTIGRATIONS_URL,
      providesTags: ['WhatsAppIntegration'],
      transformErrorResponse: (response) => {
        return {
          errors: {
            general: [typeof response === 'string' ? response : 'Failed to fetch WhatsApp integration']
          }
        };
      }
    }),
    updateWhatsAppIntegration: builder.mutation<ApiResponse<IntegrationConfig>, Partial<IntegrationConfig>>({
      query: (data) => ({
        url: WHATSAPP_INTIGRATIONS_URL,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ['WhatsAppIntegration'],
      transformErrorResponse: (response) => {
        if (typeof response === 'object' && response !== null) {
          return response;
        }
        return {
          errors: {
            general: [typeof response === 'string' ? response : 'Failed to update WhatsApp integration']
          }
        };
      }
    }),
  }),
});

export const {
  useGetFacebookIntegrationQuery,
  useUpdateFacebookIntegrationMutation,
  useGetWhatsAppIntegrationQuery,
  useUpdateWhatsAppIntegrationMutation,
} = integrationsApi;