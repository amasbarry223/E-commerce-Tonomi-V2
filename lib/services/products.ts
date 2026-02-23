/**
 * Service produits.
 * À terme : appels API (getProducts, getProductById, etc.).
 * Pour l'instant : réexporte les données depuis lib/data pour centraliser l'accès.
 */

import { products } from "@/lib/data"
import type { Product } from "@/lib/types"

export function getProducts(): Product[] {
  return products
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.category === categoryId)
}
