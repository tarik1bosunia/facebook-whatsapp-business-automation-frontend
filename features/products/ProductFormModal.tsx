'use client'

import { Dialog } from '@headlessui/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Product, ProductCategory } from '@/types/product'
import { useCreateProductMutation, useUpdateProductMutation } from '@/lib/redux/features/productsApi'

interface Props {
  open: boolean
  onClose: () => void
  categories: ProductCategory[]
  product?: Product
  onSuccess: () => void
}

export const ProductFormModal = ({
  open,
  onClose,
  categories,
  product,
  onSuccess
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Partial<Product>>()

  const [createProduct] = useCreateProductMutation()
  const [updateProduct] = useUpdateProductMutation()

useEffect(() => {
  if (open) {
    if (product) {
      reset(product)
    } else {
      reset({
        name: '',
        description: '',
        price: '',
        stock: 0,
        category: '' as unknown as number
      })
    }
  }
}, [open, product, reset])


  const onSubmit = async (values: Partial<Product>) => {
    try {
      if (product?.id) {
        await updateProduct({ ...values, id: product.id }).unwrap()
      } else {
        await createProduct(values).unwrap()
      }
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Form submit error:', err)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center px-4">
        <Dialog.Panel className="bg-white w-full max-w-xl rounded-xl shadow-xl p-6 space-y-6">
          <Dialog.Title className="text-xl font-semibold text-gray-800">
            {product ? 'Edit Product' : 'Create Product'}
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                {...register('name', { required: true })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">Product name is required.</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                {...register('description')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { required: true })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  {...register('stock', { required: true })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                {...register('category', { required: true })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
