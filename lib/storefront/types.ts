/**
 * Types pour le contexte storefront (panier, navigation, UI).
 */

import type { Product, CartItem, WishlistItem } from "@/lib/types"

export type { CartItem, WishlistItem }

export interface CartStoreContextType {
  cart: CartItem[]
  cartTotal: number
  cartCount: number
  promoDiscount: number
  appliedPromo: string | null
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string, color?: string, size?: string) => void
  updateCartQuantity: (productId: string, quantity: number, color?: string, size?: string) => void
  clearCart: () => void
  applyPromoCode: (code: string) => { success: boolean; discount: number; message: string }
}

/** État seul du panier (pour limiter les re-renders des composants qui n'ont besoin que des actions). */
export interface CartStateContextType {
  cart: CartItem[]
  cartTotal: number
  cartCount: number
  promoDiscount: number
  appliedPromo: string | null
  /** True tant que le panier n'a pas été restauré depuis le localStorage (évite le flash "panier vide"). */
  isRestoringCart: boolean
}

/** Actions seules du panier (références stables, ne provoquent pas de re-render quand le panier change). */
export interface CartActionsContextType {
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string, color?: string, size?: string) => void
  updateCartQuantity: (productId: string, quantity: number, color?: string, size?: string) => void
  clearCart: () => void
  applyPromoCode: (code: string) => { success: boolean; discount: number; message: string }
}

export interface NavigationStoreContextType {
  currentView: "store" | "admin"
  currentPage: string
  selectedProductId: string | null
  selectedCategoryId: string | null
  selectedOrderId: string | null
  selectedCustomerId: string | null
  searchQuery: string
  navigate: (page: string) => void
  setCurrentView: (view: "store" | "admin") => void
  selectProduct: (id: string | null) => void
  selectCategory: (id: string | null) => void
  selectOrder: (id: string | null) => void
  selectCustomer: (id: string | null) => void
  setSearchQuery: (query: string) => void
  getProduct: (id: string) => Product | undefined
}

export interface UIStoreContextType {
  wishlist: WishlistItem[]
  compareList: string[]
  darkMode: boolean
  newsletterSubscribed: boolean
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleCompare: (productId: string) => void
  isInCompare: (productId: string) => boolean
  toggleDarkMode: () => void
  subscribeNewsletter: () => void
}

export interface StoreState {
  cart: CartItem[]
  wishlist: WishlistItem[]
  compareList: string[]
  darkMode: boolean
  currentView: "store" | "admin"
  currentPage: string
  selectedProductId: string | null
  selectedCategoryId: string | null
  selectedOrderId: string | null
  selectedCustomerId: string | null
  searchQuery: string
  newsletterSubscribed: boolean
}

export interface StoreContextType extends StoreState {
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string, color?: string, size?: string) => void
  updateCartQuantity: (productId: string, quantity: number, color?: string, size?: string) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleCompare: (productId: string) => void
  isInCompare: (productId: string) => boolean
  toggleDarkMode: () => void
  navigate: (page: string) => void
  setCurrentView: (view: "store" | "admin") => void
  selectProduct: (id: string | null) => void
  selectCategory: (id: string | null) => void
  selectOrder: (id: string | null) => void
  selectCustomer: (id: string | null) => void
  setSearchQuery: (query: string) => void
  subscribeNewsletter: () => void
  getProduct: (id: string) => Product | undefined
  applyPromoCode: (code: string) => { success: boolean; discount: number; message: string }
  promoDiscount: number
  appliedPromo: string | null
}
