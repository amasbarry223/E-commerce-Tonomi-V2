/**
 * Formatters centralisés (prix, dates, statuts, badges, segments)
 * Extraits de lib/data.ts pour respect du SRP.
 */

import { PRODUCT_STATUS, ORDER_STATUS, REVIEW_STATUS, PRODUCT_BADGE, CUSTOMER_SEGMENT } from "./status-types"

/**
 * Formate un prix en format monétaire français (EUR)
 *
 * @param price - Le prix à formater
 * @returns Le prix formaté (ex: "125,99 €")
 *
 * @example
 * ```ts
 * formatPrice(125.99) // "125,99 €"
 * formatPrice(1000) // "1 000,00 €"
 * ```
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}

/**
 * Formate une date en format français long
 *
 * @param dateStr - La date au format string (ISO ou autre format valide)
 * @returns La date formatée (ex: "15 janvier 2026")
 *
 * @example
 * ```ts
 * formatDate("2026-01-15") // "15 janvier 2026"
 * ```
 */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr))
}

/**
 * Formate une date en format français court
 *
 * @param dateStr - La date au format string (ISO ou autre format valide)
 * @returns La date formatée (ex: "15/01/2026")
 *
 * @example
 * ```ts
 * formatDateShort("2026-01-15") // "15/01/2026"
 * ```
 */
export function formatDateShort(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateStr))
}

/**
 * Retourne le singulier ou le pluriel d'un mot selon le nombre.
 *
 * @param count - Le nombre
 * @param singular - Le mot au singulier (ex: "article")
 * @param plural - Optionnel, pluriel personnalisé (défaut: singular + "s")
 * @returns Le mot au bon nombre (ex: "article" ou "articles")
 *
 * @example
 * ```ts
 * pluralize(1, "article")   // "article"
 * pluralize(2, "article")   // "articles"
 * pluralize(5, "article")   // "articles"
 * pluralize(1, "favori", "favoris")  // "favori"
 * pluralize(3, "favori", "favoris")  // "favoris"
 * ```
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  return count <= 1 ? singular : (plural ?? singular + "s")
}

/**
 * Obtient la classe CSS de couleur pour un statut donné
 *
 * @param status - Le statut (produit, commande, avis, etc.)
 * @returns Les classes CSS Tailwind pour le badge de statut
 *
 * @example
 * ```ts
 * getStatusColor("pending") // "bg-amber-100 text-amber-800..."
 * getStatusColor("delivered") // "bg-emerald-100 text-emerald-800..."
 * ```
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    [ORDER_STATUS.PENDING]: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    [ORDER_STATUS.CONFIRMED]: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    [ORDER_STATUS.SHIPPED]: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    [ORDER_STATUS.DELIVERED]: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    [ORDER_STATUS.CANCELLED]: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    [ORDER_STATUS.REFUNDED]: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    [PRODUCT_STATUS.PUBLISHED]: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    [PRODUCT_STATUS.DRAFT]: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    [PRODUCT_STATUS.ARCHIVED]: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    [PRODUCT_STATUS.OUT_OF_STOCK]: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    [REVIEW_STATUS.APPROVED]: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    [REVIEW_STATUS.REJECTED]: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  }
  return colors[status] || "bg-gray-100 text-gray-800"
}

/**
 * Obtient le label en français pour un statut donné
 *
 * @param status - Le statut (produit, commande, avis, badge, etc.)
 * @returns Le label en français du statut, ou le statut original si non trouvé
 *
 * @example
 * ```ts
 * getStatusLabel("pending") // "En attente"
 * getStatusLabel("delivered") // "Livrée"
 * getStatusLabel("new") // "Nouveau"
 * ```
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    [ORDER_STATUS.PENDING]: "En attente",
    [ORDER_STATUS.CONFIRMED]: "Confirmée",
    [ORDER_STATUS.SHIPPED]: "Expédiée",
    [ORDER_STATUS.DELIVERED]: "Livrée",
    [ORDER_STATUS.CANCELLED]: "Annulée",
    [ORDER_STATUS.REFUNDED]: "Remboursée",
    [PRODUCT_STATUS.PUBLISHED]: "Publié",
    [PRODUCT_STATUS.DRAFT]: "Brouillon",
    [PRODUCT_STATUS.ARCHIVED]: "Archivé",
    [PRODUCT_STATUS.OUT_OF_STOCK]: "Rupture",
    [REVIEW_STATUS.APPROVED]: "Approuvé",
    [REVIEW_STATUS.REJECTED]: "Rejeté",
    [PRODUCT_BADGE.NEW]: "Nouveau",
    [PRODUCT_BADGE.PROMO]: "Promo",
    [PRODUCT_BADGE.COUP_DE_COEUR]: "Coup de coeur",
    [PRODUCT_BADGE.STOCK_LIMITE]: "Stock limité",
  }
  return labels[status] || status
}

/**
 * Obtient la classe CSS de couleur pour un badge de produit
 *
 * @param badge - Le type de badge (new, promo, coup-de-coeur, stock-limite)
 * @returns Les classes CSS Tailwind pour le badge
 *
 * @example
 * ```ts
 * getBadgeColor("new") // "bg-emerald-500 text-white"
 * getBadgeColor("promo") // "bg-red-500 text-white"
 * ```
 */
export function getBadgeColor(badge: string): string {
  const colors: Record<string, string> = {
    [PRODUCT_BADGE.NEW]: "bg-emerald-500 text-white",
    [PRODUCT_BADGE.PROMO]: "bg-red-500 text-white",
    [PRODUCT_BADGE.COUP_DE_COEUR]: "bg-pink-500 text-white",
    [PRODUCT_BADGE.STOCK_LIMITE]: "bg-amber-500 text-white",
  }
  return colors[badge] || "bg-gray-500 text-white"
}

/**
 * Obtient le label en français pour un segment client
 */
export function getSegmentLabel(segment: string): string {
  const labels: Record<string, string> = {
    [CUSTOMER_SEGMENT.VIP]: "VIP",
    [CUSTOMER_SEGMENT.NEW]: "Nouveau",
    [CUSTOMER_SEGMENT.REGULAR]: "Régulier",
    [CUSTOMER_SEGMENT.INACTIVE]: "Inactif",
  }
  return labels[segment] || segment
}

/**
 * Obtient la classe CSS de couleur pour un segment client
 */
export function getSegmentColor(segment: string): string {
  const colors: Record<string, string> = {
    [CUSTOMER_SEGMENT.VIP]: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    [CUSTOMER_SEGMENT.NEW]: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    [CUSTOMER_SEGMENT.REGULAR]: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    [CUSTOMER_SEGMENT.INACTIVE]: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  }
  return colors[segment] || "bg-gray-100 text-gray-800"
}
