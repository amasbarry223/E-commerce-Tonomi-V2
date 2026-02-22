/**
 * Application-wide constants
 * Centralized location for magic numbers and configuration values
 */

// Animation and timing constants
export const ANIMATION_DELAYS = {
  HERO_SLIDE_INTERVAL: 5000,
  LOADING_DELAY: 500,
  CART_ANIMATION_DELAY: 300,
  QUANTITY_UPDATE_DELAY: 200,
  CHECKOUT_PROCESSING_DELAY: 1500,
} as const

// Layout and spacing constants
export const LAYOUT_CONSTANTS = {
  SLIDE_OFFSET: 1000,
  MAX_COMPARE_ITEMS: 4,
  FREE_SHIPPING_THRESHOLD: 100,
  EXPRESS_SHIPPING_COST: 9.99,
  STANDARD_SHIPPING_COST: 5.99,
  FREE_SHIPPING_LABEL: "Gratuite",
  FREE_SHIPPING_LABEL_LONG: "Livraison gratuite",
  FREE_SHIPPING_THRESHOLD_LABEL: "Livraison gratuite dès 100€",
  FREE_SHIPPING_HEADER: "Livraison gratuite pour toute commande de plus de 100€",
} as const

// Validation constants
export const VALIDATION_LIMITS = {
  META_TITLE_MAX_LENGTH: 60,
  META_DESCRIPTION_MAX_LENGTH: 160,
  CATEGORY_DESCRIPTION_MAX_HEIGHT: 100,
  SEO_DESCRIPTION_MAX_HEIGHT: 80,
} as const

// Product constants
export const PRODUCT_CONSTANTS = {
  MIN_QUANTITY: 1,
  DEFAULT_QUANTITY: 1,
  MAX_SIMILAR_PRODUCTS: 4,
} as const

// Order constants
export const ORDER_CONSTANTS = {
  ORDER_NUMBER_PREFIX: "CMD-2026-",
} as const

// Toast / UI messages (admin, forms, validation)
export const TOAST_MESSAGES = {
  EXPORT_SUCCESS: "Export réussi",
  VALIDATION_CORRECT_FIELDS: "Veuillez corriger les champs.",
  SAVED_SUCCESS: "Enregistrement effectué avec succès",
  CREATED_SUCCESS: "Création effectuée avec succès",
  DELETED_SUCCESS: "Suppression effectuée avec succès",
} as const

