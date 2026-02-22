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
 */
export function handleError(
  error: unknown,
  options: ErrorHandlerOptions = {}
): { message: string; code?: string } {
  const { context, metadata, toastMessage, onError } = options

  let errorInstance: Error
  if (error instanceof AppError) {
    errorInstance = error
  } else if (error instanceof Error) {
    errorInstance = error
  } else {
    errorInstance = new Error(String(error))
  }

  logger.logError(errorInstance, context || "handleError", {
    ...metadata,
    ...(errorInstance instanceof AppError ? errorInstance.metadata : {}),
  })

  if (onError) {
    onError(errorInstance)
  }

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

  return { message: userMessage, code: errorCode }
}

/**
 * Wrapper pour les fonctions async qui gère automatiquement les erreurs
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
