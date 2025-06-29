export interface Product {
  id: number
  category: number
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