"use client"

import { useState, useEffect, useRef } from "react"

/**
 * Hook qui retourne une version debounced d'une valeur.
 * Utile pour limiter les recalculs coûteux (ex. filtre de recherche) pendant la saisie.
 * Le timer est nettoyé au démontage pour éviter les fuites mémoire.
 *
 * @param value - Valeur à debouncer
 * @param delay - Délai en ms avant de mettre à jour la valeur debounced
 * @returns La valeur debounced
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value)
      timeoutRef.current = null
    }, delay)

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [value, delay])

  return debouncedValue
}
