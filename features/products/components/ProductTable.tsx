'use client';

import { Product, ProductCategory } from '@/types/product';
import { useState } from 'react';
import { ProductFormModal } from './ProductFormModal';
import { Trash2, Pencil } from 'lucide-react';
import {
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useGetProductsQuery,
} from '@/lib/redux/features/productsApi';
import { ConfirmDialog } from './ConfirmDialog';
import Link from 'next/link';
import { usePagination } from '@/lib/hooks/pagination';

export const ProductTable = () => {
  const {
    totalCount: totalProducts,
    results: products,
    isLoading: loadingProducts,
    isError,
    lastElementRef,
    refetch,
  } = usePagination<Product>({
    fetchFunction: useGetProductsQuery,
  });

  const { data: categories = [], isLoading: loadingCategories } = useGetCategoriesQuery();

  const [deleteProduct] = useDeleteProductMutation();
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [openProductModal, setOpenProductModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openEditProduct = (product?: Product) => {
    setSelectedProduct(product);
    setOpenProductModal(true);
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      try {
        await deleteProduct(deleteId).unwrap();
        refetch();
      } catch (error) {
        console.error('Delete failed', error);
      } finally {
        setDeleteId(null);
      }
    }
  };
  const onSuccess = () => {
    refetch()
  }

  if (loadingProducts || loadingCategories) return <div className="p-6">Loading...</div>;

  return (
    <>
      <div className="flex justify-end mb-6 gap-2">
        <Link
          href="/products/categories"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow transition"
        >
          Categories
        </Link>
        <button
          onClick={() => openEditProduct(undefined)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow transition"
        >
          + Create Product
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          {/* Table header */}
          <div className="grid grid-cols-5 bg-gray-100 px-6 py-3 font-medium text-gray-900">
            <div>Name</div>
            <div>Price</div>
            <div>Stock</div>
            <div>Category</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Table body */}
          <div className="divide-y divide-gray-200">
            {products.map((p, index) => (
              <div
                key={p.id}
                ref={index === products.length - 1 ? lastElementRef : null}
                className="grid grid-cols-5 hover:bg-gray-50 transition px-6 py-4"
              >
                <div className="font-medium text-gray-900">{p.name}</div>
                <div className="text-gray-700">${p.price}</div>
                <div className="text-gray-700">{p.stock}</div>
                <div className="text-gray-700">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {p.category_name || '—'}
                  </span>
                </div>
                <div className="text-right space-x-2">
                  <button
                    onClick={() => openEditProduct(p)}
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
                </div>
              </div>
            ))}
          </div>
        </div>

        <ConfirmDialog
          open={deleteId !== null}
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      </div>

      <ProductFormModal
        open={openProductModal}
        onClose={() => setOpenProductModal(false)}
        product={selectedProduct}
        categories={categories}
        onSuccess={onSuccess}
      />
    </>
  );
};
