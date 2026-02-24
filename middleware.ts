/**
 * Middleware d'authentification — couche 1 (Edge) :
 *
 * GuestOnly  : /login, /register, /forgot-password, /reset-password
 *   → Si cookie auth présent → redirect /dashboard
 *
 * ProtectedAuth : /dashboard, /dashboard/*, /admin, /admin/*, /account, /account/*
 *   → Si cookie absent → redirect /login?redirect=<path>
 *
 * NOTE : /?view=admin est un pattern obsolète géré par un redirect dans app/page.tsx.
 *        Le middleware n'intervient plus sur ce pattern.
 */
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {
  ROUTES,
  AUTH_COOKIE_NAME,
  REDIRECT_QUERY,
  getLoginUrl,
  isProtectedPath,
  isAllowedRedirectUrl,
} from "@/lib/auth/routes"

function hasAuthCookie(request: NextRequest): boolean {
  return !!request.cookies.get(AUTH_COOKIE_NAME)?.value
}

/** Paths accessibles uniquement aux invités (non connectés). */
const GUEST_ONLY_PATHS = new Set([
  ROUTES.login,
  ROUTES.register,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
])

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const hasAuth = hasAuthCookie(request)

  // ——— GuestOnly : connecté → redirect vers dashboard (ou ?redirect=) ———
  if (GUEST_ONLY_PATHS.has(pathname as typeof ROUTES.login)) {
    if (hasAuth) {
      const rawRedirect = searchParams.get(REDIRECT_QUERY)
      const target =
        rawRedirect && isAllowedRedirectUrl(rawRedirect)
          ? rawRedirect
          : ROUTES.dashboard
      return NextResponse.redirect(new URL(target, request.url))
    }
    // Non connecté → laisse passer
    return addSecurityHeaders(NextResponse.next())
  }

  // ——— ProtectedAuth : non connecté → redirect login ———
  if (isProtectedPath(pathname) && !hasAuth) {
    const loginUrl = getLoginUrl(pathname, false)
    return NextResponse.redirect(new URL(loginUrl, request.url))
  }

  return addSecurityHeaders(NextResponse.next())
}

function addSecurityHeaders(response: ReturnType<typeof NextResponse.next>) {
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  return response
}

export const config = {
  matcher: [
    // Routes GuestOnly
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    // Routes protégées
    "/dashboard",
    "/dashboard/:path*",
    "/account",
    "/account/:path*",
    "/admin",
    "/admin/:path*",
  ],
}
