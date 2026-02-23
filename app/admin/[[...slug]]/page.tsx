"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PAGES, ADMIN_SLUG_TO_PAGE } from "@/lib/routes"
import { getAdminHomeUrl } from "@/lib/auth/routes"
import { FullScreenLoading } from "@/components/ui/full-screen-loading"

/**
 * /admin et /admin/* : redirection vers la SPA admin (?view=admin&page=...).
 * Ex. /admin/products → /?view=admin&page=admin-products
 */
export default function AdminCatchAllPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string[] | undefined
  useEffect(() => {
    const segment = Array.isArray(slug) ? slug[0] : slug ?? "dashboard"
    const page = ADMIN_SLUG_TO_PAGE[segment] ?? PAGES.admin.dashboard
    const target = getAdminHomeUrl(page)
    router.replace(target)
  }, [router, slug])
  return <FullScreenLoading ariaLabel="Redirection" />
}
