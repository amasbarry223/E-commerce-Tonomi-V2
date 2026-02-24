/**
 * Configuration et helpers pour la protection des routes.
 *
 * Règle métier : l'accès au dashboard (et toute route protégée) exige une
 * authentification préalable via la page /login. Le middleware et les guards
 * client appliquent cette règle.
 */
import {
  ROUTES,
  AUTH_COOKIE_NAME,
  REDIRECT_QUERY,
  SESSION_EXPIRED_QUERY,
  PAGES_ADMIN,
  ADMIN_PAGE_TO_SLUG,
} from "@/lib/routes"

export { ROUTES, AUTH_COOKIE_NAME, REDIRECT_QUERY, SESSION_EXPIRED_QUERY }

const ADMIN_PREFIX = "/admin"

/** Chemins accessibles sans authentification */


export function isPublicPath(_pathname: string): boolean {
  return true // Tout est public
}

export function isProtectedPath(_pathname: string): boolean {
  return false // Plus rien n'est protégé par login
}

export function isAdminPath(pathname: string): boolean {
  return pathname === ADMIN_PREFIX || pathname.startsWith(ADMIN_PREFIX + "/")
}

/** Retourne le path pour une page admin : /dashboard ou /admin/<segment>. */
export function getAdminPath(adminPageKey?: string): string {
  if (!adminPageKey || adminPageKey === PAGES_ADMIN.dashboard) return ROUTES.dashboard
  const segment = (ADMIN_PAGE_TO_SLUG as Record<string, string>)[adminPageKey]
  if (segment === undefined || segment === "") return ROUTES.dashboard
  return `${ROUTES.admin}/${segment}`
}

/** Construit l’URL admin (path-based) : /dashboard ou /admin/<segment>. */
export function getAdminHomeUrl(adminPage?: string): string {
  return getAdminPath(adminPage)
}

/**
 * Vérifie si une URL de redirect (path) est autorisée.
 */
export function isAllowedRedirectUrl(redirect: string | null | undefined): boolean {
  if (redirect == null || typeof redirect !== "string" || !redirect.startsWith("/")) return false
  return true
}
