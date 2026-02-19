"use client"

import { useState, useEffect } from "react"
import { prefersReducedMotion } from "@/lib/animations"

/**
 * Hook pour détecter et suivre la préférence de l'utilisateur pour les animations réduites
 * Écoute les changements de la media query `prefers-reduced-motion`
 * 
 * @returns `true` si l'utilisateur préfère les animations réduites, `false` sinon
 * 
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const reducedMotion = useReducedMotion()
 *   
 *   return (
 *     <motion.div
 *       animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
 *     >
 *       Contenu
 *     </motion.div>
 *   )
 * }
 * ```
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(() => prefersReducedMotion())

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }

    // Écouter les changements de préférence
    mediaQuery.addEventListener("change", handleChange)
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  return reducedMotion
}

