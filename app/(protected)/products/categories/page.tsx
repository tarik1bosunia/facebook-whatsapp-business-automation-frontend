'use client'

import ProductCategoryTable from "@/features/products/categories/ProductCategoryTable"
import { useGetCategoriesQuery } from "@/lib/redux/features/productsApi"


export default function ProductsCategoryPage() {


  const { data: categories = [], isLoading: loadingCategories, refetch } = useGetCategoriesQuery()

  if (loadingCategories) return <div className="p-6">Loading...</div>

  return (
    <main className="max-w-6xl mx-auto p-6">
      {/* <h1 className="text-3xl font-bold mb-6 text-gray-800">Product Category List</h1> */}
      <ProductCategoryTable categories={categories} refetch={refetch} />
    </main>
  )
}
