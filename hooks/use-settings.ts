/**
 * Hook pour charger les paramètres depuis l'API
 */

import { useState, useEffect } from "react"

export interface SettingsMap {
  [key: string]: string | number | boolean | object
}

export function useSettings() {
  const [settings, setSettings] = useState<SettingsMap>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadSettings() {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("/api/settings")
        if (!response.ok) {
          throw new Error("Failed to fetch settings")
        }
        const data = await response.json()
        if (!cancelled) {
          setSettings(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to load settings"))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadSettings()

    return () => {
      cancelled = true
    }
  }, [])

  return { settings, isLoading, error }
}
