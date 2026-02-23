"use client"

import { useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useNavigationStore } from "@/lib/store-context"
import { useAuthStore } from "@/lib/stores/auth-store"
import { PAGES } from "@/lib/routes"

const STORE_PAGE_PARAM = "page"
const VIEW_PARAM = "view"
const PRODUCT_ID_PARAM = "id"
const CATEGORY_PARAM = "category"

/** Clés de page admin valides pour la sync URL (page=admin-xxx ou dashboard). */
const ADMIN_PAGE_KEYS = new Set<string>([
  PAGES.admin.dashboard,
  PAGES.admin.products,
  PAGES.admin.categories,
  PAGES.admin.heroSlides,
  PAGES.admin.orders,
  PAGES.admin.customers,
  PAGES.admin.analytics,
  PAGES.admin.promos,
  PAGES.admin.reviews,
  PAGES.admin.settings,
])

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
    setCurrentView,
    navigate,
    selectCategory,
    selectProduct,
    selectedProductId,
    selectedCategoryId,
  } = useNavigationStore()
  const searchParams = useSearchParams()
  const router = useRouter()
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
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

  // ?view=admin : restaurer vue admin depuis l’URL (lien direct, refresh) et persister view+page
  useEffect(() => {
    if (searchParams.get(VIEW_PARAM) !== "admin" || !isAuthenticated) return
    setCurrentView("admin")
    const pageParam = searchParams.get(STORE_PAGE_PARAM)
    const adminPage = pageParam && ADMIN_PAGE_KEYS.has(pageParam) ? pageParam : PAGES.admin.dashboard
    navigate(adminPage)
    isReplacingRef.current = true
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    try {
      const params = new URLSearchParams()
      params.set(VIEW_PARAM, "admin")
      params.set(STORE_PAGE_PARAM, adminPage)
      router.replace(`/?${params.toString()}`, { scroll: false })
    } catch (err: unknown) {
      if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {
        console.warn("[useSyncUrlWithStore] router.replace (admin) failed:", err)
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
  }, [searchParams, isAuthenticated, setCurrentView, navigate, router])

  // Sync état admin → URL (navigation dans le back-office : garder ?view=admin&page=...)
  useEffect(() => {
    if (currentView !== "admin" || isReplacingRef.current) return
    const pageParam = searchParams.get(STORE_PAGE_PARAM)
    const urlAlreadyValid = searchParams.get(VIEW_PARAM) === "admin" && pageParam && ADMIN_PAGE_KEYS.has(pageParam)
    if (!ADMIN_PAGE_KEYS.has(currentPage) && urlAlreadyValid) return
    const params = new URLSearchParams(searchParams.toString())
    const currentViewParam = params.get(VIEW_PARAM)
    const currentPageParam = params.get(STORE_PAGE_PARAM)
    // Ne jamais écrire une clé store (ex. "home") dans l’URL admin : utiliser la page courante seulement si c’est une clé admin, sinon l’URL ou dashboard
    const desiredPage = ADMIN_PAGE_KEYS.has(currentPage)
      ? currentPage
      : (currentPageParam && ADMIN_PAGE_KEYS.has(currentPageParam) ? currentPageParam : PAGES.admin.dashboard)
    if (currentViewParam === "admin" && currentPageParam === desiredPage) return
    params.set(VIEW_PARAM, "admin")
    params.set(STORE_PAGE_PARAM, desiredPage)
    const next = normalizeSearchString(params.toString())
    const current = normalizeSearchString(searchParams.toString())
    if (next === current) return
    isReplacingRef.current = true
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    try {
      router.replace(`/?${next}`, { scroll: false })
    } catch (err: unknown) {
      if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {
        console.warn("[useSyncUrlWithStore] router.replace (admin sync) failed:", err)
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
  }, [currentView, currentPage, router, searchParams])
}
