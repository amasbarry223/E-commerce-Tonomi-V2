/**
 * Hook pour charger les produits depuis l'API
 * Utilisé dans les composants client-side
 */

import { useState, useEffect } from "react"
import type { Product } from "@/lib/types"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("/api/products")
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await response.json()
        if (!cancelled) {
          setProducts(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to load products"))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      cancelled = true
    }
  }, [])

  return { products, isLoading, error }
}

export function useProductsWithFilters(filters: {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  colors?: string[]
  sizes?: string[]
  search?: string
  featured?: boolean
  skip?: number
  take?: number
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      try {
        setIsLoading(true)
        setError(null)
        const params = new URLSearchParams({ action: "filters" })
        if (filters.categoryId) params.append("categoryId", filters.categoryId)
        if (filters.minPrice !== undefined) params.append("minPrice", filters.minPrice.toString())
        if (filters.maxPrice !== undefined) params.append("maxPrice", filters.maxPrice.toString())
        if (filters.featured !== undefined) params.append("featured", filters.featured.toString())
        if (filters.search) params.append("search", filters.search)

        const response = await fetch(`/api/products?${params.toString()}`)
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await response.json()
        if (!cancelled) {
          setProducts(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to load products"))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadProducts()
  }, [filters.categoryId, filters.minPrice, filters.maxPrice, filters.search, filters.featured])

  return { products, isLoading, error }
}

export function useFeaturedProducts(limit: number = 10) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`/api/products?action=featured&limit=${limit}`)
        if (!response.ok) {
          throw new Error("Failed to fetch featured products")
        }
        const data = await response.json()
        if (!cancelled) {
          setProducts(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to load featured products"))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      cancelled = true
    }
  }, [limit])

  return { products, isLoading, error }
}

export function useProductSearch(query: string, limit: number = 20) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!query.trim()) {
      setProducts([])
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function search() {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`/api/products?action=search&query=${encodeURIComponent(query)}&limit=${limit}`)
        if (!response.ok) {
          throw new Error("Failed to search products")
        }
        const data = await response.json()
        if (!cancelled) {
          setProducts(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to search products"))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    const timeoutId = setTimeout(search, 300) // Debounce

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [query, limit])

  return { products, isLoading, error }
}
