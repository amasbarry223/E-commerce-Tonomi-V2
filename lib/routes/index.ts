/**
 * Source unique de vérité pour toutes les routes et clés de page.
 * Déclaration des routes SPA : app/page.tsx (switch currentPage / currentView).
 */

// ——— Chemins URL (Next.js) ———
export const ROUTES = {
  /** Page d'accueil (SPA store/admin) */
  home: "/",
  /** Page de connexion admin */
  login: "/login",
} as const

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

/** Toutes les clés de page (store + admin) pour typage strict du router */
export const PAGES = {
  store: PAGES_STORE,
  admin: PAGES_ADMIN,
} as const
