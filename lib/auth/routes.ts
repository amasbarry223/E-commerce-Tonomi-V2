/**
 * Configuration et helpers pour la protection des routes.
 *
 * Règle métier : l'accès au dashboard (et toute route protégée) exige une
 * authentification préalable via la page /login. Le middleware et les guards
 * client appliquent cette règle.
 */
import { ROUTES, AUTH_COOKIE_NAME, REDIRECT_QUERY, SESSION_EXPIRED_QUERY } from "@/lib/routes"

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

/** Chemins protégés (auth requise) — dashboard et admin uniquement. Cart et checkout sont publics pour les visiteurs. */
const PROTECTED_PATH_LIST: string[] = [
  ROUTES.dashboard,
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

/** Construit l’URL admin SPA avec une page optionnelle (?view=admin&page=...). */
export function getAdminHomeUrl(adminPage?: string): string {
  if (!adminPage) return ROUTES.homeAdmin
  return `/?view=admin&page=${encodeURIComponent(adminPage)}`
}

/** Vérifie si une URL de redirect (path + query) est autorisée après login (dashboard, admin, account). */
export function isAllowedRedirectUrl(redirect: string | null | undefined): boolean {
  if (redirect == null || typeof redirect !== "string" || !redirect.startsWith("/")) return false
  const trimmed = redirect.trim()
  if (!trimmed) return false
  if (trimmed === ROUTES.dashboard || trimmed.startsWith("/account")) return true
  if (trimmed.startsWith("/admin")) return true
  if (trimmed === ROUTES.homeAdmin) return true
  try {
    const u = new URL(trimmed, "http://x")
    if (u.pathname === "/" && u.searchParams.get("view") === "admin") return true
  } catch {
    // ignore
  }
  return false
}
