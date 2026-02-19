/**
 * Utilitaire de logging centralisé
 * Permet de gérer les logs de manière cohérente et de les désactiver en production
 */

/* eslint-disable no-console */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogOptions {
  level?: LogLevel
  context?: string
  error?: Error | unknown
  metadata?: Record<string, unknown>
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatMessage(level: LogLevel, message: string, options?: LogOptions): string {
    const context = options?.context ? `[${options.context}]` : ''
    return `${context} ${message}`
  }

  private log(level: LogLevel, message: string, options?: LogOptions): void {
    // En production, on ne log que les erreurs
    if (!this.isDevelopment && level !== 'error') {
      return
    }

    const formattedMessage = this.formatMessage(level, message, options)
    const logData: unknown[] = [formattedMessage]

    if (options?.error) {
      logData.push(options.error)
    }

    if (options?.metadata && Object.keys(options.metadata).length > 0) {
      logData.push(options.metadata)
    }

    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(...logData)
        }
        break
      case 'info':
        console.info(...logData)
        break
      case 'warn':
        console.warn(...logData)
        break
      case 'error':
        console.error(...logData)
        // Ici vous pouvez envoyer l'erreur à un service de logging (Sentry, LogRocket, etc.)
        // Example: this.sendToErrorService(level, message, options)
        break
    }
  }

  debug(message: string, options?: LogOptions): void {
    this.log('debug', message, options)
  }

  info(message: string, options?: LogOptions): void {
    this.log('info', message, options)
  }

  warn(message: string, options?: LogOptions): void {
    this.log('warn', message, options)
  }

  error(message: string, options?: LogOptions): void {
    this.log('error', message, options)
  }

  // Méthode pour logger les erreurs de manière standardisée
  logError(error: Error | unknown, context?: string, metadata?: Record<string, unknown>): void {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    this.error(errorMessage, {
      level: 'error',
      context,
      error,
      metadata,
    })
  }
}

// Export d'une instance singleton
export const logger = new Logger()

// Export du type pour utilisation dans d'autres fichiers
export type { LogLevel, LogOptions }

