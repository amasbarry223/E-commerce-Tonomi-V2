"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from "react"
import { products as initialProducts, promoCodes, type Product } from "./data"
import { PAGES } from "./routes"
import { promoCodeInputSchema } from "@/src/lib/utils/validation"

// ==========================================
// TYPES
// ==========================================

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  color?: string
  size?: string
  quantity: number
}

export interface WishlistItem {
  productId: string
}

interface StoreState {
  cart: CartItem[]
  wishlist: WishlistItem[]
  compareList: string[]
  darkMode: boolean
  currentView: "store" | "admin"
  currentPage: string
  selectedProductId: string | null
  selectedCategorySlug: string | null
  selectedOrderId: string | null
  selectedCustomerId: string | null
  searchQuery: string
  newsletterSubscribed: boolean
}

interface StoreContextType extends StoreState {
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

const STORAGE_KEYS = { cart: "tonomi_cart", wishlist: "tonomi_wishlist" } as const

function loadPersistedCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.cart)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function loadPersistedWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.wishlist)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const StoreContext = createContext<StoreContextType | undefined>(undefined)

const defaultStoreState: StoreState = {
  cart: [],
  wishlist: [],
  compareList: [],
  darkMode: false,
  currentView: "store",
  currentPage: PAGES.store.home,
  selectedProductId: null,
  selectedCategorySlug: null,
  selectedOrderId: null,
  selectedCustomerId: null,
  searchQuery: "",
  newsletterSubscribed: false,
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(() => ({
    ...defaultStoreState,
    cart: loadPersistedCart(),
    wishlist: loadPersistedWishlist(),
  }))

  const [promoDiscount, setPromoDiscount] = useState(0)
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)

  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [state.darkMode])

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(state.cart))
    } catch {
      // ignore quota or parse errors
    }
  }, [state.cart])

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(state.wishlist))
    } catch {
      // ignore
    }
  }, [state.wishlist])

  const addToCart = useCallback((item: CartItem) => {
    setState(prev => {
      const existingIndex = prev.cart.findIndex(
        c => c.productId === item.productId && c.color === item.color && c.size === item.size
      )
      if (existingIndex >= 0) {
        const newCart = [...prev.cart]
        newCart[existingIndex] = { ...newCart[existingIndex], quantity: newCart[existingIndex].quantity + item.quantity }
        return { ...prev, cart: newCart }
      }
      return { ...prev, cart: [...prev.cart, item] }
    })
  }, [])

  const removeFromCart = useCallback((productId: string, color?: string, size?: string) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(c => !(c.productId === productId && c.color === color && c.size === size))
    }))
  }, [])

  const updateCartQuantity = useCallback((productId: string, quantity: number, color?: string, size?: string) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.map(c =>
        c.productId === productId && c.color === color && c.size === size
          ? { ...c, quantity: Math.max(1, quantity) }
          : c
      )
    }))
  }, [])

  const clearCart = useCallback(() => {
    setState(prev => ({ ...prev, cart: [] }))
    setPromoDiscount(0)
    setAppliedPromo(null)
  }, [])

  const cartTotal = useMemo(
    () => state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.cart]
  )
  const cartCount = useMemo(
    () => state.cart.reduce((sum, item) => sum + item.quantity, 0),
    [state.cart]
  )

  const toggleWishlist = useCallback((productId: string) => {
    setState(prev => {
      const exists = prev.wishlist.some(w => w.productId === productId)
      return {
        ...prev,
        wishlist: exists
          ? prev.wishlist.filter(w => w.productId !== productId)
          : [...prev.wishlist, { productId }]
      }
    })
  }, [])

  const isInWishlist = useCallback((productId: string) => {
    return state.wishlist.some(w => w.productId === productId)
  }, [state.wishlist])

  const toggleCompare = useCallback((productId: string) => {
    setState(prev => {
      const exists = prev.compareList.includes(productId)
      if (exists) return { ...prev, compareList: prev.compareList.filter(id => id !== productId) }
      if (prev.compareList.length >= 4) return prev
      return { ...prev, compareList: [...prev.compareList, productId] }
    })
  }, [])

  const isInCompare = useCallback((productId: string) => {
    return state.compareList.includes(productId)
  }, [state.compareList])

  const toggleDarkMode = useCallback(() => {
    setState(prev => ({ ...prev, darkMode: !prev.darkMode }))
  }, [])

  const navigate = useCallback((page: string) => {
    setState(prev => ({ ...prev, currentPage: page }))
    window.scrollTo(0, 0)
  }, [])

  const setCurrentView = useCallback((view: "store" | "admin") => {
    setState(prev => ({ ...prev, currentView: view, currentPage: view === "admin" ? PAGES.admin.dashboard : PAGES.store.home }))
  }, [])

  const selectProduct = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedProductId: id }))
  }, [])

  const selectCategory = useCallback((slug: string | null) => {
    setState(prev => ({ ...prev, selectedCategorySlug: slug }))
  }, [])

  const selectOrder = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedOrderId: id }))
  }, [])

  const selectCustomer = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedCustomerId: id }))
  }, [])

  const setSearchQuery = useCallback((query: string) => {
    const MAX_SEARCH_LENGTH = 200
    const truncated = query.length > MAX_SEARCH_LENGTH ? query.slice(0, MAX_SEARCH_LENGTH) : query
    setState((prev) => ({ ...prev, searchQuery: truncated }))
  }, [])

  const subscribeNewsletter = useCallback(() => {
    setState(prev => ({ ...prev, newsletterSubscribed: true }))
  }, [])

  const getProduct = useCallback((id: string) => {
    return initialProducts.find(p => p.id === id)
  }, [])

  const applyPromoCode = useCallback((code: string): { success: boolean; discount: number; message: string } => {
    const parsed = promoCodeInputSchema.safeParse(code)
    if (!parsed.success) {
      return { success: false, discount: 0, message: parsed.error.errors[0]?.message ?? "Code invalide" }
    }
    const normalizedCode = parsed.data
    const currentCartTotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const promo = promoCodes.find(p => p.code === normalizedCode && p.active)
    if (!promo) return { success: false, discount: 0, message: "Code promo invalide" }
    if (promo.usedCount >= promo.maxUses) return { success: false, discount: 0, message: "Code promo expiré" }
    if (promo.minAmount && currentCartTotal < promo.minAmount) return { success: false, discount: 0, message: `Montant minimum de ${promo.minAmount}€ requis` }

    const discount = promo.type === "percentage" ? (currentCartTotal * promo.value) / 100 : promo.value
    setPromoDiscount(discount)
    setAppliedPromo(promo.code)
    return { success: true, discount, message: `Code ${promo.code} appliqué !` }
  }, [state.cart])

  const contextValue = useMemo(
    () => ({
      ...state,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartTotal,
      cartCount,
      toggleWishlist,
      isInWishlist,
      toggleCompare,
      isInCompare,
      toggleDarkMode,
      navigate,
      setCurrentView,
      selectProduct,
      selectCategory,
      selectOrder,
      selectCustomer,
      setSearchQuery,
      subscribeNewsletter,
      getProduct,
      applyPromoCode,
      promoDiscount,
      appliedPromo,
    }),
    [
      state,
      cartTotal,
      cartCount,
      promoDiscount,
      appliedPromo,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      isInWishlist,
      toggleCompare,
      isInCompare,
      toggleDarkMode,
      navigate,
      setCurrentView,
      selectProduct,
      selectCategory,
      selectOrder,
      selectCustomer,
      setSearchQuery,
      subscribeNewsletter,
      getProduct,
      applyPromoCode,
    ]
  )

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error("useStore must be used within StoreProvider")
  return context
}
