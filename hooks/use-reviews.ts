/**
 * Hook pour charger les témoignages depuis l'API
 */

import { useState, useEffect } from "react"
import type { Review } from "@/lib/types"

export function useReviews(productId?: string) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadReviews() {
      try {
        setIsLoading(true)
        setError(null)
        const url = productId ? `/api/reviews?productId=${productId}` : "/api/reviews"
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error("Failed to fetch reviews")
        }
        const data = await response.json()
        if (!cancelled) {
          setReviews(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to load reviews"))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadReviews()

    return () => {
      cancelled = true
    }
  }, [productId])

  return { reviews, isLoading, error }
}
