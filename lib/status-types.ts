/**
 * Status type definitions and constants
 * Centralized status values to replace magic strings
 */

/**
 * Product status values
 */
export const PRODUCT_STATUS = {
  PUBLISHED: "published",
  DRAFT: "draft",
  ARCHIVED: "archived",
  OUT_OF_STOCK: "out-of-stock",
} as const

export type ProductStatus = typeof PRODUCT_STATUS[keyof typeof PRODUCT_STATUS]

/**
 * Order status values
 */
export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
} as const

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS]

/**
 * Review status values
 */
export const REVIEW_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const

export type ReviewStatus = typeof REVIEW_STATUS[keyof typeof REVIEW_STATUS]

/**
 * Customer segment values
 */
export const CUSTOMER_SEGMENT = {
  VIP: "vip",
  NEW: "new",
  REGULAR: "regular",
  INACTIVE: "inactive",
} as const

export type CustomerSegment = typeof CUSTOMER_SEGMENT[keyof typeof CUSTOMER_SEGMENT]

/**
 * Product badge values
 */
export const PRODUCT_BADGE = {
  NEW: "new",
  PROMO: "promo",
  COUP_DE_COEUR: "coup-de-coeur",
  STOCK_LIMITE: "stock-limite",
} as const

export type ProductBadge = typeof PRODUCT_BADGE[keyof typeof PRODUCT_BADGE]

