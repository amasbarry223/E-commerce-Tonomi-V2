"use client"

import { ErrorBoundary } from "@/components/ui/error-boundary"
import { type ReactNode } from "react"
import { logger } from "@/lib/utils/logger"

interface ErrorBoundaryProviderProps {
  children: ReactNode
}

/**
 * Provider wrapper pour ErrorBoundary
 * Permet d'utiliser ErrorBoundary dans les Server Components
 */
export function ErrorBoundaryProvider({ children }: ErrorBoundaryProviderProps) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log l'erreur de manière centralisée
        logger.logError(error, "ErrorBoundaryProvider", {
          componentStack: errorInfo.componentStack,
        })
        // Ici vous pouvez envoyer l'erreur à un service de logging
        // Exemple: Sentry.captureException(error, { extra: errorInfo })
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

