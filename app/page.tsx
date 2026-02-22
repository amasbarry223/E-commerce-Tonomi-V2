"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"
import { AnimatePresence, motion } from "framer-motion"
import { StoreProvider, useStore } from "@/lib/store-context"
import { useAuthStore } from "@/lib/stores/auth-store"
import { StoreHeader } from "@/components/store/header"
import { StoreFooter } from "@/components/store/footer"
import { HomePage } from "@/components/store/home-page"
import { pageVariants, getReducedMotionConfig, defaultTransition } from "@/lib/animations"
import { PAGES } from "@/lib/routes"
import { ProtectedRoute } from "@/lib/guards"
import { PageSkeleton } from "@/components/ui/page-skeleton"

const CatalogPage = dynamic(() => import("@/components/store/catalog-page").then((m) => ({ default: m.CatalogPage })), { loading: () => <PageSkeleton /> })
const ProductPage = dynamic(() => import("@/components/store/product-page").then((m) => ({ default: m.ProductPage })), { loading: () => <PageSkeleton /> })
const CartPage = dynamic(() => import("@/components/store/cart-page").then((m) => ({ default: m.CartPage })), { loading: () => <PageSkeleton /> })
const CheckoutPage = dynamic(() => import("@/components/store/checkout-page").then((m) => ({ default: m.CheckoutPage })), { loading: () => <PageSkeleton /> })
const WishlistPage = dynamic(() => import("@/components/store/wishlist-page").then((m) => ({ default: m.WishlistPage })), { loading: () => <PageSkeleton /> })
const AccountPage = dynamic(() => import("@/components/store/account-page").then((m) => ({ default: m.AccountPage })), { loading: () => <PageSkeleton /> })
const AdminLayout = dynamic(() => import("@/components/admin/admin-layout").then((m) => ({ default: m.AdminLayout })), { loading: () => <PageSkeleton /> })
const AdminLogin = dynamic(() => import("@/components/admin/admin-login").then((m) => ({ default: m.AdminLogin })), { loading: () => <PageSkeleton /> })
const AdminDashboard = dynamic(() => import("@/components/admin/admin-dashboard").then((m) => ({ default: m.AdminDashboard })), { loading: () => <PageSkeleton /> })
const AdminProducts = dynamic(() => import("@/components/admin/admin-products").then((m) => ({ default: m.AdminProducts })), { loading: () => <PageSkeleton /> })
const AdminCategories = dynamic(() => import("@/components/admin/admin-categories").then((m) => ({ default: m.AdminCategories })), { loading: () => <PageSkeleton /> })
const AdminOrders = dynamic(() => import("@/components/admin/admin-orders").then((m) => ({ default: m.AdminOrders })), { loading: () => <PageSkeleton /> })
const AdminCustomers = dynamic(() => import("@/components/admin/admin-customers").then((m) => ({ default: m.AdminCustomers })), { loading: () => <PageSkeleton /> })
const AdminAnalytics = dynamic(() => import("@/components/admin/admin-analytics").then((m) => ({ default: m.AdminAnalytics })), { loading: () => <PageSkeleton /> })
const AdminPromos = dynamic(() => import("@/components/admin/admin-promos").then((m) => ({ default: m.AdminPromos })), { loading: () => <PageSkeleton /> })
const AdminReviews = dynamic(() => import("@/components/admin/admin-reviews").then((m) => ({ default: m.AdminReviews })), { loading: () => <PageSkeleton /> })
const AdminSettings = dynamic(() => import("@/components/admin/admin-settings").then((m) => ({ default: m.AdminSettings })), { loading: () => <PageSkeleton /> })

const pageAnimationVariants = getReducedMotionConfig(pageVariants)

function AppContent() {
  const { currentView, currentPage, setCurrentView, navigate } = useStore()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  // Si authentifié mais currentView n'est pas admin, forcer le passage en mode admin
  useEffect(() => {
    if (isAuthenticated && currentView !== "admin") {
      setCurrentView("admin")
      navigate(PAGES.admin.dashboard)
    }
  }, [isAuthenticated, currentView, setCurrentView, navigate])

  // Admin view - protection par guard (fallback = page login)
  if (currentView === "admin" || isAuthenticated) {
    let adminContent
    switch (currentPage) {
      case PAGES.admin.dashboard:
        adminContent = <AdminDashboard />
        break
      case PAGES.admin.products:
        adminContent = <AdminProducts />
        break
      case PAGES.admin.categories:
        adminContent = <AdminCategories />
        break
      case PAGES.admin.orders:
        adminContent = <AdminOrders />
        break
      case PAGES.admin.customers:
        adminContent = <AdminCustomers />
        break
      case PAGES.admin.analytics:
        adminContent = <AdminAnalytics />
        break
      case PAGES.admin.promos:
        adminContent = <AdminPromos />
        break
      case PAGES.admin.reviews:
        adminContent = <AdminReviews />
        break
      case PAGES.admin.settings:
        adminContent = <AdminSettings />
        break
      default:
        adminContent = <AdminDashboard />
    }

    return (
      <ProtectedRoute fallback={<AdminLogin />}>
        <AdminLayout>{adminContent}</AdminLayout>
      </ProtectedRoute>
    )
  }

  // Store view
  let pageContent
  switch (currentPage) {
    case PAGES.store.home:
      pageContent = <HomePage />
      break
    case PAGES.store.catalog:
      pageContent = <CatalogPage />
      break
    case PAGES.store.product:
      pageContent = <ProductPage />
      break
    case PAGES.store.cart:
      pageContent = <CartPage />
      break
    case PAGES.store.checkout:
      pageContent = <CheckoutPage />
      break
    case PAGES.store.account:
      pageContent = <AccountPage />
      break
    case PAGES.store.wishlist:
      pageContent = <WishlistPage />
      break
    case PAGES.store.category:
      pageContent = <CatalogPage />
      break
    case PAGES.store.promotions:
      pageContent = <CatalogPage />
      break
    default:
      pageContent = <HomePage />
  }

  return (
    <div className="min-h-screen flex flex-col w-full">
      <StoreHeader />
      <main id="main-content" className="flex-1 w-full" role="main" tabIndex={-1}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
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
      <AppContent />
    </StoreProvider>
  )
}

