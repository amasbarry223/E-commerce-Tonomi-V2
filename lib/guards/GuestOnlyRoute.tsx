"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { ROUTES } from "@/lib/routes"

interface GuestOnlyRouteProps {
  children: ReactNode
}

export function GuestOnlyRoute({ children }: GuestOnlyRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) router.replace(ROUTES.home)
  }, [isAuthenticated, router])

  if (isAuthenticated) return null
  return <>{children}</>
}
