// api/aimodelApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AIModel, AIModelCreateUpdate } from '@/types/aimodel';
import { baseQueryWithReauth } from '../../api/baseQueryWithReauth';

const AI_MODEL_URL = "chatbot/ai-models/"

export const aimodelApi = createApi({
  reducerPath: 'aimodelApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['AIModel'],
  endpoints: (builder) => ({
    getAIModels: builder.query<AIModel[], void>({
        query: () => ({
        url: AI_MODEL_URL,
        method: "GET",
      }),
      providesTags: (result) => 
        result 
          ? [...result.map(({ id }) => ({ type: 'AIModel' as const, id })), 'AIModel']
          : ['AIModel'],
    }),
    createAIModel: builder.mutation<AIModel, AIModelCreateUpdate>({
      query: (body) => ({
        url: AI_MODEL_URL,
        method: 'POST',
        body: { ...body, is_custom: body.is_custom || false },
      }),
      invalidatesTags: ['AIModel'],
    }),
    updateAIModel: builder.mutation<AIModel, { id: string; changes: Partial<AIModelCreateUpdate> }>({
      query: ({ id, changes }) => ({
        url: `${AI_MODEL_URL}${id}`,
        method: 'PUT',
        body: changes,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'AIModel', id: result?.id }],
    }),
    deleteAIModel: builder.mutation<void, string>({
      query: (id) => ({
        url: `${AI_MODEL_URL}${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'AIModel', id }],
    }),
  }),
});

export const {
  useGetAIModelsQuery,
  useCreateAIModelMutation,
  useUpdateAIModelMutation,
  useDeleteAIModelMutation,
} = aimodelApi;