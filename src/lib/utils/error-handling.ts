/**
 * Utilitaires pour la gestion d'erreurs standardisée
 * Pattern: ErrorBoundary + Logger pour toutes les erreurs
 */

import { logger } from "@/lib/utils/logger"

/**
 * Classe d'erreur personnalisée pour l'application
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode: number = 500,
    public metadata?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
    // Maintient la stack trace correcte
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }
}

/**
 * Type pour les options de gestion d'erreurs
 */
export interface ErrorHandlerOptions {
  context?: string
  metadata?: Record<string, unknown>
  showToast?: boolean
  toastMessage?: string
  onError?: (error: Error) => void
}

/**
 * Gère une erreur de manière standardisée
 * - Log l'erreur avec le logger centralisé
 * - Retourne un message utilisateur-friendly
 * - Optionnellement affiche un toast
 * 
 * @param error - L'erreur à gérer
 * @param options - Options de gestion d'erreur
 * @returns Message d'erreur formaté pour l'utilisateur
 * 
 * @example
 * ```ts
 * try {
 *   await someAsyncOperation()
 * } catch (error) {
 *   const message = handleError(error, { 
 *     context: 'ProductPage',
 *     showToast: true 
 *   })
 * }
 * ```
 */
export function handleError(
  error: unknown,
  options: ErrorHandlerOptions = {}
): { message: string; code?: string } {
  const { context, metadata, showToast, toastMessage, onError } = options

  // Convertir l'erreur en Error si nécessaire
  let errorInstance: Error
  if (error instanceof AppError) {
    errorInstance = error
  } else if (error instanceof Error) {
    errorInstance = error
  } else {
    errorInstance = new Error(String(error))
  }

  // Logger l'erreur de manière centralisée
  logger.logError(errorInstance, context || "handleError", {
    ...metadata,
    ...(errorInstance instanceof AppError ? errorInstance.metadata : {}),
  })

  // Appeler le callback personnalisé si fourni
  if (onError) {
    onError(errorInstance)
  }

  // Extraire le message utilisateur
  let userMessage: string
  let errorCode: string | undefined

  if (errorInstance instanceof AppError) {
    userMessage = toastMessage || errorInstance.message
    errorCode = errorInstance.code
  } else if (errorInstance instanceof Error) {
    userMessage = toastMessage || errorInstance.message || "Une erreur inattendue s'est produite"
  } else {
    userMessage = toastMessage || "Une erreur inattendue s'est produite"
  }

  // Afficher un toast si demandé (nécessite l'import de toast dans le composant)
  if (showToast && typeof window !== 'undefined') {
    // Le toast sera géré par le composant qui appelle handleError
    // pour éviter les dépendances circulaires
  }

  return { message: userMessage, code: errorCode }
}

/**
 * Wrapper pour les fonctions async qui gère automatiquement les erreurs
 * 
 * @param fn - Fonction async à exécuter
 * @param options - Options de gestion d'erreur
 * @returns Résultat de la fonction ou null en cas d'erreur
 * 
 * @example
 * ```ts
 * const result = await safeAsync(
 *   () => fetchProduct(id),
 *   { context: 'ProductPage', showToast: true }
 * )
 * ```
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  options: ErrorHandlerOptions = {}
): Promise<T | null> {
  try {
    return await fn()
  } catch (error) {
    handleError(error, options)
    return null
  }
}

/**
 * Wrapper pour les fonctions sync qui gère automatiquement les erreurs
 * 
 * @param fn - Fonction à exécuter
 * @param options - Options de gestion d'erreur
 * @returns Résultat de la fonction ou null en cas d'erreur
 */
export function safeSync<T>(
  fn: () => T,
  options: ErrorHandlerOptions = {}
): T | null {
  try {
    return fn()
  } catch (error) {
    handleError(error, options)
    return null
  }
}

