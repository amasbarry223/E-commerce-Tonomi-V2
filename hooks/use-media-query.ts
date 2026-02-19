"use client"

/**
 * Hook pour utiliser les media queries de manière réactive
 * Abstrait window.matchMedia pour une meilleure testabilité
 */

import { useEffect, useState } from "react"

/**
 * Hook pour utiliser une media query
 * 
 * @param query - La media query à tester (ex: "(max-width: 768px)")
 * @returns true si la media query correspond, false sinon
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isMobile = useMediaQuery("(max-width: 768px)")
 *   return isMobile ? <MobileView /> : <DesktopView />
 * }
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia(query)
    
    // Définir la valeur initiale
    setMatches(mediaQuery.matches)

    // Créer un handler pour les changements
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Écouter les changements (méthode moderne)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler)
      return () => mediaQuery.removeEventListener("change", handler)
    } else {
      // Fallback pour les anciens navigateurs
      mediaQuery.addListener(handler)
      return () => mediaQuery.removeListener(handler)
    }
  }, [query])

  return matches
}

/**
 * Hook pour détecter si l'utilisateur préfère le mouvement réduit
 * 
 * @returns true si prefers-reduced-motion est activé
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const prefersReducedMotion = usePrefersReducedMotion()
 *   return prefersReducedMotion ? <StaticView /> : <AnimatedView />
 * }
 * ```
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)")
}

/**
 * Hook pour détecter si l'utilisateur préfère le mode sombre
 * 
 * @returns true si prefers-color-scheme: dark est activé
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const prefersDark = usePrefersDarkMode()
 *   return prefersDark ? <DarkTheme /> : <LightTheme />
 * }
 * ```
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery("(prefers-color-scheme: dark)")
}

