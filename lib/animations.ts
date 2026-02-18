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
 * Variantes d'animation pour les boutons
 */
export const buttonVariants: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
}

/**
 * Variantes d'animation pour les lignes de tableau
 */
export const tableRowVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
  hover: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    transition: {
      duration: 0.2,
    },
  },
}

/**
 * Variantes d'animation pour les toasts
 */
export const toastVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
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

export const slowTransition: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
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

/**
 * Stagger animation pour les listes
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

/**
 * Animation de shimmer pour les skeletons
 */
export const shimmerAnimation = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
}
