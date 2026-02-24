/**
 * Source unique de vérité pour toutes les routes et clés de page.
 *
 * Routes publiques  : /, /login, /register, /forgot-password, /reset-password, /products, /categories
 * Routes protégées  : /dashboard, /admin/*, /account, /account/orders, /account/profile
 * NOTE : /?view=admin est un pattern obsolète — le middleware le redirige vers /dashboard ou /admin/<slug>.
 */

// ——— Chemins URL (Next.js) ———
export const ROUTES = {
  // Boutique publique
  home: "/",
  products: "/products",
  // Protégées — authentification requise (désormais publiques)
  dashboard: "/dashboard",
  account: "/account",
  accountOrders: "/account/orders",
  accountProfile: "/account/profile",
  // Admin — authentification + rôle admin requis (désormais publiques)
  admin: "/admin",
  adminProducts: "/admin/products",
  adminOrders: "/admin/orders",
  adminUsers: "/admin/users",
  adminAnalytics: "/admin/analytics",
  // Autres
  cart: "/cart",
  checkout: "/checkout",
  forbidden: "/403",
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

/** Mapping clé de page admin → segment path pour /admin/<segment> (dashboard reste /dashboard). */
export const ADMIN_PAGE_TO_SLUG: Record<AdminPageKey, string> = {
  [PAGES_ADMIN.dashboard]: "",
  [PAGES_ADMIN.products]: "products",
  [PAGES_ADMIN.categories]: "categories",
  [PAGES_ADMIN.heroSlides]: "hero-slides",
  [PAGES_ADMIN.orders]: "orders",
  [PAGES_ADMIN.customers]: "customers",
  [PAGES_ADMIN.analytics]: "analytics",
  [PAGES_ADMIN.promos]: "promos",
  [PAGES_ADMIN.reviews]: "reviews",
  [PAGES_ADMIN.settings]: "settings",
}

/** Toutes les clés de page (store + admin) pour typage strict du router */
export const PAGES = {
  store: PAGES_STORE,
  admin: PAGES_ADMIN,
} as const
