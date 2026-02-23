"use client"

/**
 * Composant grille de catégories pour la page d'accueil
 * Affiche les catégories principales sous forme de grille
 */

// Standard library imports
import React, { useMemo } from "react"

// Third-party imports
import { motion } from "framer-motion"
import Image from "next/image"

// Internal imports
import { defaultTransition } from "@/lib/animations"
import { EXCLUDED_CATEGORY_IDS, SECTION_CONTAINER } from "@/lib/layout"
import { getCategories } from "@/lib/services"
import type { Category } from "@/lib/types"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface CategoriesGridProps {
  onCategoryClick: (category: Category) => void
}

/**
 * Composant grille de catégories
 * 
 * @param onCategoryClick - Callback appelé lors du clic sur une catégorie
 */
export const CategoriesGrid = React.memo(function CategoriesGrid({ onCategoryClick }: CategoriesGridProps) {
  const categories = getCategories()
  const reducedMotion = useReducedMotion()

  const mainCategories = useMemo(
    () => categories.filter(c => !EXCLUDED_CATEGORY_IDS.includes(c.id)),
    [categories]
  )

  return (
    <motion.section
      className={`py-16 ${SECTION_CONTAINER}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...defaultTransition, delay: 0.1 }}
    >
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...defaultTransition, delay: 0.2 }}
      >
        <h2 className="font-serif text-3xl font-bold mb-2">Nos Catégories</h2>
        <p className="text-muted-foreground">Trouvez le sac parfait pour chaque occasion</p>
      </motion.div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mainCategories.map((cat, index) => (
          <motion.button
            key={cat.id}
            onClick={() => onCategoryClick(cat)}
            className="group relative aspect-[4/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={`Voir les produits de la catégorie ${cat.name}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...defaultTransition, delay: 0.3 + index * 0.1 }}
            whileHover={!reducedMotion ? { scale: 1.02, y: -4 } : {}}
            whileTap={!reducedMotion ? { scale: 0.98 } : {}}
            type="button"
          >
            <div className="h-full w-full group-hover:scale-110 transition-transform duration-500">
              <Image 
                src={cat.image} 
                alt={cat.name} 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-semibold text-lg">{cat.name}</h3>
              <p className="text-sm text-white/70">{cat.productCount} articles</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.section>
  )
})

