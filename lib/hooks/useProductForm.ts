// hooks/useProductForm.ts

import { Product } from "@/types/product"
import { useCreateProductMutation, useGetCategoriesQuery, useUpdateProductMutation } from "../redux/features/productsApi"


export const useProductForm = (product?: Product) => {
  const { data: categories, isLoading: isLoadingCategories } = useGetCategoriesQuery()
  const [createProduct] = useCreateProductMutation()
  const [updateProduct] = useUpdateProductMutation()

  const handleSubmit = async (values: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (product) {
        await updateProduct({ id: product.id, ...values }).unwrap()
      } else {
        await createProduct(values).unwrap()
      }
      return true
    } catch (err) {
      console.error('Failed to save product:', err)
      return false
    }
  }

  return {
    categories,
    isLoadingCategories,
    handleSubmit
  }
}