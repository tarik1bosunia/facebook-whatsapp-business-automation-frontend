'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { ProductCategory } from "@/types/product";
import { useDeleteProductCategoryMutation } from "@/lib/redux/features/productsApi";
import { ProductCategoryFormModal } from "./ProductCategoryFormModal";

import Link from "next/link";
import { ConfirmDialog } from "../components/ConfirmDialog";

interface ProductCategoryTableProps {
    categories: ProductCategory[];
    refetch: () => void;
}

export default function ProductCategoryTable({
    categories,
    refetch
}: ProductCategoryTableProps) {
    const [deleteProductCategory] = useDeleteProductCategoryMutation()
    const [selectedProductCategory, setSelectedProductCategory] = useState<ProductCategory | undefined>()
    const [openCategoryModal, setOpenCategoryModal] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)

    const openEditProductCategory = (category?: ProductCategory) => {
        setSelectedProductCategory(category)
        setOpenCategoryModal(true)
    }

    const handleConfirmDelete = async () => {
        if (deleteId !== null) {
            try {
                await deleteProductCategory(deleteId).unwrap()
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
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-semibold">Categories</h2>
                        <p className="text-muted-foreground">
                            Manage your product categories
                        </p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Link
                            href={"/products"}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow transition"
                        >
                            products
                        </Link>
                        <Button onClick={() => openEditProductCategory(undefined)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Category
                        </Button>
                    </div>
                </div>

                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-[100px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                        No categories found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">
                                            <Badge variant="outline" className="capitalize">
                                                {category.name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {category.description}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEditProductCategory(category)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setDeleteId(category.id)}
                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {categories.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                        Showing {categories.length} categories
                    </div>
                )}
            </div>

            {/* Product Category Form Modal */}
            <ProductCategoryFormModal
                open={openCategoryModal}
                onClose={() => setOpenCategoryModal(false)}
                category={selectedProductCategory}
                onSuccess={refetch}
            />

            {/* Confirm Dialog for Delete */}
            <ConfirmDialog
                open={deleteId !== null}
                onCancel={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Product Category"
                message="Are you sure you want to delete this category? This action cannot be undone."
            />
        </>
    );
}
