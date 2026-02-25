"use client"

import { useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useNavigationStore } from "@/lib/store-context"
import { PAGES } from "@/lib/routes"

const STORE_PAGE_PARAM = "page"
const PRODUCT_ID_PARAM = "id"
const CATEGORY_PARAM = "category"

/** Normalise la chaîne de query pour éviter des replace en boucle (ordre des params, etc.). */
function normalizeSearchString(s: string): string {
  if (!s.trim()) return ""
  const params = new URLSearchParams(s)
  const keys = Array.from(params.keys()).sort()
  const next = new URLSearchParams()
  keys.forEach((k) => next.set(k, params.get(k) ?? ""))
  return next.toString()
}

/**
 * Synchronise l'URL avec l'état SPA storefront (page, id, category, view=admin).
 * À utiliser dans le composant qui rend la SPA (ex. AppContent).
 */
export function useSyncUrlWithStore() {
  const {
    currentView,
    currentPage,
    navigate,
    selectCategory,
    selectProduct,
    selectedProductId,
    selectedCategoryId,
  } = useNavigationStore()
  const searchParams = useSearchParams()
  const router = useRouter()
  const isReplacingRef = useRef(false)

  // Sync URL → état SPA (lien direct, retour arrière)
  useEffect(() => {
    if (currentView !== "store") return
    const pageParam = searchParams.get(STORE_PAGE_PARAM)
    const idParam = searchParams.get(PRODUCT_ID_PARAM)
    const categoryParam = searchParams.get(CATEGORY_PARAM)
    if (pageParam === "product" && idParam) {
      selectProduct(idParam)
      navigate(PAGES.store.product)
      return
    }
    if (pageParam === "catalog") {
      selectCategory(categoryParam || null)
      navigate(PAGES.store.catalog)
      return
    }
    if (pageParam === "cart") navigate(PAGES.store.cart)
    else if (pageParam === "checkout") navigate(PAGES.store.checkout)
    else if (pageParam === "account") navigate(PAGES.store.account)
    else if (pageParam === "wishlist") navigate(PAGES.store.wishlist)
    else if (pageParam === "about") navigate(PAGES.store.about)
    else if (pageParam === "delivery") navigate(PAGES.store.delivery)
    else if (pageParam === "returns") navigate(PAGES.store.returns)
    else if (pageParam === "terms") navigate(PAGES.store.terms)
    else if (pageParam === "privacy") navigate(PAGES.store.privacy)
    else if (pageParam === "faq") navigate(PAGES.store.faq)
    else if (pageParam === "home" || (!pageParam && !idParam)) {
      if (idParam) selectProduct(idParam)
      else if (categoryParam) selectCategory(categoryParam)
    }
  }, [searchParams, currentView, navigate, selectCategory, selectProduct])

  // Sync état → URL (URLs partageables) — avec garde anti-boucle et gestion d'erreur
  useEffect(() => {
    if (currentView !== "store") return
    if (isReplacingRef.current) return

    const params = new URLSearchParams(searchParams.toString())
    if (currentPage === PAGES.store.product && selectedProductId) {
      params.set(STORE_PAGE_PARAM, "product")
      params.set(PRODUCT_ID_PARAM, selectedProductId)
      params.delete(CATEGORY_PARAM)
    } else if (currentPage === PAGES.store.catalog || currentPage === PAGES.store.category || currentPage === PAGES.store.promotions) {
      params.set(STORE_PAGE_PARAM, "catalog")
      if (selectedCategoryId) params.set(CATEGORY_PARAM, selectedCategoryId)
      else params.delete(CATEGORY_PARAM)
      params.delete(PRODUCT_ID_PARAM)
    } else if (currentPage === PAGES.store.cart) params.set(STORE_PAGE_PARAM, "cart")
    else if (currentPage === PAGES.store.checkout) params.set(STORE_PAGE_PARAM, "checkout")
    else if (currentPage === PAGES.store.account) params.set(STORE_PAGE_PARAM, "account")
    else if (currentPage === PAGES.store.wishlist) params.set(STORE_PAGE_PARAM, "wishlist")
    else if (currentPage === PAGES.store.about) params.set(STORE_PAGE_PARAM, "about")
    else if (currentPage === PAGES.store.delivery) params.set(STORE_PAGE_PARAM, "delivery")
    else if (currentPage === PAGES.store.returns) params.set(STORE_PAGE_PARAM, "returns")
    else if (currentPage === PAGES.store.terms) params.set(STORE_PAGE_PARAM, "terms")
    else if (currentPage === PAGES.store.privacy) params.set(STORE_PAGE_PARAM, "privacy")
    else if (currentPage === PAGES.store.faq) params.set(STORE_PAGE_PARAM, "faq")
    else if (currentPage === PAGES.store.home) {
      params.set(STORE_PAGE_PARAM, "home")
      params.delete(PRODUCT_ID_PARAM)
      params.delete(CATEGORY_PARAM)
    } else {
      params.delete(STORE_PAGE_PARAM)
      params.delete(PRODUCT_ID_PARAM)
      params.delete(CATEGORY_PARAM)
    }

    const next = normalizeSearchString(params.toString())
    const current = normalizeSearchString(searchParams.toString())
    if (next === current) return

    const targetUrl = next ? `/?${next}` : "/"
    isReplacingRef.current = true
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    try {
      router.replace(targetUrl, { scroll: false })
    } catch (err: unknown) {
      if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {
        console.warn("[useSyncUrlWithStore] router.replace failed:", err)
      }
    } finally {
      timeoutId = setTimeout(() => {
        isReplacingRef.current = false
      }, 0)
    }
    return () => {
      if (timeoutId !== null) clearTimeout(timeoutId)
      isReplacingRef.current = false
    }
  }, [currentView, currentPage, selectedProductId, selectedCategoryId, router, searchParams])

  // Page Promotions : pré-sélectionner la catégorie
  useEffect(() => {
    if (currentView === "store" && currentPage === PAGES.store.promotions) {
      selectCategory("cat-6")
    }
  }, [currentView, currentPage, selectCategory])
}
