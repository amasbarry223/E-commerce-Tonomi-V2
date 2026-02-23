"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useAuthStore, hasAuthCookie } from "@/lib/stores/auth-store"
import { ROUTES } from "@/lib/routes"
import { getLoginUrl } from "@/lib/auth/routes"
import { AUTH_DELAYS_MS } from "@/lib/constants"
import { FullScreenLoading } from "@/components/ui/full-screen-loading"

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const hasHydrated = useAuthStore((s) => s._hasHydrated)
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [canRedirect, setCanRedirect] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setCanRedirect(true), AUTH_DELAYS_MS.AUTH_CHECK)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!canRedirect || !hasHydrated) return
    if (!isAuthenticated) {
      const isAdminContext = pathname === "/" && searchParams.get("view") === "admin"
      const redirectPath =
        pathname === "/" && !searchParams.get("view")
          ? ROUTES.homeAdmin
          : isAdminContext
            ? `${pathname}?${searchParams.toString()}`
            : (pathname || ROUTES.dashboard)
      router.replace(getLoginUrl(redirectPath, false))
      return
    }
    if (!hasAuthCookie()) {
      const isAdminContext = pathname === "/" && searchParams.get("view") === "admin"
      const redirectPath =
        pathname === "/" && !searchParams.get("view")
          ? ROUTES.homeAdmin
          : isAdminContext
            ? `${pathname}?${searchParams.toString()}`
            : (pathname || ROUTES.dashboard)
      logout()
      router.replace(getLoginUrl(redirectPath, true))
    }
  }, [canRedirect, hasHydrated, isAuthenticated, logout, router, pathname, searchParams])

  const ready = hasHydrated && canRedirect
  if (!ready || !isAuthenticated) {
    return (
      <FullScreenLoading
        message="Vérification en cours..."
        ariaLabel="Vérification de l'authentification"
      />
    )
  }
  if (!hasAuthCookie()) {
    return (
      <FullScreenLoading
        message="Vérification en cours..."
        ariaLabel="Vérification de l'authentification"
      />
    )
  }

  return <>{children}</>
}
