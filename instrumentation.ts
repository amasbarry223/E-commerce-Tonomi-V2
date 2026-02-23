/**
 * Instrumentation Next.js.
 * Pour Sentry : installer @sentry/nextjs --legacy-peer-deps, définir NEXT_PUBLIC_SENTRY_DSN,
 * puis importer et appeler les configs Sentry ici.
 */

export async function register() {
  // Optionnel : chargement Sentry server/edge quand le package est installé
}

export async function onRequestError(
  _err: unknown,
  _request: { method: string; path: string }
) {
  // Optionnel : Sentry.captureRequestError(err, request)
}
