"use client"

/**
 * Hook pour accéder à l'objet window de manière sécurisée
 * Retourne null si window n'est pas disponible (SSR)
 */

import { useEffect, useState } from "react"

/**
 * Hook pour accéder à window de manière sécurisée
 * 
 * @returns L'objet window ou null si non disponible
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const window = useWindow()
 *   const width = window?.innerWidth ?? 0
 * }
 * ```
 */
export function useWindow(): Window | null {
  const [windowObj, setWindowObj] = useState<Window | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowObj(window)
    }
  }, [])

  return windowObj
}

/**
 * Hook pour obtenir une propriété de window
 * 
 * @param key - Clé de la propriété window à obtenir
 * @returns La valeur de la propriété ou undefined
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const innerWidth = useWindowProperty("innerWidth")
 * }
 * ```
 */
export function useWindowProperty<K extends keyof Window>(
  key: K
): Window[K] | undefined {
  const windowObj = useWindow()
  const [value, setValue] = useState<Window[K] | undefined>(undefined)

  useEffect(() => {
    if (windowObj) {
      setValue(windowObj[key])
    }
  }, [windowObj, key])

  return value
}

/**
 * Hook pour obtenir la taille de la fenêtre
 * 
 * @returns Objet avec width et height, ou null si non disponible
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const size = useWindowSize()
 *   const width = size?.width ?? 0
 * }
 * ```
 */
export function useWindowSize(): { width: number; height: number } | null {
  const windowObj = useWindow()
  const [size, setSize] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    if (!windowObj) return

    const updateSize = () => {
      setSize({
        width: windowObj.innerWidth,
        height: windowObj.innerHeight,
      })
    }

    updateSize()
    windowObj.addEventListener("resize", updateSize, { passive: true })
    return () => windowObj.removeEventListener("resize", updateSize)
  }, [windowObj])

  return size
}

