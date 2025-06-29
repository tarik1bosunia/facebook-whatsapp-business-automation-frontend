'use client'

import { ProductTable } from "@/features/products/ProductTable"
import { useGetCategoriesQuery, useGetProductsQuery } from "@/lib/redux/features/productsApi"


export default function ProductsPage() {
  const {
    data: products = [],
    isLoading: loadingProducts,
    refetch,
  } = useGetProductsQuery()

  const { data: categories = [], isLoading: loadingCategories } = useGetCategoriesQuery()

  if (loadingProducts || loadingCategories) return <div className="p-6">Loading...</div>

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Product List</h1>
      <ProductTable products={products} categories={categories} refetch={refetch} />
    </main>
  )
}
