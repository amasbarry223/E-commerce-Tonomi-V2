"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export type StorePageRoute = "cart" | "account" | "checkout"

/**
 * Redirige vers la SPA store avec le paramètre page correspondant.
 * À utiliser dans les pages /cart, /account, /checkout qui ne font que rediriger.
 */
export function useRedirectToStorePage(page: StorePageRoute): void {
  const router = useRouter()
  useEffect(() => {
    router.replace(`/?page=${page}`)
  }, [router, page])
}
