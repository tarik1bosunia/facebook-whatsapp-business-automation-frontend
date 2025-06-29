import { AIConfiguration } from "@/types/ai";
import { apiSlice } from "../../api/apiSlice";

const CHATBOT_CONFIG_URL = "/chatbot/ai-config/"

export const aiApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAIConfiguration: builder.query<AIConfiguration, void>({
      query: () => ({
        url: CHATBOT_CONFIG_URL,
        method: "GET",
      }),
    }),

    updateAIConfiguration: builder.mutation<AIConfiguration, Partial<AIConfiguration>>({
      query: (data) => ({
        url: CHATBOT_CONFIG_URL,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAIConfigurationQuery,
  useUpdateAIConfigurationMutation,
} = aiApi;
