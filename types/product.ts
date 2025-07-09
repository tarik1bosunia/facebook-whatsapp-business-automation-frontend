export interface Product {
  id: number
  category: number
  category_name: string | null,
  name: string
  description: string
  price: string
  stock: number
  created_at: string
  updated_at: string
}

export interface ProductCategory {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
}