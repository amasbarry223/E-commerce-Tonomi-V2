"use client"

import { ErrorBoundary } from "@/components/ui/error-boundary"
import { type ReactNode } from "react"
import { logger } from "@/lib/utils/logger"
import { captureException } from "@/lib/utils/sentry"

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
        logger.logError(error, "ErrorBoundaryProvider", {
          componentStack: errorInfo.componentStack,
        })
        captureException(error, {
          context: "ErrorBoundaryProvider",
          componentStack: errorInfo.componentStack ?? undefined,
        })
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

