"use client"

import { FullScreenLoading } from "@/components/ui/full-screen-loading"
import { useRedirectToStorePage } from "@/hooks/use-redirect-to-store-page"

/**
 * /cart : redirection vers la SPA avec page=cart pour afficher le panier.
 */
export default function CartPage() {
  useRedirectToStorePage("cart")
  return <FullScreenLoading ariaLabel="Chargement" />
}