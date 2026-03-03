/**
 * Hook pour charger les logs depuis l'API
 */

import { useState, useEffect } from "react"
import type { Log } from "@prisma/client"

export function useLogs(options?: {
  skip?: number
  take?: number
  action?: string
  entityType?: string
  recent?: boolean
}) {
  const [logs, setLogs] = useState<Log[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadLogs() {
      try {
        setIsLoading(true)
        setError(null)
        const params = new URLSearchParams()
        if (options?.skip) params.append("skip", options.skip.toString())
        if (options?.take) params.append("take", options.take.toString())
        if (options?.action) params.append("action", options.action)
        if (options?.entityType) params.append("entityType", options.entityType)
        if (options?.recent) params.append("recent", "true")

        const url = `/api/logs?${params.toString()}`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error("Failed to fetch logs")
        }
        const data = await response.json()
        if (!cancelled) {
          setLogs(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to load logs"))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadLogs()

    return () => {
      cancelled = true
    }
  }, [options?.skip, options?.take, options?.action, options?.entityType, options?.recent])

  return { logs, isLoading, error }
}
