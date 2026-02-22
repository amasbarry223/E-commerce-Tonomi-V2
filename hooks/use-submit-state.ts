"use client"

import { useState, useCallback } from "react"

/**
 * Hook pour gérer l'état de soumission (loading) d'un formulaire ou action async.
 * Évite la duplication du pattern setIsSubmitting(true) / try/finally setIsSubmitting(false).
 */
export function useSubmitState() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = useCallback(async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
    setIsSubmitting(true)
    try {
      return await fn()
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return { isSubmitting, submit }
}
