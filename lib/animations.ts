import { Variants, Transition } from 'framer-motion'

/**
 * Vérifie si l'utilisateur préfère les animations réduites
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Variantes d'animation pour les modales
 */
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
}

/**
 * Variantes d'animation pour les overlays
 */
export const overlayVariants: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
  },
  visible: {
    opacity: 1,
    backdropFilter: 'blur(4px)',
  },
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
  },
}

/**
 * Variantes d'animation pour les sheets (panneaux latéraux)
 */
export const sheetVariants = (side: 'top' | 'right' | 'bottom' | 'left'): Variants => {
  const isHorizontal = side === 'left' || side === 'right'
  const isVertical = side === 'top' || side === 'bottom'
  
  return {
    hidden: {
      opacity: 0,
      x: isHorizontal ? (side === 'left' ? '-100%' : '100%') : 0,
      y: isVertical ? (side === 'top' ? '-100%' : '100%') : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
    exit: {
      opacity: 0,
      x: isHorizontal ? (side === 'left' ? '-100%' : '100%') : 0,
      y: isVertical ? (side === 'top' ? '-100%' : '100%') : 0,
    },
  }
}

/**
 * Variantes d'animation pour les pages
 */
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
}

/**
 * Variantes d'animation pour les cartes produits
 */
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
}

/**
 * Transitions par défaut
 */
export const defaultTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}

export const fastTransition: Transition = {
  type: 'tween',
  duration: 0.2,
  ease: 'easeOut',
}

/**
 * Configuration pour les animations réduites
 */
export const getReducedMotionConfig = (variants: Variants): Variants => {
  if (prefersReducedMotion()) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    }
  }
  return variants
}
