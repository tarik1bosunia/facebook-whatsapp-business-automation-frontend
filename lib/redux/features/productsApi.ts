// lib/api/productsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../api/baseQueryWithReauth'
import { Product, ProductCategory } from '@/types/product'


const PRODUCT_API_URL = 'business/products/'
const CATEGORY_API_URL = 'business/categories/'

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Products', 'Categories'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => PRODUCT_API_URL,
      providesTags: ['Products']
    }),
    getProduct: builder.query<Product, number>({
      query: (id) => `${PRODUCT_API_URL}${id}/`,
      providesTags: (result, error, id) => [{ type: 'Products', id }]
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: PRODUCT_API_URL,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Products']
    }),
    updateProduct: builder.mutation<Product, Partial<Product>>({
      query: ({ id, ...patch }) => ({
        url: `${PRODUCT_API_URL}${id}/`,
        method: 'PATCH',
        body: patch
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Products', id }]
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `${PRODUCT_API_URL}${id}/`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Products']
    }),
    getCategories: builder.query<ProductCategory[], void>({
      query: () => CATEGORY_API_URL,
      providesTags: ['Categories']
    })
  })
})

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery
} = productsApi