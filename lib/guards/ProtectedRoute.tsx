"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { ROUTES } from "@/lib/routes"

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ProtectedRoute({ children, fallback = null }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated && !fallback) {
      router.replace(ROUTES.login)
    }
  }, [isAuthenticated, fallback, router])

  if (!isAuthenticated) return <>{fallback}</>
  return <>{children}</>
}
