/**
 * Hook personnalisé pour les produits
 */
import { useMemo } from 'react'
import type { Product } from '../types'
import { products as allProducts } from '@/lib/data'

interface ProductFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  featured?: boolean
  badge?: string
  status?: string
}

export function useProducts(filters?: ProductFilters) {
  const filtered = useMemo(() => {
    let result = [...allProducts]
    
    if (filters?.category) {
      result = result.filter((p) => p.category === filters.category)
    }
    
    if (filters?.search) {
      const query = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query)) ||
          p.brand.toLowerCase().includes(query)
      )
    }
    
    if (filters?.minPrice !== undefined) {
      result = result.filter((p) => p.price >= filters.minPrice!)
    }
    
    if (filters?.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= filters.maxPrice!)
    }
    
    if (filters?.featured !== undefined) {
      result = result.filter((p) => p.featured === filters.featured)
    }
    
    if (filters?.badge) {
      result = result.filter((p) => p.badge === filters.badge)
    }
    
    if (filters?.status) {
      result = result.filter((p) => p.status === filters.status)
    }
    
    return result
  }, [filters])
  
  const getProduct = (id: string): Product | undefined => {
    return allProducts.find((p) => p.id === id)
  }
  
  return {
    products: filtered,
    allProducts,
    getProduct,
  }
}

