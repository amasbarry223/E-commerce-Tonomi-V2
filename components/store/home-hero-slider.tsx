"use client"

/**
 * Composant Hero Slider pour la page d'accueil
 * Affiche un carrousel d'images hero avec navigation
 */

// Standard library imports
import { useCallback, useEffect, useState } from "react"

// Third-party imports
import { AnimatePresence, motion, type Variants } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

// Internal imports
import { ANIMATION_DELAYS, LAYOUT_CONSTANTS } from "@/lib/constants"
import { defaultTransition } from "@/lib/animations"
import { SECTION_FULL, SECTION_PADDING } from "@/lib/layout"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { Button } from "@/components/ui/button"

const HERO_SLIDE_INTERVAL = ANIMATION_DELAYS.HERO_SLIDE_INTERVAL
const SLIDE_OFFSET = LAYOUT_CONSTANTS.SLIDE_OFFSET

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1400&h=600&fit=crop",
    title: "Collection Automne-Hiver",
    subtitle: "Découvrez nos nouveaux modèles en cuir véritable",
    cta: "Voir la collection",
  },
  {
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1400&h=600&fit=crop",
    title: "Soldes Exceptionnelles",
    subtitle: "Jusqu'à -30% sur une sélection d'articles",
    cta: "En profiter",
  },
  {
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1400&h=600&fit=crop",
    title: "Accessoires de Luxe",
    subtitle: "L'élégance au quotidien",
    cta: "Découvrir",
  },
] as const

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? SLIDE_OFFSET : -SLIDE_OFFSET,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? SLIDE_OFFSET : -SLIDE_OFFSET,
    opacity: 0,
  }),
}

interface HeroSliderProps {
  onNavigateToCatalog: () => void
}

/**
 * Composant Hero Slider
 * 
 * @param onNavigateToCatalog - Callback appelé lors du clic sur le CTA
 */
export function HeroSlider({ onNavigateToCatalog }: HeroSliderProps) {
  const reducedMotion = useReducedMotion()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)

  // Auto-advance hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
      setDirection(1)
    }, HERO_SLIDE_INTERVAL)
    return () => clearInterval(timer)
  }, [])

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection)
    if (newDirection === 1) {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    } else {
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    }
  }, [])

  const handleSlideClick = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1)
    setCurrentSlide(index)
  }, [currentSlide])

  return (
    <section className={`relative h-[60vh] md:h-[70vh] overflow-hidden ${SECTION_FULL}`}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={defaultTransition}
          className="absolute inset-0"
        >
          <motion.div
            className="h-full w-full"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 5, ease: "easeOut" }}
          >
            <Image
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              fill
              className="object-cover"
              sizes="100vw"
              priority={currentSlide === 0}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full ${SECTION_PADDING}`}>
              <motion.div
                className="max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, ...defaultTransition }}
              >
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-4 text-balance leading-tight">
                  {heroSlides[currentSlide].title}
                </h1>
                <p className="text-lg text-white/80 mb-6">{heroSlides[currentSlide].subtitle}</p>
                <Button
                  onClick={onNavigateToCatalog}
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
                >
                  {heroSlides[currentSlide].cta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slider controls */}
      <motion.button
        onClick={() => paginate(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
        whileHover={!reducedMotion ? { scale: 1.1 } : {}}
        whileTap={!reducedMotion ? { scale: 0.9 } : {}}
        aria-label="Slide précédent"
        type="button"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </motion.button>
      <motion.button
        onClick={() => paginate(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
        whileHover={!reducedMotion ? { scale: 1.1 } : {}}
        whileTap={!reducedMotion ? { scale: 0.9 } : {}}
        aria-label="Slide suivant"
        type="button"
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </motion.button>

      {/* Dots */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10"
        role="tablist"
        aria-label="Indicateurs de navigation du slider"
      >
        {heroSlides.map((_, i) => (
          <motion.button
            key={`hero-dot-${i}`}
            onClick={() => handleSlideClick(i)}
            className={`h-2 rounded-full transition-colors ${
              i === currentSlide ? "bg-white" : "bg-white/50 hover:bg-white/70"
            }`}
            animate={{
              width: i === currentSlide ? 32 : 8,
            }}
            transition={defaultTransition}
            aria-label={`Aller au slide ${i + 1}`}
            aria-selected={i === currentSlide}
            role="tab"
            type="button"
          />
        ))}
      </div>
    </section>
  )
}

