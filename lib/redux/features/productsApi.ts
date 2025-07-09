// lib/api/productsApi.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../api/baseQueryWithReauth'
import { Product, ProductCategory } from '@/types/product'
import { PaginatedResponse } from '@/types/pagination'


const PRODUCT_API_URL = 'business/products/'
const CATEGORY_API_URL = 'business/categories/'

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Products', 'Categories'],
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedResponse<Product>, { page?: number }>({
      query: ({ page = 1 }) => `${PRODUCT_API_URL}?page=${page}`,
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
    }),
    createProductCategories: builder.mutation<ProductCategory, Partial<ProductCategory>>({
      query: (body) => ({
        url: CATEGORY_API_URL,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Categories']
    }),
    updateProductCategory: builder.mutation<ProductCategory, Partial<ProductCategory>>({
      query: ({ id, ...patch }) => ({
        url: `${CATEGORY_API_URL}${id}/`,
        method: 'PATCH',
        body: patch
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Products', id }]
    }),
    deleteProductCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `${CATEGORY_API_URL}${id}/`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Products', 'Categories']
    }),

  })
})


export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useCreateProductCategoriesMutation,
  useUpdateProductCategoryMutation,
  useDeleteProductCategoryMutation,
} = productsApi