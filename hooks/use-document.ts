"use client"

/**
 * Hook pour accéder à l'objet document de manière sécurisée
 * Retourne null si document n'est pas disponible (SSR)
 */

import { useEffect, useState } from "react"

/**
 * Hook pour accéder à document de manière sécurisée
 * 
 * @returns L'objet document ou null si non disponible
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const document = useDocument()
 *   const element = document?.getElementById("my-id")
 * }
 * ```
 */
export function useDocument(): Document | null {
  const [documentObj, setDocumentObj] = useState<Document | null>(null)

  useEffect(() => {
    if (typeof document !== "undefined") {
      setDocumentObj(document)
    }
  }, [])

  return documentObj
}

/**
 * Hook pour obtenir un élément par son ID de manière sécurisée
 * 
 * @param id - ID de l'élément à trouver
 * @returns L'élément HTMLElement ou null
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const element = useDocumentElementById("my-id")
 * }
 * ```
 */
export function useDocumentElementById(id: string): HTMLElement | null {
  const documentObj = useDocument()
  const [element, setElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (documentObj) {
      const el = documentObj.getElementById(id)
      setElement(el)
    }
  }, [documentObj, id])

  return element
}

/**
 * Hook pour obtenir un élément via querySelector de manière sécurisée
 * 
 * @param selector - Sélecteur CSS
 * @returns L'élément HTMLElement ou null
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const element = useDocumentQuerySelector("[data-product-image]")
 * }
 * ```
 */
export function useDocumentQuerySelector(selector: string): HTMLElement | null {
  const documentObj = useDocument()
  const [element, setElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (documentObj) {
      const el = documentObj.querySelector(selector) as HTMLElement | null
      setElement(el)
    }
  }, [documentObj, selector])

  return element
}

