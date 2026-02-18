/**
 * Constantes de mise en page pour une cohérence globale (plein écran, padding responsive).
 * Utiliser ces classes partout pour éviter la duplication et faciliter les changements.
 */

/** Padding horizontal responsive pour les sections et conteneurs */
export const SECTION_PADDING = "px-4 sm:px-6 lg:px-8 xl:px-12"

/** Classe complète pour un conteneur de section pleine largeur */
export const SECTION_CONTAINER = `w-full ${SECTION_PADDING}`

/** Classe pour une section avec fond (ex. bandeau, zone secondaire) */
export const SECTION_FULL = "w-full"

/** IDs des catégories à exclure du menu principal / accueil (sous-catégories ou promos) */
export const EXCLUDED_CATEGORY_IDS: string[] = ["cat-5", "cat-6"]
