"use client"

import { FullScreenLoading } from "@/components/ui/full-screen-loading"

/**
 * État de chargement pour la route /login (Next.js App Router).
 */
export default function LoginLoading() {
  return (
    <FullScreenLoading
      message="Chargement..."
      ariaLabel="Chargement de la page de connexion"
      variant="gradient"
    />
  )
}
