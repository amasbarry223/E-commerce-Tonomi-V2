"use client"

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "./product-card"
import { ProductCardSkeleton } from "./product-card-skeleton"
import { CarouselNavigationButton } from "./carousel-navigation-button"
import { CarouselDots } from "./carousel-dots"
import type { Product } from "@/lib/types"
import { defaultTransition, fastTransition, getReducedMotionConfig } from "@/lib/animations"
import { CAROUSEL_ITEMS_PER_VIEW, type ItemsPerViewConfig } from "@/lib/responsive"
import { useResponsiveItems } from "@/hooks/use-responsive-items"
import { useEmblaCarouselState } from "@/hooks/use-embla-carousel"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

interface ProductCarouselProps {
  products: Product[]
  title: string
  subtitle?: string
  showViewAll?: boolean
  onViewAll?: () => void
  autoPlay?: boolean
  autoPlayInterval?: number
  itemsPerView?: ItemsPerViewConfig
  isLoading?: boolean
  className?: string
}

// Variants d'animation mémorisés en dehors du composant
const containerVariants = getReducedMotionConfig({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
})

const itemVariants = getReducedMotionConfig({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
})

export const ProductCarousel = React.memo(function ProductCarousel({
  products,
  title,
  subtitle,
  showViewAll = true,
  onViewAll,
  autoPlay = false,
  autoPlayInterval = 5000,
  itemsPerView = CAROUSEL_ITEMS_PER_VIEW,
  isLoading = false,
  className,
}: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
      loop: false,
      dragFree: false,
    },
    []
  )

  const {
    selectedIndex,
    canScrollPrev,
    canScrollNext,
    scrollPrev: baseScrollPrev,
    scrollNext: baseScrollNext,
    scrollTo,
  } = useEmblaCarouselState(emblaApi)

  const currentItemsPerView = useResponsiveItems(itemsPerView)
  const reducedMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Scroll functions optimisées pour scroller par groupes d'items
  const scrollNext = useCallback(() => {
    if (!emblaApi) return
    const currentIndex = emblaApi.selectedScrollSnap()
    const nextIndex = Math.min(currentIndex + currentItemsPerView, products.length - 1)
    if (nextIndex !== currentIndex) {
      emblaApi.scrollTo(nextIndex)
    } else {
      baseScrollNext()
    }
  }, [emblaApi, currentItemsPerView, products.length, baseScrollNext])

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return
    const currentIndex = emblaApi.selectedScrollSnap()
    const prevIndex = Math.max(currentIndex - currentItemsPerView, 0)
    if (prevIndex !== currentIndex) {
      emblaApi.scrollTo(prevIndex)
    } else {
      baseScrollPrev()
    }
  }, [emblaApi, currentItemsPerView, baseScrollPrev])

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || !emblaApi || isHovered || reducedMotion) {
      return
    }

    const startAutoPlay = () => {
      autoPlayTimerRef.current = setInterval(() => {
        if (emblaApi.canScrollNext()) {
          emblaApi.scrollNext()
        } else {
          emblaApi.scrollTo(0)
        }
      }, autoPlayInterval)
    }

    startAutoPlay()

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current)
        autoPlayTimerRef.current = null
      }
    }
  }, [autoPlay, emblaApi, autoPlayInterval, isHovered, reducedMotion])

  // Pause auto-play on hover
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current)
      autoPlayTimerRef.current = null
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  // Calculate slide groups for dots
  const { totalSlideGroups, currentSlideGroup } = useMemo(() => {
    // Ensure minimum items per view to prevent division by zero
    const safeItemsPerView = Math.max(1, currentItemsPerView)
    const total = Math.ceil(products.length / safeItemsPerView)
    const current = Math.floor(selectedIndex / safeItemsPerView)
    return { totalSlideGroups: total, currentSlideGroup: current }
  }, [products.length, currentItemsPerView, selectedIndex])

  // Handler pour les dots
  const handleDotClick = useCallback(
    (index: number) => {
      scrollTo(index * currentItemsPerView)
    },
    [scrollTo, currentItemsPerView]
  )

  // Calculer showNavigation AVANT les early returns (toujours appelé)
  const showNavigation = products.length > currentItemsPerView

  // Mémoriser les classes CSS pour les items du carrousel
  // IMPORTANT: Tous les hooks doivent être appelés AVANT les early returns
  const itemClassName = useMemo(
    () =>
      cn(
        "flex-shrink-0",
        "w-full min-w-0",
        itemsPerView.tablet === 2 && "md:w-[calc(50%-0.75rem)]",
        itemsPerView.desktop === 4 &&
          "md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
      ),
    [itemsPerView.tablet, itemsPerView.desktop]
  )

  // Early returns APRÈS tous les hooks
  if (isLoading) {
    return (
      <div className={cn("w-full", className)}>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl font-bold mb-2">{title}</h2>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
          {showViewAll && onViewAll && (
            <Button variant="outline" onClick={onViewAll} className="gap-2">
              Tout voir <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: currentItemsPerView }).map((_, i) => (
            <ProductCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <motion.div
      className={cn("w-full", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <motion.h2
            className="font-serif text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={defaultTransition}
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...defaultTransition, delay: 0.1 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        {showViewAll && onViewAll && (
          <motion.div
            whileHover={!reducedMotion ? { scale: 1.05 } : {}}
            whileTap={!reducedMotion ? { scale: 0.95 } : {}}
          >
            <Button variant="outline" onClick={onViewAll} className="gap-2">
              Tout voir <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 md:gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className={itemClassName}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{
                  ...fastTransition,
                  delay: index * 0.05,
                }}
              >
                <ProductCard product={product} index={index} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        {showNavigation && (
          <>
            <CarouselNavigationButton
              direction="prev"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              ariaLabel="Produit précédent"
            />
            <CarouselNavigationButton
              direction="next"
              onClick={scrollNext}
              disabled={!canScrollNext}
              ariaLabel="Produit suivant"
            />
          </>
        )}

        {/* Dots Indicators */}
        <CarouselDots
          total={totalSlideGroups}
          current={currentSlideGroup}
          onDotClick={handleDotClick}
        />
      </div>
    </motion.div>
  )
})
