"use client"

import { FullScreenLoading } from "@/components/ui/full-screen-loading"
import { useRedirectToStorePage } from "@/hooks/use-redirect-to-store-page"

/**
 * /account : redirection vers la SPA avec page=account pour afficher le compte.
 */
export default function AccountPage() {
  useRedirectToStorePage("account")
  return <FullScreenLoading ariaLabel="Chargement" />
}
