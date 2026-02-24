"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore, hasAuthCookie } from "@/lib/stores/auth-store"
import { getLoginUrl } from "@/lib/auth/routes"
import { AUTH_DELAYS_MS } from "@/lib/constants"
import { FullScreenLoading } from "@/components/ui/full-screen-loading"

interface ProtectedRouteProps {
  children: ReactNode
}

/**
 * Couche client de protection des routes authentifiées.
 * Complète le middleware (couche Edge) en gérant la désynchronisation
 * possible entre le cookie et le store Zustand après hydratation.
 *
 * Flux :
 *  1. Attendre l'hydratation du store (évite un flash de redirect)
 *  2. Si non authentifié → redirect /login?redirect=<pathname>
 *  3. Si authentifié mais cookie absent (session expirée) → logout + redirect sessionExpired
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const hasHydrated = useAuthStore((s) => s._hasHydrated)
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()
  const pathname = usePathname()
  const [canRedirect, setCanRedirect] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setCanRedirect(true), AUTH_DELAYS_MS.AUTH_CHECK)
    return () => clearTimeout(t)
  }, [])

  const ready = hasHydrated && canRedirect

  useEffect(() => {
    if (!canRedirect || !hasHydrated) return

    if (!isAuthenticated) {
      router.replace(getLoginUrl(pathname || "/dashboard", false))
      return
    }

    if (!hasAuthCookie()) {
      logout()
      router.replace(getLoginUrl(pathname || "/dashboard", true))
    }
  }, [canRedirect, hasHydrated, isAuthenticated, logout, router, pathname])

  if (!ready || !isAuthenticated || !hasAuthCookie()) {
    return (
      <FullScreenLoading
        message="Vérification en cours..."
        ariaLabel="Vérification de l'authentification"
      />
    )
  }

  return <>{children}</>
}
