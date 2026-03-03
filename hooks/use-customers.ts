/**
 * Hook pour charger les clients depuis l'API
 */

import { useState, useEffect } from "react"
import type { Customer } from "@/lib/types"

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadCustomers() {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("/api/customers")
        if (!response.ok) {
          throw new Error("Failed to fetch customers")
        }
        const data = await response.json()
        if (!cancelled) {
          setCustomers(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to load customers"))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadCustomers()

    return () => {
      cancelled = true
    }
  }, [])

  return { customers, isLoading, error }
}
