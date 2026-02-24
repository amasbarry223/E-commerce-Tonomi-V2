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
const PUBLIC_PATH_LIST: string[] = [
  ROUTES.home,
  ROUTES.login,
  ROUTES.register,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
  "/products",
  "/categories",
]

/** Chemins protégés (auth requise) — dashboard, admin et compte utilisateur. */
const PROTECTED_PATH_LIST: string[] = [
  ROUTES.dashboard,
  ROUTES.account,
]

function pathMatches(pathname: string, pattern: string): boolean {
  if (pathname === pattern) return true
  if (pathname.startsWith(pattern + "/")) return true
  return false
}

export function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATH_LIST.some((p) => pathMatches(pathname, p))) return true
  if (pathname.startsWith("/products/") || pathname.startsWith("/categories/")) return true
  return false
}

export function isProtectedPath(pathname: string): boolean {
  if (pathname === ADMIN_PREFIX || pathname.startsWith(ADMIN_PREFIX + "/")) return true
  return PROTECTED_PATH_LIST.some((p) => pathMatches(pathname, p))
}

export function isAdminPath(pathname: string): boolean {
  return pathname === ADMIN_PREFIX || pathname.startsWith(ADMIN_PREFIX + "/")
}

export function getLoginUrl(redirectPath?: string, sessionExpired?: boolean): string {
  const path = redirectPath || ROUTES.dashboard
  let url = `${ROUTES.login}?${REDIRECT_QUERY}=${encodeURIComponent(path)}`
  if (sessionExpired) url += `&${SESSION_EXPIRED_QUERY}=1`
  return url
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
 * Vérifie si une URL de redirect (path) est autorisée après login.
 * Seuls les paths protégés réels sont acceptés : /dashboard, /admin/*, /account/*
 */
export function isAllowedRedirectUrl(redirect: string | null | undefined): boolean {
  if (redirect == null || typeof redirect !== "string" || !redirect.startsWith("/")) return false
  const trimmed = redirect.trim()
  if (!trimmed) return false
  if (trimmed === ROUTES.dashboard || trimmed.startsWith(ROUTES.dashboard + "/")) return true
  if (trimmed === ROUTES.account || trimmed.startsWith(ROUTES.account + "/")) return true
  if (trimmed === ROUTES.admin || trimmed.startsWith(ROUTES.admin + "/")) return true
  return false
}
