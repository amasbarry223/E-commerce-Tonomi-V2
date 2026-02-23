"use client"

import { StoreProvider } from "@/lib/store-context"
import { GuestOnlyRoute } from "@/lib/guards"
import { AdminLogin } from "@/components/admin/admin-login"

/**
 * Page de connexion : point d'entrée obligatoire pour accéder au dashboard.
 * - Invite → formulaire de connexion.
 * - Déjà connecté → redirection vers dashboard (ou URL en query `redirect`).
 * Les routes protégées (/dashboard, /admin, etc.) redirigent ici si non authentifié.
 */
export default function LoginPage() {
  return (
    <StoreProvider>
      <GuestOnlyRoute>
        <AdminLogin />
      </GuestOnlyRoute>
    </StoreProvider>
  )
}
