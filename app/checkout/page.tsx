"use client"

import { FullScreenLoading } from "@/components/ui/full-screen-loading"
import { useRedirectToStorePage } from "@/hooks/use-redirect-to-store-page"

/**
 * /checkout : redirection vers la SPA avec page=checkout pour afficher le tunnel de commande.
 */
export default function CheckoutPage() {
  useRedirectToStorePage("checkout")
  return <FullScreenLoading ariaLabel="Chargement" />
}
