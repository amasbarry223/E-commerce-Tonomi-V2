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
  // En développement, ne pas forcer l'upgrade HTTPS (pour éviter les problèmes avec localhost)
  const isDevelopment = process.env.NODE_ENV === "development"
  const upgradeInsecure = isDevelopment ? "" : "upgrade-insecure-requests;"
  
  // CSP avec autorisations pour Supabase et Vercel Analytics
  // Utilisation de wildcards pour Supabase car tous les projets utilisent *.supabase.co
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' vercel.live https://va.vercel-scripts.com;
    style-src 'self' 'unsafe-inline';
    connect-src 'self' https://*.supabase.co wss://*.supabase.co https://va.vercel-scripts.com http://localhost:* https://localhost:* ws://localhost:* wss://localhost:*;
    img-src 'self' blob: data: https: http:;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${upgradeInsecure}
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
  // Appliquer le middleware à toutes les routes pour que la CSP soit active partout
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
