import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Middleware — Couche de sécurité globale (Edge).
 * L'authentification a été supprimée.
 */
export function middleware(_request: NextRequest) {
  return addSecurityHeaders(NextResponse.next())
}

function addSecurityHeaders(response: ReturnType<typeof NextResponse.next>) {
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' vercel.live;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: images.unsplash.com https://images.unsplash.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, " ").trim()

  response.headers.set("Content-Security-Policy", cspHeader)
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  return response
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/account",
    "/account/:path*",
    "/admin",
    "/admin/:path*",
  ],
}
