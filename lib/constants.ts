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

/** Délais auth / guards (évite les flashs avant redirect ou affichage formulaire) */
export const AUTH_DELAYS_MS = {
  GUEST_ONLY_INITIAL: 120,
  AUTH_CHECK: 150,
  ADMIN_LOADING: 200,
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

/** Libellés des modes de livraison (checkout, récap) */
export const SHIPPING_LABELS = {
  STANDARD: "Standard (3-5 jours)",
  EXPRESS: "Express (1-2 jours)",
} as const

// Order display labels (unified across store and admin)
export const ORDER_LABELS = {
  DISCOUNT: "Réduction",
} as const

// Validation constants
export const VALIDATION_LIMITS = {
  META_TITLE_MAX_LENGTH: 60,
  META_DESCRIPTION_MAX_LENGTH: 160,
  CATEGORY_DESCRIPTION_MAX_HEIGHT: 100,
  SEO_DESCRIPTION_MAX_HEIGHT: 80,
  HERO_TITLE_MAX_LENGTH: 80,
  HERO_SUBTITLE_MAX_LENGTH: 160,
  HERO_CTA_TEXT_MAX_LENGTH: 40,
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
  /** Message lorsque la suppression est simulée (données statiques, pas de backend) */
  DEMO_DELETE_PRODUCT: "En mode démo, les données sont statiques. La suppression sera effective avec un backend.",
} as const

