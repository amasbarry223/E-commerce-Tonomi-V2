"use client"

import { useEffect, useState } from "react"
import { StoreProvider, useNavigationStore } from "@/lib/store-context"
import { PAGES } from "@/lib/routes"
import { ProtectedRoute } from "@/lib/guards"
import { RoleGuard } from "@/lib/guards/role-guard"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { FullScreenLoading } from "@/components/ui/full-screen-loading"
import { ForbiddenPage } from "@/components/ui/forbidden-page"
import dynamic from "next/dynamic"

const AdminLayout = dynamic(
  () => import("@/components/admin/admin-layout").then((m) => ({ default: m.AdminLayout })),
  { loading: () => <FullScreenLoading ariaLabel="Chargement" /> }
)
const AdminDashboard = dynamic(
  () => import("@/components/admin/admin-dashboard").then((m) => ({ default: m.AdminDashboard })),
  { loading: () => <FullScreenLoading ariaLabel="Chargement" /> }
)

/**
 * Page /dashboard : tableau de bord admin.
 *
 * Protection par couches :
 *  1. Middleware (Edge)   → bloque les non-authentifiés avant le rendu
 *  2. ProtectedRoute      → désynchronisation store/cookie après hydratation
 *  3. RoleGuard('admin')  → bloque les utilisateurs sans rôle admin
 */
function DashboardContent() {
  const { setCurrentView, navigate } = useNavigationStore()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setCurrentView("admin")
    navigate(PAGES.admin.dashboard)
    setReady(true)
  }, [setCurrentView, navigate])

  if (!ready) {
    return (
      <FullScreenLoading
        message="Chargement du tableau de bord..."
        ariaLabel="Chargement du tableau de bord"
      />
    )
  }

  return (
    <ProtectedRoute>
      <RoleGuard role="admin" fallback={<ForbiddenPage />}>
        <ErrorBoundary>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </ErrorBoundary>
      </RoleGuard>
    </ProtectedRoute>
  )
}

export default function DashboardPage() {
  return (
    <StoreProvider>
      <DashboardContent />
    </StoreProvider>
  )
}
