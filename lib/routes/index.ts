/**
 * Source unique de vérité pour toutes les routes et clés de page.
 * Déclaration des routes SPA : app/page.tsx (switch currentPage / currentView).
 */

// ——— Chemins URL (Next.js) ———
export const ROUTES = {
  home: "/",
  homeAdmin: "/?view=admin",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  account: "/account",
  accountOrders: "/account/orders",
  accountProfile: "/account/profile",
  checkout: "/checkout",
  cart: "/cart",
  products: "/products",
  forbidden: "/403",
  admin: "/admin",
  adminProducts: "/admin/products",
  adminOrders: "/admin/orders",
  adminUsers: "/admin/users",
  adminAnalytics: "/admin/analytics",
} as const

export const AUTH_COOKIE_NAME = "tonomi-auth"
export const REDIRECT_QUERY = "redirect"
export const SESSION_EXPIRED_QUERY = "sessionExpired"

export type PathRoute = (typeof ROUTES)[keyof typeof ROUTES]

// ——— Clés de page SPA (store) ———
export const PAGES_STORE = {
  home: "home",
  catalog: "catalog",
  product: "product",
  cart: "cart",
  checkout: "checkout",
  account: "account",
  wishlist: "wishlist",
  category: "category",
  promotions: "promotions",
} as const

// ——— Clés de page SPA (admin) ———
export const PAGES_ADMIN = {
  dashboard: "dashboard",
  products: "admin-products",
  categories: "admin-categories",
  heroSlides: "admin-hero-slides",
  orders: "admin-orders",
  customers: "admin-customers",
  analytics: "admin-analytics",
  promos: "admin-promos",
  reviews: "admin-reviews",
  settings: "admin-settings",
} as const

export type StorePageKey = (typeof PAGES_STORE)[keyof typeof PAGES_STORE]
export type AdminPageKey = (typeof PAGES_ADMIN)[keyof typeof PAGES_ADMIN]
export type PageKey = StorePageKey | AdminPageKey

/** Mapping segment URL /admin/<slug> vers clé de page SPA admin (pour redirection catch-all). */
export const ADMIN_SLUG_TO_PAGE: Record<string, AdminPageKey> = {
  dashboard: PAGES_ADMIN.dashboard,
  products: PAGES_ADMIN.products,
  categories: PAGES_ADMIN.categories,
  "hero-slides": PAGES_ADMIN.heroSlides,
  orders: PAGES_ADMIN.orders,
  customers: PAGES_ADMIN.customers,
  analytics: PAGES_ADMIN.analytics,
  promos: PAGES_ADMIN.promos,
  reviews: PAGES_ADMIN.reviews,
  settings: PAGES_ADMIN.settings,
}

/** Toutes les clés de page (store + admin) pour typage strict du router */
export const PAGES = {
  store: PAGES_STORE,
  admin: PAGES_ADMIN,
} as const
