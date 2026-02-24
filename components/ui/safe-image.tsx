"use client"

import { useState } from "react"
import Image from "next/image"

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
 * Aperçu d'image sécurisé avec next/image.
 * Gère l'erreur de chargement avec un fallback visuel.
 * Utilisable dans les formulaires admin et la boutique.
 */
export function SafeImage({ src, alt, className, fallbackText = "Image non disponible" }: SafeImageProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError || !src) {
    return (
      <div className={`flex items-center justify-center h-full bg-secondary text-muted-foreground text-sm min-h-[48px] ${className ?? ""}`.trim()}>
        {fallbackText}
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className ?? "w-full h-full"}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onLoad={(e) => {
          // Si l'image chargée est le placeholder transparent de Next.js (erreur silencieuse parfois)
          if ((e.target as HTMLImageElement).naturalWidth === 0) setHasError(true)
        }}
        onError={() => setHasError(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
