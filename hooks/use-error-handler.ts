"use client"

/**
 * Hook pour gérer les erreurs de manière standardisée dans les composants
 * Utilise le pattern ErrorBoundary + Logger
 */

import { useCallback } from "react"
import { toast } from "sonner"
import { handleError, type ErrorHandlerOptions } from "@/src/lib/utils/error-handling"

/**
 * Hook pour gérer les erreurs dans les composants React
 * 
 * @param options - Options par défaut pour la gestion d'erreurs
 * @returns Fonction handleError et fonction safeAsync
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { handleError: handle, safeAsync } = useErrorHandler({ 
 *     context: 'MyComponent' 
 *   })
 *   
 *   const fetchData = async () => {
 *     const result = await safeAsync(
 *       () => api.fetchData(),
 *       { showToast: true }
 *     )
 *     if (result) {
 *       // Utiliser result
 *     }
 *   }
 * }
 * ```
 */
export function useErrorHandler(defaultOptions: ErrorHandlerOptions = {}) {
  const handleErrorWithToast = useCallback(
    (error: unknown, options: ErrorHandlerOptions = {}) => {
      const mergedOptions = { ...defaultOptions, ...options }
      const { message } = handleError(error, mergedOptions)

      // Afficher un toast si demandé
      if (mergedOptions.showToast !== false) {
        toast.error(mergedOptions.toastMessage || message)
      }

      return { message }
    },
    [defaultOptions]
  )

  const safeAsync = useCallback(
    async <T>(
      fn: () => Promise<T>,
      options: ErrorHandlerOptions = {}
    ): Promise<T | null> => {
      try {
        return await fn()
      } catch (error) {
        handleErrorWithToast(error, options)
        return null
      }
    },
    [handleErrorWithToast]
  )

  const safeSync = useCallback(
    <T>(fn: () => T, options: ErrorHandlerOptions = {}): T | null => {
      try {
        return fn()
      } catch (error) {
        handleErrorWithToast(error, options)
        return null
      }
    },
    [handleErrorWithToast]
  )

  return {
    handleError: handleErrorWithToast,
    safeAsync,
    safeSync,
  }
}

