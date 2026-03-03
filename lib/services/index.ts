/**
 * Couche services — appels API par domaine.
 * Les composants utilisent ces services pour accéder aux données Supabase.
 * 
 * ⚠️ IMPORTANT: Les fonctions sont maintenant asynchrones.
 * - Client Components: Utilisez les hooks (useProducts, useCategories, etc.)
 * - Server Components: Utilisez await (await getProducts(), await getCategories(), etc.)
 */

export * from "./products"
export * from "./orders"
export * from "./categories"
export * from "./customers"
export * from "./reviews"
export * from "./promos"
export * from "./hero-slides"

// Versions synchrones de fallback (DEPRECATED - pour compatibilité temporaire)
export * from "./sync-fallback"
