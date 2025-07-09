

import { ProductTable } from "@/features/products/ProductTable"


export default function ProductsPage() {

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Product List</h1>
      <ProductTable />
    </main>
  )
}
