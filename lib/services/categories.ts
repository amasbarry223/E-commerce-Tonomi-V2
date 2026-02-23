/**
 * Service catégories.
 * À terme : appels API. Pour l'instant : accès via lib/data.
 */

import { categories } from "@/lib/data"
import type { Category } from "@/lib/types"

export function getCategories(): Category[] {
  return categories
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(c => c.id === id)
}
