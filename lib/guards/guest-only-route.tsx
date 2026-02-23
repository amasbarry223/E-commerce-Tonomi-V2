"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { ROUTES, REDIRECT_QUERY } from "@/lib/routes"
import { isAllowedRedirectUrl } from "@/lib/auth/routes"
import { AUTH_DELAYS_MS } from "@/lib/constants"
import { FullScreenLoading } from "@/components/ui/full-screen-loading"

interface GuestOnlyRouteProps {
  children: ReactNode
}

/**
 * Garde pour /login : affiche le formulaire pour les invités, redirige vers dashboard (ou redirect URL) si déjà authentifié.
 */
export function GuestOnlyRoute({ children }: GuestOnlyRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [canShow, setCanShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setCanShow(true), AUTH_DELAYS_MS.GUEST_ONLY_INITIAL)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!canShow) return
    if (isAuthenticated) {
      const rawRedirect = searchParams.get(REDIRECT_QUERY)
      const redirect = (rawRedirect && isAllowedRedirectUrl(rawRedirect) ? rawRedirect : ROUTES.dashboard).trim()
      if (redirect) router.replace(redirect)
    }
  }, [canShow, isAuthenticated, router, searchParams])

  if (!canShow) return <FullScreenLoading message="Chargement..." ariaLabel="Chargement" />
  if (isAuthenticated) return <FullScreenLoading message="Chargement..." ariaLabel="Chargement" />
  return <>{children}</>
}
