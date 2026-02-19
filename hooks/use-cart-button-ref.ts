"use client"

import { useRef, useEffect } from "react"

/**
 * Hook pour obtenir une référence au bouton du panier
 * Cache la requête DOM pour éviter les recherches répétées
 * 
 * @returns Une ref React vers l'élément du bouton panier
 * 
 * @example
 * ```tsx
 * function ProductPage() {
 *   const cartButtonRef = useCartButtonRef()
 *   
 *   const handleAddToCart = () => {
 *     // Utiliser cartButtonRef.current pour l'animation
 *   }
 * }
 * ```
 */
export function useCartButtonRef() {
  const cartButtonRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Find cart button once and cache it
    if (!cartButtonRef.current) {
      const button = document.querySelector('[aria-label*="panier"]') as HTMLElement | null
      if (button) {
        cartButtonRef.current = button
      }
    }
  }, [])

  return cartButtonRef
}

