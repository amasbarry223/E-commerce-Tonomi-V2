"use client"

import { useState } from "react"

export interface SafeImageProps {
  /** URL de l'image */
  src: string
  /** Texte alternatif (accessibilité) */
  alt: string
  /** Classes CSS optionnelles (conteneur ou img) */
  className?: string
  /** Texte affiché en fallback si l'image ne charge pas (défaut: "Image non disponible") */
  fallbackText?: string
}

/**
 * Aperçu d'image avec gestion d'erreur (onError) sans risque XSS.
 * Utilisable dans les formulaires admin (catégories, hero slides, etc.).
 * En cas d'échec de chargement, affiche un bloc avec fallbackText.
 */
export function SafeImage({ src, alt, className, fallbackText = "Image non disponible" }: SafeImageProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className={`flex items-center justify-center h-full text-muted-foreground text-sm min-h-[48px] ${className ?? ""}`.trim()}>
        {fallbackText}
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- fallback / URLs dynamiques (blob, données)
    <img
      src={src}
      alt={alt}
      className={className ?? "w-full h-full object-cover"}
      onError={() => setHasError(true)}
    />
  )
}
