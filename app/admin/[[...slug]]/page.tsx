"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { StoreProvider, useNavigationStore } from "@/lib/store-context"
import { ProtectedRoute } from "@/lib/guards"
import { RoleGuard } from "@/lib/guards/role-guard"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { FullScreenLoading } from "@/components/ui/full-screen-loading"
import { ForbiddenPage } from "@/components/ui/forbidden-page"
import { ADMIN_PAGE_MAP, getAdminPageKeyFromSlug } from "@/lib/admin-page-map"
import type { AdminPageKey } from "@/lib/routes"
import { PAGES } from "@/lib/routes"
import dynamic from "next/dynamic"

const AdminLayout = dynamic(
  () => import("@/components/admin/admin-layout").then((m) => ({ default: m.AdminLayout })),
  { loading: () => <FullScreenLoading ariaLabel="Chargement" /> }
)

/**
 * /admin et /admin/* : rendu de la page admin correspondant au segment d'URL.
 * Ex. /admin/products → AdminLayout + AdminProducts.
 *
 * Protection par couches :
 *  1. Middleware (Edge)   → bloque les non-authentifiés avant le rendu
 *  2. ProtectedRoute      → désynchronisation store/cookie après hydratation
 *  3. RoleGuard('admin')  → bloque les utilisateurs sans rôle admin
 */
function AdminCatchAllContent() {
  const params = useParams()
  const slug = params.slug as string[] | undefined
  const segment = Array.isArray(slug) ? slug[0] : (slug ?? "dashboard")
  const pageKey = getAdminPageKeyFromSlug(segment)
  const { setCurrentView, navigate } = useNavigationStore()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setCurrentView("admin")
    navigate(pageKey)
    setReady(true)
  }, [segment, pageKey, setCurrentView, navigate])

  if (!ready) {
    return <FullScreenLoading ariaLabel="Chargement du back-office" />
  }

  const AdminComponent =
    ADMIN_PAGE_MAP[pageKey as AdminPageKey] ?? ADMIN_PAGE_MAP[PAGES.admin.dashboard]

  return (
    <ProtectedRoute>
      <RoleGuard role="admin" fallback={<ForbiddenPage />}>
        <ErrorBoundary>
          <AdminLayout>
            <AdminComponent />
          </AdminLayout>
        </ErrorBoundary>
      </RoleGuard>
    </ProtectedRoute>
  )
}

export default function AdminCatchAllPage() {
  return (
    <StoreProvider>
      <AdminCatchAllContent />
    </StoreProvider>
  )
}
