"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { breakpoints, RESIZE_DEBOUNCE_DELAY, type ItemsPerViewConfig } from "@/lib/responsive"

/**
 * Hook optimisé pour calculer le nombre d'items à afficher selon la taille de l'écran
 * Utilise un debounce pour éviter les recalculs excessifs lors du redimensionnement
 * 
 * @param itemsPerView - Configuration du nombre d'items par vue pour mobile, tablet et desktop
 * @returns Le nombre d'items à afficher selon la taille actuelle de l'écran
 * 
 * @example
 * ```tsx
 * function ProductCarousel() {
 *   const itemsPerView = useResponsiveItems({
 *     mobile: 1,
 *     tablet: 2,
 *     desktop: 4
 *   })
 *   
 *   return <Carousel itemsPerView={itemsPerView} />
 * }
 * ```
 */
export function useResponsiveItems(itemsPerView: ItemsPerViewConfig): number {
  // Mémoriser la clé pour éviter les recréations si les valeurs sont identiques
  const itemsPerViewKey = useMemo(
    () => `${itemsPerView.mobile}-${itemsPerView.tablet}-${itemsPerView.desktop}`,
    [itemsPerView.mobile, itemsPerView.tablet, itemsPerView.desktop]
  )

  // Mémoriser la fonction de calcul
  const getItemsPerView = useCallback(() => {
    if (typeof window === "undefined") return itemsPerView.desktop
    const width = window.innerWidth
    if (width < breakpoints.md) return itemsPerView.mobile
    if (width < breakpoints.lg) return itemsPerView.tablet
    return itemsPerView.desktop
  }, [itemsPerView.mobile, itemsPerView.tablet, itemsPerView.desktop])

  const [currentItemsPerView, setCurrentItemsPerView] = useState(() =>
    getItemsPerView()
  )

  const handlerRef = useRef<() => void>(() => {})
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Mettre à jour la référence du handler sans recréer l'effet
  handlerRef.current = useCallback(() => {
    setCurrentItemsPerView(getItemsPerView())
  }, [getItemsPerView])

  useEffect(() => {
    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        handlerRef.current?.()
      }, RESIZE_DEBOUNCE_DELAY)
    }

    window.addEventListener("resize", handleResize, { passive: true })
    
    return () => {
      window.removeEventListener("resize", handleResize)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, []) // Pas de dépendances - handler via ref

  // Recalculer si itemsPerView change (comparaison profonde)
  useEffect(() => {
    setCurrentItemsPerView(getItemsPerView())
  }, [itemsPerViewKey, getItemsPerView])

  return currentItemsPerView
}

