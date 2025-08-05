'use client'

import { Product, ProductCategory } from '@/types/product'
import { useForm } from 'react-hook-form'

import { useEffect } from 'react'
import { useCreateProductMutation, useUpdateProductMutation } from '@/lib/redux/features/productsApi'

interface ProductFormProps {
    product?: Product
    categories: ProductCategory[]
    onSuccess?: () => void
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, categories, onSuccess }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Partial<Product>>({
        defaultValues: product ?? {},
    })

    const [createProduct] = useCreateProductMutation()
    const [updateProduct] = useUpdateProductMutation()

    useEffect(() => {
        reset(product ?? {})
    }, [product, reset])

    const onSubmit = async (values: Partial<Product>) => {
        try {
            if (product) {
                await updateProduct({ ...values, id: product.id }).unwrap()
            } else {
                await createProduct(values).unwrap()
            }
            onSuccess?.()
            reset()
        } catch (e) {
            console.error('Failed to submit product:', e)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-4 rounded shadow">
            <div>
                <label className="block mb-1">Name</label>
                <input {...register('name', { required: true })} className="input input-bordered w-full" />
                {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
            </div>
            <div>
                <label className="block mb-1">Description</label>
                <textarea {...register('description')} className="textarea textarea-bordered w-full" />
            </div>
            <div>
                <label className="block mb-1">Price</label>
                <input type="number" step="0.01" {...register('price')} className="input input-bordered w-full" />
            </div>
            <div>
                <label className="block mb-1">Stock</label>
                <input type="number" {...register('stock')} className="input input-bordered w-full" />
            </div>
            <div>
                <label className="block mb-1">Category</label>
                <select {...register('category', { required: true })} className="select select-bordered w-full">
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
            >
                {product ? 'Update' : 'Create'} Product
            </button>
        </form>
    )
}
