import {
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetFAQsWithCategoryQuery,
} from '@/lib/redux/services/knowledgeBaseApi';

/**
 * Reusable logic for accessing and managing FAQs & Categories
 */
export const useKnowledgeBase = (searchTerm: string = '') => {
  const {
    data: faqsWithCategories = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetFAQsWithCategoryQuery(searchTerm, { refetchOnMountOrArgChange: true });

  const [createFAQ, createFAQStatus] = useCreateFAQMutation();
  const [updateFAQ, updateFAQStatus] = useUpdateFAQMutation();
  const [deleteFAQ, deleteFAQStatus] = useDeleteFAQMutation();

  const [createCategory, createCategoryStatus] = useCreateCategoryMutation();
  const [updateCategory, updateCategoryStatus] = useUpdateCategoryMutation();
  const [deleteCategory, deleteCategoryStatus] = useDeleteCategoryMutation();

  

  return {
    // Data
    faqsWithCategories,
    isLoading,
    isError,
    error,

    // FAQ Mutations
    createFAQ,
    updateFAQ,
    deleteFAQ,

    // Category Mutations
    createCategory,
    updateCategory,
    deleteCategory,

    // Statuses (optional)
    createFAQStatus,
    updateFAQStatus,
    deleteFAQStatus,
    createCategoryStatus,
    updateCategoryStatus,
    deleteCategoryStatus,

    // Utilities
    refetch,
  };
};
