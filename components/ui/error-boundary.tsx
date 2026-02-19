"use client"

import React, { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, Home } from "lucide-react"
import { useStore } from "@/lib/store-context"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * ErrorBoundary pour capturer les erreurs React et afficher une UI de fallback
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log l'erreur de manière centralisée
    // Note: On ne peut pas utiliser le logger ici car c'est une classe
    // Le logger sera utilisé dans le callback onError si fourni
    if (process.env.NODE_ENV === 'development') {
      console.error("ErrorBoundary caught an error:", error, errorInfo)
    }
    
    // Appelle le callback personnalisé si fourni
    this.props.onError?.(error, errorInfo)
    
    // Ici vous pouvez envoyer l'erreur à un service de logging (Sentry, LogRocket, etc.)
    // Example: logErrorToService(error, errorInfo)

    this.setState({
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Si un fallback personnalisé est fourni, l'utiliser
      if (this.props.fallback) {
        return this.props.fallback
      }

      // UI de fallback par défaut
      return (
        <ErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
        />
      )
    }

    return this.props.children
  }
}

/**
 * Composant de fallback pour afficher les erreurs
 */
function ErrorFallback({ 
  error, 
  onReset 
}: { 
  error: Error | null
  onReset: () => void 
}) {
  const { navigate } = useStore()

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[400px] gap-6 p-8"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertCircle className="h-12 w-12 text-destructive" aria-hidden="true" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Une erreur s'est produite</h2>
          <p className="text-muted-foreground">
            {error?.message || "Une erreur inattendue s'est produite. Veuillez réessayer."}
          </p>
        </div>

        {process.env.NODE_ENV === "development" && error && (
          <details className="mt-4 w-full text-left">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
              Détails techniques (dev only)
            </summary>
            <pre className="mt-2 p-4 bg-muted rounded-md text-xs overflow-auto max-h-64">
              {error.stack}
            </pre>
          </details>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onReset}
          variant="outline"
          className="gap-2"
          aria-label="Réessayer"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Réessayer
        </Button>
        <Button
          onClick={() => {
            onReset()
            navigate("home")
          }}
          className="gap-2"
          aria-label="Retour à l'accueil"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Retour à l'accueil
        </Button>
      </div>
    </div>
  )
}

/**
 * Hook pour utiliser ErrorBoundary de manière fonctionnelle
 * Utile pour les composants fonctionnels qui veulent gérer les erreurs
 */
export function useErrorHandler() {
  const handleError = React.useCallback((error: Error, errorInfo?: React.ErrorInfo) => {
    console.error("Error caught by useErrorHandler:", error, errorInfo)
    // Ici vous pouvez envoyer l'erreur à un service de logging
  }, [])

  return { handleError }
}

