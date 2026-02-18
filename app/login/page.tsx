"use client"

import { StoreProvider } from "@/lib/store-context"
import { AdminLogin } from "@/components/admin/admin-login"

export default function LoginPage() {
  return (
    <StoreProvider>
      <AdminLogin />
    </StoreProvider>
  )
}
