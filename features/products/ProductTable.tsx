'use client'

import { Product, ProductCategory } from '@/types/product'

import { useState } from 'react'
import { ProductFormModal } from './ProductFormModal'
import { Trash2, Pencil } from 'lucide-react'
import { useDeleteProductMutation } from '@/lib/redux/features/productsApi'
import { ConfirmDialog } from './ConfirmDialog'

interface Props {
    products: Product[]
    categories: ProductCategory[]
    refetch: () => void
}

export const ProductTable = ({ products, categories, refetch }: Props) => {
    const [deleteProduct] = useDeleteProductMutation()
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
    const [openModal, setOpenModal] = useState(false)

    const openEdit = (product?: Product) => {
        setSelectedProduct(product)
        setOpenModal(true)
    }

    // Track which product is pending deletion
    const [deleteId, setDeleteId] = useState<number | null>(null)

    // Called when user confirms deletion
    const handleDelete = async () => {
        if (deleteId !== null) {
            try {
                await deleteProduct(deleteId).unwrap()
                refetch()
            } catch (error) {
                console.error('Delete failed', error)
            } finally {
                setDeleteId(null)
            }
        }
    }



    return (
        <>
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => openEdit(undefined)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow transition"
                >
                    + Create Product
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3 text-left">Name</th>
                            <th className="px-6 py-3 text-left">Price</th>
                            <th className="px-6 py-3 text-left">Stock</th>
                            <th className="px-6 py-3 text-left">Category</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                                <td className="px-6 py-4 text-gray-700">${p.price}</td>
                                <td className="px-6 py-4 text-gray-700">{p.stock}</td>
                                <td className="px-6 py-4 text-gray-700">
                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                                        {categories.find((c) => c.id === p.category)?.name || '—'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => openEdit(p)}
                                        className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
                                    >
                                        <Pencil className="w-4 h-4 mr-1" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(p.id)}
                                        className="inline-flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm font-medium"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-6 text-gray-500">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {/* Confirmation Modal */}
                <ConfirmDialog
                    open={deleteId !== null}
                    onCancel={() => setDeleteId(null)}
                    onConfirm={handleDelete}
                />
            </div>

            <ProductFormModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                product={selectedProduct}
                categories={categories}
                onSuccess={refetch}
            />
        </>
    )
}
