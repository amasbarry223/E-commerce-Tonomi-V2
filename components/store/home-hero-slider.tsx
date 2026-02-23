"use client"

/**
 * Composant Hero Slider pour la page d'accueil
 * Affiche un carrousel d'images hero avec navigation (données depuis le store ou fallback).
 */

import { useCallback, useEffect, useMemo, useState } from "react"
import React from "react"
import { AnimatePresence, motion, type Variants } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

import { ANIMATION_DELAYS, LAYOUT_CONSTANTS } from "@/lib/constants"
import { defaultTransition } from "@/lib/animations"
import { SECTION_FULL, SECTION_PADDING } from "@/lib/layout"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { Button } from "@/components/ui/button"
import { useHeroSlidesStore } from "@/lib/stores/hero-slides-store"
import { getDefaultHeroSlides } from "@/lib/services"

const HERO_SLIDE_INTERVAL = ANIMATION_DELAYS.HERO_SLIDE_INTERVAL
const SLIDE_OFFSET = LAYOUT_CONSTANTS.SLIDE_OFFSET

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
export const HeroSlider = React.memo(function HeroSlider({ onNavigateToCatalog }: HeroSliderProps) {
  const reducedMotion = useReducedMotion()
  const storeSlides = useHeroSlidesStore((s) => s.slides)
  const slidesToShow = useMemo(() => {
    const active = storeSlides.filter((s) => s.active).sort((a, b) => a.order - b.order)
    return active.length > 0 ? active : getDefaultHeroSlides()
  }, [storeSlides])

  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    queueMicrotask(() =>
      setCurrentSlide((prev) => Math.min(prev, Math.max(0, slidesToShow.length - 1)))
    )
  }, [slidesToShow.length])

  useEffect(() => {
    if (slidesToShow.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesToShow.length)
      setDirection(1)
    }, HERO_SLIDE_INTERVAL)
    return () => clearInterval(timer)
  }, [slidesToShow.length])

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection)
      if (newDirection === 1) {
        setCurrentSlide((prev) => (prev + 1) % slidesToShow.length)
      } else {
        setCurrentSlide((prev) => (prev - 1 + slidesToShow.length) % slidesToShow.length)
      }
    },
    [slidesToShow.length]
  )

  const handleSlideClick = useCallback(
    (index: number) => {
      setDirection(index > currentSlide ? 1 : -1)
      setCurrentSlide(index)
    },
    [currentSlide]
  )

  const slide = slidesToShow[currentSlide]
  if (!slide) return null

  const ctaHref = slide.ctaLink?.trim()
  const isExternalCta = ctaHref?.startsWith("http")

  return (
    <section className={`relative h-[60vh] md:h-[70vh] overflow-hidden ${SECTION_FULL}`} aria-label="Bandeau promotionnel">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Slide {currentSlide + 1} sur {slidesToShow.length} : {slide.title}
      </div>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slide.id}
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
            {slide.image.startsWith("data:") ? (
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover w-full h-full"
                unoptimized
                sizes="100vw"
              />
            ) : (
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority={currentSlide === 0}
              />
            )}
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
                  {slide.title}
                </h1>
                <p className="text-lg text-white/80 mb-6">{slide.subtitle}</p>
                {ctaHref ? (
                  <Button
                    asChild
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
                  >
                    <a
                      href={ctaHref}
                      target={isExternalCta ? "_blank" : undefined}
                      rel={isExternalCta ? "noopener noreferrer" : undefined}
                    >
                      {slide.ctaText} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </Button>
                ) : (
                  <Button
                    onClick={onNavigateToCatalog}
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
                  >
                    {slide.ctaText} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

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

      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10"
        role="tablist"
        aria-label="Indicateurs de navigation du slider"
      >
        {slidesToShow.map((s, i) => (
          <motion.button
            key={`hero-dot-${s.id}`}
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
})

