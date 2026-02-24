"use client"

import { type ReactNode } from "react"
import { useAuthStore, type AuthRole } from "@/lib/stores/auth-store"

interface RoleGuardProps {
  children: ReactNode
  role: AuthRole
  /** Composant affiché si le rôle ne correspond pas (ex: page 403) */
  fallback?: ReactNode
}

/**
 * Restreint l'accès à un rôle donné. Affiche fallback ou rien si l'utilisateur n'a pas le rôle.
 * À combiner avec ProtectedRoute pour vérifier d'abord l'authentification.
 */
export function RoleGuard({ children, role, fallback = null }: RoleGuardProps) {
  const user = useAuthStore((state) => state.user)
  const hasRole =
    user?.role === role ||
    (role === "admin" && user?.role === "super-admin")

  if (!hasRole) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
