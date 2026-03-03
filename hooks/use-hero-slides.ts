/**
 * Hook pour charger les hero slides depuis l'API
 */

import { useState, useEffect } from "react"
import type { HeroSlide } from "@/lib/types"

export function useHeroSlides() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadSlides() {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("/api/hero-slides")
        if (!response.ok) {
          throw new Error("Failed to fetch hero slides")
        }
        const data = await response.json()
        if (!cancelled) {
          setSlides(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to load hero slides"))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadSlides()

    return () => {
      cancelled = true
    }
  }, [])

  return { slides, isLoading, error }
}
