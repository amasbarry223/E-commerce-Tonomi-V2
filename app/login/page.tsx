"use client"

import { StoreProvider } from "@/lib/store-context"
import { GuestOnlyRoute } from "@/lib/guards"
import { AdminLogin } from "@/components/admin/admin-login"

export default function LoginPage() {
  return (
    <StoreProvider>
      <GuestOnlyRoute>
        <AdminLogin />
      </GuestOnlyRoute>
    </StoreProvider>
  )
}
