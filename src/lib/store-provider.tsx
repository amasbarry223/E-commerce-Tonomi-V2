/**
 * Provider de compatibilité qui utilise Zustand mais expose l'interface de l'ancien StoreContext
 * Permet une migration progressive sans casser les composants existants
 */
"use client"

import { createContext, useContext, useMemo } from 'react'
import { useCartStore } from './stores/cart-store'
import { useWishlistStore } from './stores/wishlist-store'
import { useUIStore } from './stores/ui-store'
import { usePromoStore } from './stores/promo-store'
import { useProducts } from './hooks/use-products'
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

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Utiliser les stores Zustand
  const cartItems = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const clearCart = useCartStore((state) => state.clearCart)
  const cartTotal = useCartStore((state) => state.getTotal())
  const cartCount = useCartStore((state) => state.getCount())
  
  const wishlistItems = useWishlistStore((state) => state.items)
  const toggleWishlist = useWishlistStore((state) => state.toggle)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist)
  
  const darkMode = useUIStore((state) => state.darkMode)
  const currentView = useUIStore((state) => state.currentView)
  const currentPage = useUIStore((state) => state.currentPage)
  const selectedProductId = useUIStore((state) => state.selectedProductId)
  const selectedCategorySlug = useUIStore((state) => state.selectedCategorySlug)
  const searchQuery = useUIStore((state) => state.searchQuery)
  const toggleDarkMode = useUIStore((state) => state.toggleDarkMode)
  const navigate = useUIStore((state) => state.navigate)
  const setCurrentView = useUIStore((state) => state.setCurrentView)
  const selectProduct = useUIStore((state) => state.selectProduct)
  const selectCategory = useUIStore((state) => state.selectCategory)
  const setSearchQuery = useUIStore((state) => state.setSearchQuery)
  
  const { getProduct } = useProducts()
  
  const appliedPromo = usePromoStore((state) => state.appliedPromo)
  const promoDiscount = usePromoStore((state) => state.promoDiscount)
  const applyPromoCode = usePromoStore((state) => state.applyPromoCode)
  
  // TODO: Implémenter dans les stores si nécessaire
  const compareList: string[] = []
  const newsletterSubscribed = false
  
  const value = useMemo<StoreContextType>(() => ({
    cart: cartItems,
    wishlist: wishlistItems,
    compareList,
    darkMode,
    currentView,
    currentPage,
    selectedProductId,
    selectedCategorySlug,
    selectedOrderId: null,
    selectedCustomerId: null,
    searchQuery,
    newsletterSubscribed,
    addToCart: addItem,
    removeFromCart: removeItem,
    updateCartQuantity: updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    toggleWishlist,
    isInWishlist,
    toggleCompare: () => {}, // TODO: Implémenter
    isInCompare: () => false, // TODO: Implémenter
    toggleDarkMode,
    navigate,
    setCurrentView,
    selectProduct,
    selectCategory,
    selectOrder: () => {}, // TODO: Implémenter
    selectCustomer: () => {}, // TODO: Implémenter
    setSearchQuery,
    subscribeNewsletter: () => {}, // TODO: Implémenter
    getProduct,
    applyPromoCode: (code: string) => applyPromoCode(code, cartTotal),
    promoDiscount,
    appliedPromo,
  }), [
    cartItems, wishlistItems, compareList, darkMode, currentView, currentPage,
    selectedProductId, selectedCategorySlug, searchQuery, newsletterSubscribed,
    addItem, removeItem, updateQuantity, clearCart, cartTotal, cartCount,
    toggleWishlist, isInWishlist, toggleDarkMode, navigate, setCurrentView,
    selectProduct, selectCategory, setSearchQuery, getProduct
  ])
  
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used within StoreProvider')
  return context
}

