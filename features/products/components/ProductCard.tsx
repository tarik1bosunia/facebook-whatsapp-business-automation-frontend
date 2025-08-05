// components/ProductCard.tsx
import { Product } from '@/types/product'
import Link from 'next/link'

interface ProductCardProps {
  product: Product
  onDelete: (id: number) => void
}

const ProductCard = ({ product, onDelete }: ProductCardProps) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{product.name}</h2>
        <p>{product.description}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-semibold">${product.price}</span>
          <span className="badge badge-info">{product.stock} in stock</span>
        </div>
        <div className="card-actions justify-end mt-4">
          <Link href={`/products/${product.id}/edit`} className="btn btn-sm btn-outline">
            Edit
          </Link>
          <button 
            onClick={() => onDelete(product.id)} 
            className="btn btn-sm btn-error"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard