"use client"

import { FullScreenLoading } from "@/components/ui/full-screen-loading"

/**
 * État de chargement pour la route /cart (Next.js App Router).
 */
export default function CartLoading() {
  return <FullScreenLoading ariaLabel="Chargement" />
}
