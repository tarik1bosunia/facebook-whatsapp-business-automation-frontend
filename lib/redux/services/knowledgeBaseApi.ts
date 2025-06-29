import { apiSlice } from "../api/apiSlice";
import { Category, FAQ, FAQsWithCategory } from "@/types/knowledgeBase";

const FAQ_BASE_URL = "knowledge-base/faqs/";
const CATEGORY_BASE_URL = "knowledge-base/categories/";
const FAQ_WITH_CATEGORY_URL = "knowledge-base/faqs-with-categories/";

export const knowledgeBaseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFAQsWithCategory: builder.query<FAQsWithCategory[], string | void>({
      query: (search = "") => ({
        url: FAQ_WITH_CATEGORY_URL,
        params: { search },
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Category", id: "LIST" },
              ...result.map((cat) => ({
                type: "Category" as const,
                id: cat.id,
              })),
              ...result.flatMap((cat) =>
                cat.faqs.map((faq) => ({ type: "FAQ" as const, id: faq.id }))
              ),
              { type: "FAQ", id: "LIST" },
            ]
          : [
              { type: "FAQ", id: "LIST" },
              { type: "Category", id: "LIST" },
            ],
    }),

    createFAQ: builder.mutation<FAQ, Omit<FAQ, "id">>({
      query: (faq) => ({
        url: FAQ_BASE_URL,
        method: "POST",
        body: faq,
      }),
      invalidatesTags: [{ type: "FAQ", id: "LIST" }],
    }),

    updateFAQ: builder.mutation<FAQ, FAQ>({
      query: ({ id, ...rest }) => ({
        url: `${FAQ_BASE_URL}${id}/`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "FAQ", id }],
    }),

    deleteFAQ: builder.mutation<void, string>({
      query: (id) => ({
        url: `${FAQ_BASE_URL}${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "FAQ", id }],
    }),

    createCategory: builder.mutation<Category, { name: string }>({
      query: (category) => ({
        url: CATEGORY_BASE_URL,
        method: "POST",
        body: category,
      }),
      invalidatesTags: [
        { type: "Category", id: "LIST" },
        { type: "FAQ", id: "LIST" },
      ],
    }),

    updateCategory: builder.mutation<Category, { id: string; name: string }>({
      query: ({ id, ...rest }) => ({
        url: `${CATEGORY_BASE_URL}${id}/`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),

    deleteCategory: builder.mutation<
      void,
      { id: string; deleteFAQs?: boolean }
    >({
      query: ({ id, deleteFAQs }) => ({
        url: `${CATEGORY_BASE_URL}${id}/`,
        method: "DELETE",
        params: { delete_faqs: deleteFAQs },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
        { type: "FAQ", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetFAQsWithCategoryQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = knowledgeBaseApi;
