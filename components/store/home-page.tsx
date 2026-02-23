"use client"

/**
 * Page d'accueil principale
 * Affiche le hero slider, les catégories, et les carrousels de produits
 */

// Standard library imports
import { useCallback, useMemo } from "react"

// Third-party imports
import { motion } from "framer-motion"

// Internal imports
import { ANIMATION_DELAYS } from "@/lib/constants"
import { defaultTransition } from "@/lib/animations"
import { SECTION_CONTAINER, SECTION_FULL } from "@/lib/layout"
import { CAROUSEL_ITEMS_PER_VIEW } from "@/lib/responsive"
import { PRODUCT_BADGE } from "@/lib/status-types"
import { getProducts } from "@/lib/services"
import { useNavigationStore } from "@/lib/store-context"
import { PAGES } from "@/lib/routes"
import { useSimulatedLoading } from "@/hooks/use-simulated-loading"
import { ProductCarousel } from "./product-carousel"
import { HeroSlider } from "./home-hero-slider"
import { CategoriesGrid } from "./home-categories-grid"
import { PromoBanner } from "./home-promo-banner"

// Configuration par défaut pour les carrousels
const DEFAULT_CAROUSEL_CONFIG = {
  itemsPerView: CAROUSEL_ITEMS_PER_VIEW,
} as const

/**
 * Page d'accueil principale
 * Combine le hero slider, les catégories, et les carrousels de produits
 */
export function HomePage() {
  const { navigate, selectCategory } = useNavigationStore()
  const [isLoading] = useSimulatedLoading(ANIMATION_DELAYS.LOADING_DELAY)

  const handleCategoryClick = useCallback((cat: { id: string }) => {
    selectCategory(cat.id)
    navigate(PAGES.store.catalog)
  }, [navigate, selectCategory])

  const handleNavigateToCatalog = useCallback(() => {
    navigate(PAGES.store.catalog)
  }, [navigate])

  const products = useMemo(() => getProducts(), [])

  const featured = useMemo(() => {
    return [...products]
      .filter(p => p.featured)
      .sort((a, b) => a.id.localeCompare(b.id))
      .slice(0, 10)
  }, [products])

  const newProducts = useMemo(() => {
    return [...products]
      .filter(p => p.badge === PRODUCT_BADGE.NEW)
      .sort((a, b) => a.id.localeCompare(b.id))
      .slice(0, 8)
  }, [products])

  const bestSellers = useMemo(() => {
    return [...products]
      .sort((a, b) => {
        const diff = b.reviewCount - a.reviewCount
        return diff !== 0 ? diff : a.id.localeCompare(b.id)
      })
      .slice(0, 8)
  }, [products])

  return (
    <div className="w-full">
      {/* Hero Slider */}
      <HeroSlider onNavigateToCatalog={handleNavigateToCatalog} />

      {/* Nos Catégories */}
      <CategoriesGrid onCategoryClick={handleCategoryClick} />

      {/* Nouveautés - Carrousel */}
      <motion.section
        className={`py-16 ${SECTION_CONTAINER}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...defaultTransition, delay: 0.2 }}
      >
        <ProductCarousel
          products={newProducts}
          title="Nouveautés"
          subtitle="Les derniers arrivages"
          showViewAll={true}
          onViewAll={handleNavigateToCatalog}
          isLoading={isLoading}
          itemsPerView={DEFAULT_CAROUSEL_CONFIG.itemsPerView}
        />
      </motion.section>

      {/* Bandeau promo */}
      <PromoBanner onNavigateToCatalog={handleNavigateToCatalog} />

      {/* Best-Sellers - Carrousel */}
      <motion.section
        className={`py-16 bg-secondary/50 ${SECTION_FULL}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...defaultTransition, delay: 0.4 }}
      >
        <div className={SECTION_CONTAINER}>
          <ProductCarousel
            products={bestSellers}
            title="Best-Sellers"
            subtitle="Les plus populaires"
            showViewAll={true}
            onViewAll={handleNavigateToCatalog}
            isLoading={isLoading}
            itemsPerView={DEFAULT_CAROUSEL_CONFIG.itemsPerView}
          />
        </div>
      </motion.section>

      {/* Nos Coups de Coeur - Carrousel */}
      <motion.section
        className={`py-16 ${SECTION_CONTAINER}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...defaultTransition, delay: 0.5 }}
      >
        <ProductCarousel
          products={featured}
          title="Nos Coups de Coeur"
          subtitle="Articles sélectionnés pour vous"
          showViewAll={true}
          onViewAll={handleNavigateToCatalog}
          isLoading={isLoading}
          itemsPerView={DEFAULT_CAROUSEL_CONFIG.itemsPerView}
        />
      </motion.section>
    </div>
  )
}
