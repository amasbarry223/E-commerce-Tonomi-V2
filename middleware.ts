/**
 * Next.js Middleware pour sécurité et protection des routes
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ROUTES } from '@/lib/routes'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // TODO: Protection routes admin — vérifier l'authentification (cookie auth-token) et rediriger vers ROUTES.login si absent
  if (pathname.startsWith('/admin')) {
    // Auth à brancher quand le backend sera en place
  }
  
  // Headers de sécurité
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
}

