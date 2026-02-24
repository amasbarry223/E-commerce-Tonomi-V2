"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { StoreProvider, useNavigationStore } from "@/lib/store-context"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { FullScreenLoading } from "@/components/ui/full-screen-loading"
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
 *  1. Middleware (Edge)   → gère les en-têtes de sécurité
 */
function AdminCatchAllContent() {
  const params = useParams()
  const slug = params.slug as string[] | undefined
  const segment = Array.isArray(slug) ? slug[0] : (slug ?? "dashboard")
  const pageKey = getAdminPageKeyFromSlug(segment)
  const { setCurrentView, navigate } = useNavigationStore()

  useEffect(() => {
    setCurrentView("admin")
    navigate(pageKey)
  }, [segment, pageKey, setCurrentView, navigate])

  const AdminComponent =
    ADMIN_PAGE_MAP[pageKey as AdminPageKey] ?? ADMIN_PAGE_MAP[PAGES.admin.dashboard]

  return (
    <ErrorBoundary>
      <AdminLayout>
        <AdminComponent />
      </AdminLayout>
    </ErrorBoundary>
  )
}

export default function AdminCatchAllPage() {
  return (
    <StoreProvider>
      <AdminCatchAllContent />
    </StoreProvider>
  )
}
