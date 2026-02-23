"use client"

import { FullScreenLoading } from "@/components/ui/full-screen-loading"

/**
 * État de chargement pour la route /account (Next.js App Router).
 */
export default function AccountLoading() {
  return <FullScreenLoading ariaLabel="Chargement" />
}
