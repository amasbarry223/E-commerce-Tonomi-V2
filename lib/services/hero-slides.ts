/**
 * Service hero slides
 */

import { heroSlideRepository } from "@/lib/repositories"
import type { HeroSlide } from "@/lib/types"

/**
 * Récupère tous les slides hero actifs
 */
export async function getHeroSlides(): Promise<HeroSlide[]> {
  const slides = await heroSlideRepository.findActive()
  return slides.map((slide) => ({
    id: slide.id,
    image: slide.image,
    title: slide.title,
    subtitle: slide.subtitle,
    ctaText: slide.ctaText,
    ctaLink: slide.ctaLink || undefined,
    order: slide.order,
    active: slide.active,
  }))
}
