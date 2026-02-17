/**
 * Wrapper de compatibilité pour l'ancien StoreContext
 * Permet la transition progressive vers Zustand
 */
"use client"

import { createContext, useContext } from 'react'
import { useCartStore } from './stores/cart-store'
import { useWishlistStore } from './stores/wishlist-store'
import { useUIStore } from './stores/ui-store'
import { useProducts } from './hooks/use-products'
import { promoCodes } from '@/lib/data'
import type { CartItem, WishlistItem, Product } from './types'

interface StoreContextType {
  cart: CartItem[]
  wishlist: WishlistItem[]
  compareList: string[]
  darkMode: boolean
  currentView: 'store' | 'admin'
  currentPage: string
  selectedProductId: string | null
  selectedCategorySlug: string | null
  selectedOrderId: string | null
  selectedCustomerId: string | null
  searchQuery: string
  newsletterSubscribed: boolean
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
  setCurrentView: (view: 'store' | 'admin') => void
  selectProduct: (id: string | null) => void
  selectCategory: (slug: string | null) => void
  selectOrder: (id: string | null) => void
  selectCustomer: (id: string | null) => void
  setSearchQuery: (query: string) => void
  subscribeNewsletter: () => void
  getProduct: (id: string) => Product | undefined
  applyPromoCode: (code: string) => { success: boolean; discount: number; message: string }
  promoDiscount: number
  appliedPromo: string | null
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProviderCompat({ children }: { children: React.ReactNode }) {
  const cartStore = useCartStore()
  const wishlistStore = useWishlistStore()
  const uiStore = useUIStore()
  const { getProduct: getProductFromHook } = useProducts()
  
  // TODO: Implement compareList, newsletterSubscribed, promoDiscount in stores
  const compareList: string[] = []
  const newsletterSubscribed = false
  const promoDiscount = 0
  const appliedPromo: string | null = null
  
  const value: StoreContextType = {
    cart: cartStore.items,
    wishlist: wishlistStore.items,
    compareList,
    darkMode: uiStore.darkMode,
    currentView: uiStore.currentView,
    currentPage: uiStore.currentPage,
    selectedProductId: uiStore.selectedProductId,
    selectedCategorySlug: uiStore.selectedCategorySlug,
    selectedOrderId: null, // TODO: Add to UI store if needed
    selectedCustomerId: null, // TODO: Add to UI store if needed
    searchQuery: uiStore.searchQuery,
    newsletterSubscribed,
    addToCart: cartStore.addItem,
    removeFromCart: cartStore.removeItem,
    updateCartQuantity: cartStore.updateQuantity,
    clearCart: cartStore.clearCart,
    cartTotal: cartStore.getTotal(),
    cartCount: cartStore.getCount(),
    toggleWishlist: wishlistStore.toggle,
    isInWishlist: wishlistStore.isInWishlist,
    toggleCompare: () => {}, // TODO: Implement
    isInCompare: () => false, // TODO: Implement
    toggleDarkMode: uiStore.toggleDarkMode,
    navigate: uiStore.navigate,
    setCurrentView: uiStore.setCurrentView,
    selectProduct: uiStore.selectProduct,
    selectCategory: uiStore.selectCategory,
    selectOrder: () => {}, // TODO: Implement
    selectCustomer: () => {}, // TODO: Implement
    setSearchQuery: uiStore.setSearchQuery,
    subscribeNewsletter: () => {}, // TODO: Implement
    getProduct: getProductFromHook,
    applyPromoCode: (code: string) => {
      const promo = promoCodes.find((p) => p.code === code.toUpperCase() && p.active)
      if (!promo) return { success: false, discount: 0, message: 'Code promo invalide' }
      if (promo.usedCount >= promo.maxUses) return { success: false, discount: 0, message: 'Code promo expiré' }
      const cartTotal = cartStore.getTotal()
      if (promo.minAmount && cartTotal < promo.minAmount) {
        return { success: false, discount: 0, message: `Montant minimum de ${promo.minAmount}€ requis` }
      }
      // TODO: Store promo discount in a store
      return { success: true, discount: 0, message: `Code ${promo.code} appliqué !` }
    },
    promoDiscount,
    appliedPromo,
  }
  
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStoreCompat() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStoreCompat must be used within StoreProviderCompat')
  return context
}

