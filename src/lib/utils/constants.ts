/**
 * Constantes de l'application
 */

export const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  shipped: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  refunded: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  published: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  archived: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  "out-of-stock": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  approved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
} as const

export const STATUS_LABELS = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
  refunded: "Remboursée",
  published: "Publié",
  draft: "Brouillon",
  archived: "Archivé",
  "out-of-stock": "Rupture",
  approved: "Approuvé",
  rejected: "Rejeté",
  new: "Nouveau",
  promo: "Promo",
  "coup-de-coeur": "Coup de coeur",
  "stock-limite": "Stock limité",
} as const

export const BADGE_COLORS = {
  new: "bg-emerald-500 text-white",
  promo: "bg-red-500 text-white",
  "coup-de-coeur": "bg-pink-500 text-white",
  "stock-limite": "bg-amber-500 text-white",
} as const

export const CHART_COLORS = ["#C19A6B", "#1a1a1a", "#808080", "#8B4513", "#556B2F", "#722F37"] as const

/**
 * Utilitaires pour les statuts
 */
export const getStatusColor = (status: string): string => {
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "bg-gray-100 text-gray-800"
}

export const getStatusLabel = (status: string): string => {
  return STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status
}

export const getBadgeColor = (badge: string): string => {
  return BADGE_COLORS[badge as keyof typeof BADGE_COLORS] || "bg-gray-500 text-white"
}

