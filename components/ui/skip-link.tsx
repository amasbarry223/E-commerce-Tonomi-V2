"use client"

/**
 * Skip Link pour l'accessibilité
 * Permet aux utilisateurs de navigation clavier de sauter directement au contenu principal
 * Conforme WCAG 2.1 - Niveau A
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label="Aller au contenu principal"
    >
      Aller au contenu principal
    </a>
  )
}

