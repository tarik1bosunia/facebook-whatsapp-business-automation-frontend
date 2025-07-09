'use client'

import { Dialog } from '@headlessui/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ProductCategory } from '@/types/product'
import { useCreateProductCategoriesMutation, useUpdateProductCategoryMutation } from '@/lib/redux/features/productsApi'

interface Props {
  open: boolean
  onClose: () => void
  category?: ProductCategory
  onSuccess: () => void
}

export const ProductCategoryFormModal = ({
  open,
  onClose,
  category,
  onSuccess,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<ProductCategory>>()

  const [createCategory] = useCreateProductCategoriesMutation()
  const [updateCategory] = useUpdateProductCategoryMutation()

  useEffect(() => {
    if (open) {
      if (category) {
        reset(category)
      } else {
        reset({ name: '', description: '' })
      }
    }
  }, [open, category, reset])

  const onSubmit = async (values: Partial<ProductCategory>) => {
    try {
      if (category?.id) {
        await updateCategory({ id: category.id, ...values }).unwrap()
      } else {
        await createCategory(values).unwrap()
      }
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Failed to save category:', err)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center px-4">
        <Dialog.Panel className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 space-y-6">
          <Dialog.Title className="text-xl font-semibold text-gray-800">
            {category ? 'Edit Category' : 'Add Category'}
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input
                {...register('name', { required: true })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">Category name is required.</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                {...register('description')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
              />
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

