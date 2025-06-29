// hooks/useProducts.ts
import { useDeleteProductMutation, useGetProductsQuery } from "../redux/features/productsApi"

export const useProducts = () => {
  const { data: products, isLoading, error } = useGetProductsQuery()
  const [deleteProduct] = useDeleteProductMutation()

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id).unwrap()
    } catch (err) {
      console.error('Failed to delete product:', err)
    }
  }

  return {
    products,
    isLoading,
    error,
    handleDelete
  }
}