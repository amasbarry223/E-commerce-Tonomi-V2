"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { StoreProvider, useStore } from "@/lib/store-context"
import { useAuthStore } from "@/lib/stores/auth-store"
import { StoreHeader } from "@/components/store/header"
import { StoreFooter } from "@/components/store/footer"
import { HomePage } from "@/components/store/home-page"
import { CatalogPage } from "@/components/store/catalog-page"
import { ProductPage } from "@/components/store/product-page"
import { CartPage } from "@/components/store/cart-page"
import { CheckoutPage } from "@/components/store/checkout-page"
import { AccountPage } from "@/components/store/account-page"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminLogin } from "@/components/admin/admin-login"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminProducts } from "@/components/admin/admin-products"
import { AdminCategories } from "@/components/admin/admin-categories"
import { AdminOrders } from "@/components/admin/admin-orders"
import { AdminCustomers } from "@/components/admin/admin-customers"
import { AdminAnalytics } from "@/components/admin/admin-analytics"
import { AdminPromos } from "@/components/admin/admin-promos"
import { AdminReviews } from "@/components/admin/admin-reviews"
import { AdminSettings } from "@/components/admin/admin-settings"
import { pageVariants, getReducedMotionConfig, defaultTransition } from "@/lib/animations"

const pageAnimationVariants = getReducedMotionConfig(pageVariants)

function AppContent() {
  const { currentView, currentPage, setCurrentView, navigate } = useStore()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  // Si authentifié mais currentView n'est pas admin, forcer le passage en mode admin
  useEffect(() => {
    if (isAuthenticated && currentView !== "admin") {
      setCurrentView("admin")
      navigate("dashboard")
    }
  }, [isAuthenticated, currentView, setCurrentView, navigate])

  // Admin view - vérification de l'authentification (sans Framer Motion)
  if (currentView === "admin" || isAuthenticated) {
    // Si non authentifié, afficher la page de login
    if (!isAuthenticated) {
      return <AdminLogin />
    }
    let adminContent
    switch (currentPage) {
      case "dashboard":
        adminContent = <AdminDashboard />
        break
      case "admin-products":
        adminContent = <AdminProducts />
        break
      case "admin-categories":
        adminContent = <AdminCategories />
        break
      case "admin-orders":
        adminContent = <AdminOrders />
        break
      case "admin-customers":
        adminContent = <AdminCustomers />
        break
      case "admin-analytics":
        adminContent = <AdminAnalytics />
        break
      case "admin-promos":
        adminContent = <AdminPromos />
        break
      case "admin-reviews":
        adminContent = <AdminReviews />
        break
      case "admin-settings":
        adminContent = <AdminSettings />
        break
      default:
        adminContent = <AdminDashboard />
    }

    return <AdminLayout>{adminContent}</AdminLayout>
  }

  // Store view
  let pageContent
  switch (currentPage) {
    case "home":
      pageContent = <HomePage />
      break
    case "catalog":
      pageContent = <CatalogPage />
      break
    case "product":
      pageContent = <ProductPage />
      break
    case "cart":
      pageContent = <CartPage />
      break
    case "checkout":
      pageContent = <CheckoutPage />
      break
    case "account":
      pageContent = <AccountPage />
      break
    case "wishlist":
      pageContent = <CatalogPage />
      break
    case "category":
      pageContent = <CatalogPage />
      break
    case "promotions":
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

