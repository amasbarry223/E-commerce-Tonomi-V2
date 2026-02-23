"use client"

import dynamic from "next/dynamic"
import type { ComponentType } from "react"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { StoreProvider, useNavigationStore } from "@/lib/store-context"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useSyncUrlWithStore } from "@/hooks/use-sync-url-with-store"
import { StoreHeader } from "@/components/store/shared/header"
import { StoreFooter } from "@/components/store/shared/footer"
import { StoreDocumentHead } from "@/components/store/shared/store-document-head"
import { pageVariants, getReducedMotionConfig, defaultTransition } from "@/lib/animations"
import { PAGES } from "@/lib/routes"
import type { StorePageKey, AdminPageKey } from "@/lib/routes"
import { ProtectedRoute } from "@/lib/guards"
import { PageSkeleton } from "@/components/ui/page-skeleton"
import { ErrorBoundary } from "@/components/ui/error-boundary"

const HomePage = dynamic(() => import("@/components/store/pages/home-page").then((m) => ({ default: m.HomePage })), { loading: () => <PageSkeleton /> })
const CatalogPage = dynamic(() => import("@/components/store/pages/catalog-page").then((m) => ({ default: m.CatalogPage })), { loading: () => <PageSkeleton /> })
const ProductPage = dynamic(() => import("@/components/store/pages/product-page").then((m) => ({ default: m.ProductPage })), { loading: () => <PageSkeleton /> })
const CartPage = dynamic(() => import("@/components/store/pages/cart-page").then((m) => ({ default: m.CartPage })), { loading: () => <PageSkeleton /> })
const CheckoutPage = dynamic(() => import("@/components/store/pages/checkout-page").then((m) => ({ default: m.CheckoutPage })), { loading: () => <PageSkeleton /> })
const WishlistPage = dynamic(() => import("@/components/store/pages/wishlist-page").then((m) => ({ default: m.WishlistPage })), { loading: () => <PageSkeleton /> })
const AccountPage = dynamic(() => import("@/components/store/pages/account-page").then((m) => ({ default: m.AccountPage })), { loading: () => <PageSkeleton /> })
const AdminLayout = dynamic(() => import("@/components/admin/admin-layout").then((m) => ({ default: m.AdminLayout })), { loading: () => <PageSkeleton /> })
const AdminDashboard = dynamic(() => import("@/components/admin/admin-dashboard").then((m) => ({ default: m.AdminDashboard })), { loading: () => <PageSkeleton /> })
const AdminProducts = dynamic(() => import("@/components/admin/admin-products").then((m) => ({ default: m.AdminProducts })), { loading: () => <PageSkeleton /> })
const AdminCategories = dynamic(() => import("@/components/admin/admin-categories").then((m) => ({ default: m.AdminCategories })), { loading: () => <PageSkeleton /> })
const AdminOrders = dynamic(() => import("@/components/admin/admin-orders").then((m) => ({ default: m.AdminOrders })), { loading: () => <PageSkeleton /> })
const AdminCustomers = dynamic(() => import("@/components/admin/admin-customers").then((m) => ({ default: m.AdminCustomers })), { loading: () => <PageSkeleton /> })
const AdminAnalytics = dynamic(() => import("@/components/admin/admin-analytics").then((m) => ({ default: m.AdminAnalytics })), { loading: () => <PageSkeleton /> })
const AdminPromos = dynamic(() => import("@/components/admin/admin-promos").then((m) => ({ default: m.AdminPromos })), { loading: () => <PageSkeleton /> })
const AdminReviews = dynamic(() => import("@/components/admin/admin-reviews").then((m) => ({ default: m.AdminReviews })), { loading: () => <PageSkeleton /> })
const AdminSettings = dynamic(() => import("@/components/admin/admin-settings").then((m) => ({ default: m.AdminSettings })), { loading: () => <PageSkeleton /> })
const AdminHeroSlides = dynamic(() => import("@/components/admin/admin-hero-slides").then((m) => ({ default: m.AdminHeroSlides })), { loading: () => <PageSkeleton /> })

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
}

const ADMIN_PAGE_MAP: Record<AdminPageKey, ComponentType> = {
  [PAGES.admin.dashboard]: AdminDashboard,
  [PAGES.admin.products]: AdminProducts,
  [PAGES.admin.categories]: AdminCategories,
  [PAGES.admin.heroSlides]: AdminHeroSlides,
  [PAGES.admin.orders]: AdminOrders,
  [PAGES.admin.customers]: AdminCustomers,
  [PAGES.admin.analytics]: AdminAnalytics,
  [PAGES.admin.promos]: AdminPromos,
  [PAGES.admin.reviews]: AdminReviews,
  [PAGES.admin.settings]: AdminSettings,
}

/** Clés de page admin valides pour afficher la bonne vue dès le premier rendu (éviter flash boutique). */
const ADMIN_PAGE_KEYS = new Set<string>(Object.values(PAGES.admin))

const STORE_PAGES_WITH_ERROR_BOUNDARY = new Set<StorePageKey>([PAGES.store.cart, PAGES.store.checkout])

function AppContent() {
  const { currentView, currentPage } = useNavigationStore()
  const searchParams = useSearchParams()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const hasHydrated = useAuthStore((s) => s._hasHydrated)

  useSyncUrlWithStore()

  const urlViewAdmin = searchParams.get("view") === "admin"
  const displayView =
    urlViewAdmin && isAuthenticated && hasHydrated
      ? "admin"
      : urlViewAdmin && !hasHydrated
        ? "pending"
        : currentView
  const pageParam = searchParams.get("page")
  const displayPage =
    displayView === "admin"
      ? (pageParam && ADMIN_PAGE_KEYS.has(pageParam) ? pageParam : PAGES.admin.dashboard)
      : currentPage

  // Éviter le flash boutique : tant que l’URL est admin et qu’on n’a pas encore hydraté l’auth, afficher le skeleton
  if (displayView === "pending") {
    return <PageSkeleton />
  }

  if (displayView === "admin") {
    const AdminComponent = ADMIN_PAGE_MAP[displayPage as AdminPageKey] ?? AdminDashboard
    const adminContent = <AdminComponent />

    return (
      <ProtectedRoute>
        <ErrorBoundary>
          <AdminLayout>{adminContent}</AdminLayout>
        </ErrorBoundary>
      </ProtectedRoute>
    )
  }

  // Store view
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

