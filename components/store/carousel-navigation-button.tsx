"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface CarouselNavigationButtonProps {
  direction: "prev" | "next"
  onClick: () => void
  disabled?: boolean
  ariaLabel: string
  className?: string
}

/**
 * Composant réutilisable pour les boutons de navigation des carrousels
 * Centralise les classes CSS et la logique d'animation
 */
export function CarouselNavigationButton({
  direction,
  onClick,
  disabled = false,
  ariaLabel,
  className,
}: CarouselNavigationButtonProps) {
  const reducedMotion = useReducedMotion()

  const Icon = direction === "prev" ? ChevronLeft : ChevronRight
  const translateX = direction === "prev" ? -2 : 2

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "absolute top-1/2 -translate-y-1/2",
        direction === "prev"
          ? "left-0 -translate-x-4 md:-translate-x-6"
          : "right-0 translate-x-4 md:translate-x-6",
        "h-10 w-10 md:h-12 md:w-12 rounded-full",
        "bg-background/80 backdrop-blur-sm border border-border",
        "flex items-center justify-center",
        "text-foreground hover:text-primary",
        "shadow-lg hover:shadow-xl",
        "transition-all duration-200",
        "z-10",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "hidden md:flex",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      whileHover={!reducedMotion ? { scale: 1.1, x: translateX } : {}}
      whileTap={!reducedMotion ? { scale: 0.9 } : {}}
      aria-label={ariaLabel}
      type="button"
    >
      <Icon className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
    </motion.button>
  )
}

