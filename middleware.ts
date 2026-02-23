/**
 * Middleware d'authentification :
 * - Accès au dashboard (et routes protégées) uniquement avec cookie auth → sinon redirect /login?redirect=...
 * - Sur /login avec cookie → redirect vers dashboard (ou query redirect)
 * - /?view=admin sans cookie → redirect /login
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

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const hasAuth = hasAuthCookie(request)

  if (pathname === ROUTES.login && hasAuth) {
    const redirect = searchParams.get(REDIRECT_QUERY) || ROUTES.dashboard
    const target = isAllowedRedirectUrl(redirect) ? redirect : ROUTES.dashboard
    return NextResponse.redirect(new URL(target, request.url))
  }

  if (isProtectedPath(pathname) && !hasAuth) {
    const loginUrl = getLoginUrl(pathname, false)
    return NextResponse.redirect(new URL(loginUrl, request.url))
  }

  // Accès à /?view=admin (avec ou sans page=...) sans cookie → redirect login en gardant l’URL complète
  if (pathname === "/" && searchParams.get("view") === "admin" && !hasAuth) {
    const queryString = searchParams.toString()
    const redirectPath = queryString ? `/?${queryString}` : "/?view=admin"
    const loginUrl = getLoginUrl(redirectPath, false)
    return NextResponse.redirect(new URL(loginUrl, request.url))
  }

  const response = NextResponse.next()
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  return response
}

// Pas de routes API pour l'instant ; réajouter "/api/:path*" et la logique auth si besoin.
export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/dashboard",
    "/dashboard/:path*",
    "/account",
    "/account/:path*",
    "/checkout",
    "/cart",
    "/admin",
    "/admin/:path*",
  ],
}

