"use client"

import dynamic from "next/dynamic"
import type { ComponentType } from "react"
import { Suspense, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { StoreProvider, useNavigationStore } from "@/lib/store-context"
import { useSyncUrlWithStore } from "@/hooks/use-sync-url-with-store"
import { StoreHeader } from "@/components/store/shared/header"
import { StoreFooter } from "@/components/store/shared/footer"
import { StoreDocumentHead } from "@/components/store/shared/store-document-head"
import { pageVariants, getReducedMotionConfig, defaultTransition } from "@/lib/animations"
import { PAGES } from "@/lib/routes"
import type { StorePageKey, AdminPageKey } from "@/lib/routes"
import { getAdminPath } from "@/lib/auth/routes"
import { PageSkeleton } from "@/components/ui/page-skeleton"
import { ErrorBoundary } from "@/components/ui/error-boundary"

const HomePage = dynamic(() => import("@/components/store/pages/home-page").then((m) => ({ default: m.HomePage })), { loading: () => <PageSkeleton /> })
const CatalogPage = dynamic(() => import("@/components/store/pages/catalog-page").then((m) => ({ default: m.CatalogPage })), { loading: () => <PageSkeleton /> })
const ProductPage = dynamic(() => import("@/components/store/pages/product-page").then((m) => ({ default: m.ProductPage })), { loading: () => <PageSkeleton /> })
const CartPage = dynamic(() => import("@/components/store/pages/cart-page").then((m) => ({ default: m.CartPage })), { loading: () => <PageSkeleton /> })
const CheckoutPage = dynamic(() => import("@/components/store/pages/checkout-page").then((m) => ({ default: m.CheckoutPage })), { loading: () => <PageSkeleton /> })
const WishlistPage = dynamic(() => import("@/components/store/pages/wishlist-page").then((m) => ({ default: m.WishlistPage })), { loading: () => <PageSkeleton /> })
const AccountPage = dynamic(() => import("@/components/store/pages/account-page").then((m) => ({ default: m.AccountPage })), { loading: () => <PageSkeleton /> })
const InfoPage = dynamic(() => import("@/components/store/pages/info-page").then((m) => ({ default: m.InfoPage })), { loading: () => <PageSkeleton /> })

const pageAnimationVariants = getReducedMotionConfig(pageVariants)

const STORE_PAGE_MAP: Record<StorePageKey, ComponentType> = {
  [PAGES.store.home]: HomePage,
  [PAGES.store.catalog]: CatalogPage,
  [PAGES.store.product]: ProductPage,
  [PAGES.store.cart]: CartPage,
  [PAGES.store.checkout]: CheckoutPage,
  [PAGES.store.account]: AccountPage,
  [PAGES.store.wishlist]: WishlistPage,
  [PAGES.store.category]: CatalogPage,
  [PAGES.store.promotions]: CatalogPage,
  [PAGES.store.about]: InfoPage,
  [PAGES.store.delivery]: InfoPage,
  [PAGES.store.returns]: InfoPage,
  [PAGES.store.terms]: InfoPage,
  [PAGES.store.privacy]: InfoPage,
  [PAGES.store.faq]: InfoPage,
}

const STORE_PAGES_WITH_ERROR_BOUNDARY = new Set<StorePageKey>([PAGES.store.cart, PAGES.store.checkout])

function AppContent() {
  const { currentPage } = useNavigationStore()
  const searchParams = useSearchParams()
  const router = useRouter()

  useSyncUrlWithStore()

  // Focus sur le contenu principal après un changement de page (accessibilité clavier)
  useEffect(() => {
    document.getElementById("main-content")?.focus({ preventScroll: true })
  }, [currentPage])

  // Anciens liens ?view=admin&page=... : redirection vers le path correspondant (/dashboard, /admin/xxx)
  useEffect(() => {
    if (searchParams.get("view") !== "admin") return
    const pageParam = searchParams.get("page")
    const validKeys = Object.values(PAGES.admin) as string[]
    const adminPage: AdminPageKey = pageParam && validKeys.includes(pageParam) ? (pageParam as AdminPageKey) : PAGES.admin.dashboard
    router.replace(getAdminPath(adminPage))
  }, [searchParams, router])

  if (searchParams.get("view") === "admin") {
    return <PageSkeleton />
  }

  const displayPage = currentPage

  const StoreComponent = STORE_PAGE_MAP[displayPage as StorePageKey] ?? HomePage
  const pageContent = STORE_PAGES_WITH_ERROR_BOUNDARY.has(displayPage as StorePageKey) ? (
    <ErrorBoundary>
      <StoreComponent />
    </ErrorBoundary>
  ) : (
    <StoreComponent />
  )

  return (
    <div className="min-h-screen flex flex-col w-full">
      <StoreDocumentHead />
      <StoreHeader />
      <main id="main-content" className="flex-1 w-full" role="main" tabIndex={-1}>
        <AnimatePresence mode="wait">
          <motion.div
            key={displayPage}
            variants={pageAnimationVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={defaultTransition}
            className="w-full"
          >
            {pageContent}
          </motion.div>
        </AnimatePresence>
      </main>
      <StoreFooter />
    </div>
  )
}

export default function Home() {
  return (
    <StoreProvider>
      <Suspense fallback={<PageSkeleton />}>
        <AppContent />
      </Suspense>
    </StoreProvider>
  )
}

