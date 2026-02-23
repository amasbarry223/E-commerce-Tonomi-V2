/**
 * Pont pour l'envoi d'erreurs vers Sentry (optionnel).
 * Sans @sentry/nextjs installé : no-op.
 * Pour activer : npm install @sentry/nextjs --legacy-peer-deps, définir NEXT_PUBLIC_SENTRY_DSN,
 * puis remplacer l'implémentation par un import de @sentry/nextjs et Sentry.captureException().
 */

export interface CaptureExceptionExtra {
  context?: string
  componentStack?: string
  [key: string]: unknown
}

export function captureException(_error: Error | unknown, _extra?: CaptureExceptionExtra): void {
  if (process.env.NODE_ENV !== "production") return
  // Lorsque @sentry/nextjs est installé : Sentry.captureException(error, { extra })
}
