"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef, type ReactNode } from "react"
import { getProducts, getPromoCodes } from "@/lib/services"
import type { CartItem, WishlistItem } from "@/lib/types"
import { PAGES } from "@/lib/routes"
import { promoCodeInputSchema } from "@/lib/utils/validation"
import {
  CartStateContext,
  CartActionsContext,
  defaultCartState,
} from "./cart-context"
import { NavigationStoreContext, defaultNavState } from "./navigation-context"
import { UIStoreContext, defaultUIState } from "./ui-context"
import type {
  StoreContextType,
  NavigationStoreContextType,
  UIStoreContextType,
} from "./types"
import type { Product } from "@/lib/types"

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

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cartState, setCartState] = useState(() => ({
    ...defaultCartState,
    cart: [] as CartItem[],
  }))
  const [navState, setNavState] = useState(defaultNavState)
  const [uiState, setUIState] = useState(() => ({
    ...defaultUIState,
    wishlist: [] as WishlistItem[],
  }))

  const hasRestoredRef = useRef(false)
  const productsRef = useRef(getProducts())
  const promoCodesRef = useRef(getPromoCodes())
  const cartRef = useRef(cartState.cart)
  useEffect(() => {
    cartRef.current = cartState.cart
  }, [cartState.cart])
  useEffect(() => {
    const cart = loadPersistedCart()
    const wishlist = loadPersistedWishlist()

    if (cart.length > 0) {
      setCartState(prev => ({ ...prev, cart }))
    }
    if (wishlist.length > 0) {
      setUIState(prev => ({ ...prev, wishlist }))
    }

    // On marque la restauration comme terminée à la fin du cycle actuel
    // pour que les effets de sauvegarde ne vident pas le storage au premier render
    const t = setTimeout(() => {
      hasRestoredRef.current = true
    }, 0)

    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (uiState.darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [uiState.darkMode])

  useEffect(() => {
    if (!hasRestoredRef.current || typeof window === "undefined") return
    try {
      localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cartState.cart))
    } catch {
      // ignore
    }
  }, [cartState.cart])

  useEffect(() => {
    if (!hasRestoredRef.current || typeof window === "undefined") return
    try {
      localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(uiState.wishlist))
    } catch {
      // ignore
    }
  }, [uiState.wishlist])

  const addToCart = useCallback((item: CartItem) => {
    setCartState(prev => {
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
    setCartState(prev => ({
      ...prev,
      cart: prev.cart.filter(c => !(c.productId === productId && c.color === color && c.size === size))
    }))
  }, [])

  const updateCartQuantity = useCallback((productId: string, quantity: number, color?: string, size?: string) => {
    setCartState(prev => ({
      ...prev,
      cart: prev.cart.map(c =>
        c.productId === productId && c.color === color && c.size === size
          ? { ...c, quantity: Math.max(1, quantity) }
          : c
      )
    }))
  }, [])

  const clearCart = useCallback(() => {
    setCartState(prev => ({ ...prev, cart: [], promoDiscount: 0, appliedPromo: null }))
  }, [])

  const cartTotal = useMemo(
    () => cartState.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartState.cart]
  )
  const cartCount = useMemo(
    () => cartState.cart.reduce((sum, item) => sum + item.quantity, 0),
    [cartState.cart]
  )

  const toggleWishlist = useCallback((productId: string) => {
    setUIState(prev => {
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
    return uiState.wishlist.some(w => w.productId === productId)
  }, [uiState.wishlist])

  const toggleCompare = useCallback((productId: string) => {
    setUIState(prev => {
      const exists = prev.compareList.includes(productId)
      if (exists) return { ...prev, compareList: prev.compareList.filter(id => id !== productId) }
      if (prev.compareList.length >= 4) return prev
      return { ...prev, compareList: [...prev.compareList, productId] }
    })
  }, [])

  const isInCompare = useCallback((productId: string) => {
    return uiState.compareList.includes(productId)
  }, [uiState.compareList])

  const toggleDarkMode = useCallback(() => {
    setUIState(prev => ({ ...prev, darkMode: !prev.darkMode }))
  }, [])

  const navigate = useCallback((page: string) => {
    setNavState(prev => ({ ...prev, currentPage: page }))
    window.scrollTo(0, 0)
  }, [])

  const setCurrentView = useCallback((view: "store" | "admin") => {
    setNavState(prev => ({
      ...prev,
      currentView: view,
      currentPage: view === "admin" ? PAGES.admin.dashboard : PAGES.store.home,
    }))
  }, [])

  const selectProduct = useCallback((id: string | null) => {
    setNavState(prev => ({ ...prev, selectedProductId: id }))
  }, [])

  const selectCategory = useCallback((id: string | null) => {
    setNavState(prev => ({ ...prev, selectedCategoryId: id }))
  }, [])

  const selectOrder = useCallback((id: string | null) => {
    setNavState(prev => ({ ...prev, selectedOrderId: id }))
  }, [])

  const selectCustomer = useCallback((id: string | null) => {
    setNavState(prev => ({ ...prev, selectedCustomerId: id }))
  }, [])

  const setSearchQuery = useCallback((query: string) => {
    const MAX_SEARCH_LENGTH = 200
    const truncated = query.length > MAX_SEARCH_LENGTH ? query.slice(0, MAX_SEARCH_LENGTH) : query
    setNavState(prev => ({ ...prev, searchQuery: truncated }))
  }, [])

  const subscribeNewsletter = useCallback(() => {
    setUIState(prev => ({ ...prev, newsletterSubscribed: true }))
  }, [])

  const getProduct = useCallback((id: string): Product | undefined => {
    return productsRef.current.find(p => p.id === id)
  }, [])

  const applyPromoCode = useCallback((code: string): { success: boolean; discount: number; message: string } => {
    const parsed = promoCodeInputSchema.safeParse(code)
    if (!parsed.success) {
      return { success: false, discount: 0, message: parsed.error.issues[0]?.message ?? "Code invalide" }
    }
    const normalizedCode = parsed.data
    const currentCart = cartRef.current
    const currentCartTotal = currentCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const promo = promoCodesRef.current.find(p => p.code === normalizedCode && p.active)
    if (!promo) return { success: false, discount: 0, message: "Code promo invalide ou inactif." }
    if (new Date() > new Date(promo.endDate)) return { success: false, discount: 0, message: "Ce code promo est expiré." }
    if (promo.usedCount >= promo.maxUses) return { success: false, discount: 0, message: "Limite d'utilisation de ce code atteinte." }
    if (promo.minAmount && currentCartTotal < promo.minAmount) return { success: false, discount: 0, message: `Montant minimum de ${promo.minAmount}€ requis pour ce code.` }

    const discount = promo.type === "percentage" ? (currentCartTotal * promo.value) / 100 : promo.value
    setCartState(prev => ({ ...prev, promoDiscount: discount, appliedPromo: promo.code }))
    return { success: true, discount, message: `Code ${promo.code} appliqué !` }
  }, [])

  const cartStateValue = useMemo(
    () => ({
      cart: cartState.cart,
      cartTotal,
      cartCount,
      promoDiscount: cartState.promoDiscount,
      appliedPromo: cartState.appliedPromo,
    }),
    [cartState.cart, cartState.promoDiscount, cartState.appliedPromo, cartTotal, cartCount]
  )

  const cartActionsValue = useMemo(
    () => ({
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      applyPromoCode,
    }),
    [addToCart, removeFromCart, updateCartQuantity, clearCart, applyPromoCode]
  )

  const navValue = useMemo<NavigationStoreContextType>(
    () => ({
      ...navState,
      navigate,
      setCurrentView,
      selectProduct,
      selectCategory,
      selectOrder,
      selectCustomer,
      setSearchQuery,
      getProduct,
    }),
    [navState, navigate, setCurrentView, selectProduct, selectCategory, selectOrder, selectCustomer, setSearchQuery, getProduct]
  )

  const uiValue = useMemo<UIStoreContextType>(
    () => ({
      ...uiState,
      toggleWishlist,
      isInWishlist,
      toggleCompare,
      isInCompare,
      toggleDarkMode,
      subscribeNewsletter,
    }),
    [uiState, toggleWishlist, isInWishlist, toggleCompare, isInCompare, toggleDarkMode, subscribeNewsletter]
  )

  const fullValue = useMemo<StoreContextType>(
    () => ({
      cart: cartState.cart,
      wishlist: uiState.wishlist,
      compareList: uiState.compareList,
      darkMode: uiState.darkMode,
      currentView: navState.currentView,
      currentPage: navState.currentPage,
      selectedProductId: navState.selectedProductId,
      selectedCategoryId: navState.selectedCategoryId,
      selectedOrderId: navState.selectedOrderId,
      selectedCustomerId: navState.selectedCustomerId,
      searchQuery: navState.searchQuery,
      newsletterSubscribed: uiState.newsletterSubscribed,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartTotal,
      cartCount,
      promoDiscount: cartState.promoDiscount,
      appliedPromo: cartState.appliedPromo,
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
    }),
    [cartState, navState, uiState, cartTotal, cartCount, addToCart, removeFromCart, updateCartQuantity, clearCart, toggleWishlist, isInWishlist, toggleCompare, isInCompare, toggleDarkMode, navigate, setCurrentView, selectProduct, selectCategory, selectOrder, selectCustomer, setSearchQuery, subscribeNewsletter, getProduct, applyPromoCode]
  )

  return (
    <StoreContext.Provider value={fullValue}>
      <CartStateContext.Provider value={cartStateValue}>
        <CartActionsContext.Provider value={cartActionsValue}>
          <NavigationStoreContext.Provider value={navValue}>
            <UIStoreContext.Provider value={uiValue}>
              {children}
            </UIStoreContext.Provider>
          </NavigationStoreContext.Provider>
        </CartActionsContext.Provider>
      </CartStateContext.Provider>
    </StoreContext.Provider>
  )
}

export function useCartState() {
  const context = useContext(CartStateContext)
  if (!context) throw new Error("useCartState must be used within StoreProvider")
  return context
}

export function useCartActions() {
  const context = useContext(CartActionsContext)
  if (!context) throw new Error("useCartActions must be used within StoreProvider")
  return context
}

export function useCartStore() {
  const state = useCartState()
  const actions = useCartActions()
  return { ...state, ...actions }
}

export function useNavigationStore() {
  const context = useContext(NavigationStoreContext)
  if (!context) throw new Error("useNavigationStore must be used within StoreProvider")
  return context
}

export function useUIStore() {
  const context = useContext(UIStoreContext)
  if (!context) throw new Error("useUIStore must be used within StoreProvider")
  return context
}
