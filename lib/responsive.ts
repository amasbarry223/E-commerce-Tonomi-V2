/**
 * Configuration responsive pour le projet
 * Breakpoints Tailwind par défaut:
 * sm: 640px
 * md: 768px
 * lg: 1024px
 * xl: 1280px
 * 2xl: 1536px
 */

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export const spacing = {
  mobile: {
    padding: 'p-4',
    gap: 'gap-4',
    margin: 'm-4',
  },
  tablet: {
    padding: 'md:p-6',
    gap: 'md:gap-6',
    margin: 'md:m-6',
  },
  desktop: {
    padding: 'lg:p-8',
    gap: 'lg:gap-8',
    margin: 'lg:m-8',
  },
} as const

export const typography = {
  mobile: {
    h1: 'text-2xl md:text-3xl lg:text-4xl',
    h2: 'text-xl md:text-2xl lg:text-3xl',
    h3: 'text-lg md:text-xl lg:text-2xl',
    body: 'text-sm md:text-base',
  },
  tablet: {
    h1: 'md:text-3xl lg:text-4xl',
    h2: 'md:text-2xl lg:text-3xl',
    h3: 'md:text-xl lg:text-2xl',
    body: 'md:text-base',
  },
  desktop: {
    h1: 'lg:text-4xl xl:text-5xl',
    h2: 'lg:text-3xl xl:text-4xl',
    h3: 'lg:text-2xl xl:text-3xl',
    body: 'lg:text-base',
  },
} as const

export const grid = {
  mobile: 'grid-cols-1 sm:grid-cols-2',
  tablet: 'md:grid-cols-3',
  desktop: 'lg:grid-cols-4 xl:grid-cols-5',
  products: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  categories: 'grid-cols-2 md:grid-cols-4',
} as const

export const container = {
  mobile: 'px-4',
  tablet: 'md:px-6',
  desktop: 'lg:px-8 xl:px-12',
  maxWidth: 'max-w-7xl mx-auto',
} as const

/**
 * Configuration pour les items par vue dans les carrousels
 */
export type ItemsPerViewConfig = {
  mobile: number
  tablet: number
  desktop: number
}

/**
 * Configuration par défaut pour les carrousels de produits
 */
export const CAROUSEL_ITEMS_PER_VIEW: ItemsPerViewConfig = {
  mobile: 1,
  tablet: 2,
  desktop: 4,
} as const

/**
 * Délai de debounce pour les handlers de resize (en ms)
 */
export const RESIZE_DEBOUNCE_DELAY = 150