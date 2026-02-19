"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { fastTransition } from "@/lib/animations"

interface CarouselDotsProps {
  total: number
  current: number
  onDotClick: (index: number) => void
  ariaLabel?: string
  className?: string
}

/**
 * Composant réutilisable pour les indicateurs de navigation (dots)
 * Centralise la logique et les styles des dots
 */
export function CarouselDots({
  total,
  current,
  onDotClick,
  ariaLabel = "Indicateurs de navigation du carrousel",
  className,
}: CarouselDotsProps) {
  if (total <= 1) return null

  return (
    <div
      className={cn("flex justify-center items-center gap-2 mt-8", className)}
      role="tablist"
      aria-label={ariaLabel}
    >
      {Array.from({ length: total }, (_, index) => (
        <motion.button
          key={`dot-${index}`}
          onClick={() => onDotClick(index)}
          className={cn(
            "rounded-full transition-all duration-300",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            index === current
              ? "bg-primary"
              : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
          )}
          animate={{
            width: index === current ? 32 : 8,
            height: 8,
          }}
          transition={fastTransition}
          aria-label={`Aller au groupe de slides ${index + 1}`}
          aria-selected={index === current}
          role="tab"
          type="button"
        />
      ))}
    </div>
  )
}

