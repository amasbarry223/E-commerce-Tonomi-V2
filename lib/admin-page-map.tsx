"use client"

import dynamic from "next/dynamic"
import type { ComponentType } from "react"
import { PAGES } from "@/lib/routes"
import type { AdminPageKey } from "@/lib/routes"
import { ADMIN_SLUG_TO_PAGE } from "@/lib/routes"
import { PageSkeleton } from "@/components/ui/page-skeleton"

const AdminDashboard = dynamic(() => import("@/components/admin/admin-dashboard").then((m) => ({ default: m.AdminDashboard })), { loading: () => <PageSkeleton /> })
const AdminProducts = dynamic(() => import("@/components/admin/admin-products").then((m) => ({ default: m.AdminProducts })), { loading: () => <PageSkeleton /> })
const AdminCategories = dynamic(() => import("@/components/admin/admin-categories").then((m) => ({ default: m.AdminCategories })), { loading: () => <PageSkeleton /> })
const AdminHeroSlides = dynamic(() => import("@/components/admin/admin-hero-slides").then((m) => ({ default: m.AdminHeroSlides })), { loading: () => <PageSkeleton /> })
const AdminOrders = dynamic(() => import("@/components/admin/admin-orders").then((m) => ({ default: m.AdminOrders })), { loading: () => <PageSkeleton /> })
const AdminCustomers = dynamic(() => import("@/components/admin/admin-customers").then((m) => ({ default: m.AdminCustomers })), { loading: () => <PageSkeleton /> })
const AdminAnalytics = dynamic(() => import("@/components/admin/admin-analytics").then((m) => ({ default: m.AdminAnalytics })), { loading: () => <PageSkeleton /> })
const AdminPromos = dynamic(() => import("@/components/admin/admin-promos").then((m) => ({ default: m.AdminPromos })), { loading: () => <PageSkeleton /> })
const AdminReviews = dynamic(() => import("@/components/admin/admin-reviews").then((m) => ({ default: m.AdminReviews })), { loading: () => <PageSkeleton /> })
const AdminSettings = dynamic(() => import("@/components/admin/admin-settings").then((m) => ({ default: m.AdminSettings })), { loading: () => <PageSkeleton /> })

export const ADMIN_PAGE_MAP: Record<AdminPageKey, ComponentType> = {
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

export function getAdminPageKeyFromSlug(slug: string | undefined): AdminPageKey {
  const segment = slug ?? "dashboard"
  return ADMIN_SLUG_TO_PAGE[segment] ?? PAGES.admin.dashboard
}
