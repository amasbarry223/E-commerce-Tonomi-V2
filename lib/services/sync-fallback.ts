/**
 * Versions synchrones de fallback pour compatibilité temporaire
 * ⚠️ Ces fonctions retournent des tableaux vides et doivent être remplacées par les hooks
 * Utilisé uniquement pour éviter les erreurs de compilation pendant la migration
 */

import type { Product, Category, Order, Customer, PromoCode, HeroSlide } from "@/lib/types"

/**
 * ⚠️ DEPRECATED: Utilisez useProducts() hook à la place
 * @deprecated
 */
export function getProducts(): Product[] {
  if (typeof window === "undefined") {
    // Server-side: retourner un tableau vide (sera remplacé par await getProducts() dans Server Components)
    return []
  }
  // Client-side: retourner un tableau vide (utilisez useProducts() hook)
  console.warn("getProducts() est deprecated. Utilisez useProducts() hook à la place.")
  return []
}

/**
 * ⚠️ DEPRECATED: Utilisez useCategories() hook à la place
 * @deprecated
 */
export function getCategories(): Category[] {
  if (typeof window === "undefined") {
    return []
  }
  console.warn("getCategories() est deprecated. Utilisez useCategories() hook à la place.")
  return []
}

/**
 * ⚠️ DEPRECATED: Utilisez await getOrders() dans Server Components
 * @deprecated
 */
export function getOrders(): Order[] {
  if (typeof window === "undefined") {
    return []
  }
  console.warn("getOrders() est deprecated. Utilisez await getOrders() dans Server Components.")
  return []
}

/**
 * ⚠️ DEPRECATED: Utilisez await getCustomers() dans Server Components
 * @deprecated
 */
export function getCustomers(): Customer[] {
  if (typeof window === "undefined") {
    return []
  }
  console.warn("getCustomers() est deprecated. Utilisez await getCustomers() dans Server Components.")
  return []
}

/**
 * ⚠️ DEPRECATED: Utilisez await getPromoCodes() dans Server Components
 * @deprecated
 */
export function getPromoCodes(): PromoCode[] {
  if (typeof window === "undefined") {
    return []
  }
  console.warn("getPromoCodes() est deprecated. Utilisez await getPromoCodes() dans Server Components.")
  return []
}

/**
 * ⚠️ DEPRECATED: Utilisez useHeroSlides() hook à la place
 * @deprecated
 */
export function getDefaultHeroSlides(): HeroSlide[] {
  if (typeof window === "undefined") {
    return []
  }
  console.warn("getDefaultHeroSlides() est deprecated. Utilisez useHeroSlides() hook à la place.")
  return []
}

/**
 * ⚠️ DEPRECATED: Utilisez await getCustomerById() dans Server Components
 * @deprecated
 */
export function getCustomerById(id: string): Customer | undefined {
  return undefined
}
