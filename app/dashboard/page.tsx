"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/routes"
import { getLoginUrl } from "@/lib/auth/routes"
import { hasAuthCookie } from "@/lib/stores/auth-store"
import { FullScreenLoading } from "@/components/ui/full-screen-loading"

/**
 * Page /dashboard : accès réservé aux utilisateurs authentifiés (vérifié par le middleware).
 * - Redirection immédiate vers /?view=admin si le cookie d'auth est présent (évite d'attendre la réhydration Zustand).
 * - Sinon redirection vers /login avec redirect=/dashboard.
 */
export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window === "undefined") return
    if (hasAuthCookie()) {
      router.replace(ROUTES.homeAdmin)
      return
    }
    router.replace(getLoginUrl(ROUTES.dashboard, false))
  }, [router])

  return (
    <FullScreenLoading
      message="Redirection vers le tableau de bord..."
      ariaLabel="Redirection vers le tableau de bord"
    />
  )
}
