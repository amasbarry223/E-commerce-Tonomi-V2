"use client"

import { useEffect } from "react"
import { StoreProvider, useNavigationStore } from "@/lib/store-context"
import { PAGES } from "@/lib/routes"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { FullScreenLoading } from "@/components/ui/full-screen-loading"
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
 *  1. Middleware (Edge)   → gère les en-têtes de sécurité
 */
function DashboardContent() {
  const { setCurrentView, navigate } = useNavigationStore()

  useEffect(() => {
    setCurrentView("admin")
    navigate(PAGES.admin.dashboard)
  }, [setCurrentView, navigate])

  return (
    <ErrorBoundary>
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    </ErrorBoundary>
  )
}

export default function DashboardPage() {
  return (
    <StoreProvider>
      <DashboardContent />
    </StoreProvider>
  )
}
