"use client"

import { FullScreenLoading } from "@/components/ui/full-screen-loading"

/**
 * État de chargement pour la route /checkout (Next.js App Router).
 */
export default function CheckoutLoading() {
  return <FullScreenLoading ariaLabel="Chargement" />
}
