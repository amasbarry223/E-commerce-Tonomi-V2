"use client"

/**
 * Composant bandeau promotionnel pour la page d'accueil
 * Affiche un message promotionnel avec CTA
 */

// Third-party imports
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

// Internal imports
import { defaultTransition } from "@/lib/animations"
import { SECTION_CONTAINER, SECTION_FULL } from "@/lib/layout"
import { Button } from "@/components/ui/button"

interface PromoBannerProps {
  onNavigateToCatalog: () => void
}

/**
 * Composant bandeau promotionnel
 * 
 * @param onNavigateToCatalog - Callback appelé lors du clic sur le CTA
 */
export function PromoBanner({ onNavigateToCatalog }: PromoBannerProps) {
  return (
    <motion.section
      className={`py-16 bg-primary text-primary-foreground ${SECTION_FULL}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...defaultTransition, delay: 0.3 }}
    >
      <motion.div
        className={`${SECTION_CONTAINER} text-center`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...defaultTransition, delay: 0.4 }}
      >
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Soldes Exceptionnelles</h2>
        <p className="text-primary-foreground/70 mb-6 max-w-xl mx-auto">
          Profitez de réductions allant jusqu&apos;à -30% sur une sélection de nos plus beaux articles. Offre limitée !
        </p>
        <Button
          onClick={onNavigateToCatalog}
          size="lg"
          className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
        >
          Voir les promotions <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </motion.div>
    </motion.section>
  )
}

