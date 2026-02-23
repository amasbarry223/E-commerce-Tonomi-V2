/**
 * Service hero slides (bannières).
 * À terme : appels API. Pour l'instant : accès via lib/data.
 */

import { defaultHeroSlides } from "@/lib/data"
import type { HeroSlide } from "@/lib/types"

export function getDefaultHeroSlides(): HeroSlide[] {
  return defaultHeroSlides
}
