"use client"

/**
 * Hook pour ajouter des event listeners de manière sécurisée
 * Nettoie automatiquement les listeners au démontage
 */

import { useEffect, useRef } from "react"

/**
 * Options pour useEventListener
 */
export interface UseEventListenerOptions {
  /** Élément cible (window, document, ou un élément spécifique) */
  target?: Window | Document | HTMLElement | null
  /** Si true, utilise capture phase */
  capture?: boolean
  /** Si true, indique que le handler ne préviendra pas le comportement par défaut */
  passive?: boolean
  /** Si true, le listener ne sera ajouté que si l'élément existe */
  enabled?: boolean
}

/**
 * Hook pour ajouter un event listener de manière sécurisée
 * 
 * @param eventType - Type d'événement (ex: "click", "resize", "keydown")
 * @param handler - Fonction handler pour l'événement
 * @param options - Options pour le listener
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   useEventListener("keydown", (e) => {
 *     if (e.key === "Escape") {
 *       // Faire quelque chose
 *     }
 *   }, { target: window })
 * }
 * ```
 */
export function useEventListener(
  eventType: string,
  handler: (event: Event) => void,
  options?: UseEventListenerOptions
): void {
  const opts = options ?? {}
  
  // Utiliser une ref pour stocker le handler et éviter les re-renders
  const handlerRef = useRef(handler)
  
  // Mettre à jour la ref quand le handler change
  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const { target, capture = false, passive = false, enabled = true } = opts
    if (!enabled) return

    const targetElement = target ?? (typeof window !== "undefined" ? window : null)
    if (!targetElement) return

    const eventListener = (event: Event) => {
      handlerRef.current(event)
    }

    targetElement.addEventListener(eventType, eventListener, { capture, passive })
    
    return () => {
      targetElement.removeEventListener(eventType, eventListener, { capture })
    }
  }, [eventType, opts])
}

