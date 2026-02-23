/**
 * Service avis (reviews).
 * À terme : appels API. Pour l'instant : accès via lib/data.
 */

import { defaultReviews, reviews } from "@/lib/data"
import type { Review } from "@/lib/types"

export function getDefaultReviews(): Review[] {
  return defaultReviews
}

export function getReviews(): Review[] {
  return reviews
}

export function getReviewById(id: string): Review | undefined {
  return reviews.find(r => r.id === id)
}

export function getReviewsByProductId(productId: string): Review[] {
  return reviews.filter(r => r.productId === productId)
}
