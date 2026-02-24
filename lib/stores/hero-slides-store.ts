/**
 * Store Zustand pour les slides de la bannière hero (page d'accueil).
 * Persisté en localStorage pour que les modifications admin soient conservées.
 */
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { HeroSlide } from "@/lib/types"
import { getDefaultHeroSlides } from "@/lib/services/hero-slides"

const STORAGE_KEY = "tonomi_hero_slides"

interface HeroSlidesState {
  slides: HeroSlide[]
  setSlides: (slides: HeroSlide[]) => void
  addSlide: (slide: Omit<HeroSlide, "id">) => void
  updateSlide: (id: string, patch: Partial<HeroSlide>) => void
  removeSlide: (id: string) => void
  reorderSlides: (idA: string, idB: string) => void
}

function generateId(): string {
  return `hero-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useHeroSlidesStore = create<HeroSlidesState>()(
  persist(
    (set, get) => ({
      slides: getDefaultHeroSlides(),

      setSlides: (slides) => set({ slides }),

      addSlide: (slide) => {
        const id = generateId()
        const slides = [...get().slides, { ...slide, id }]
        set({ slides })
      },

      updateSlide: (id, patch) => {
        set({
          slides: get().slides.map((s) =>
            s.id === id ? { ...s, ...patch } : s
          ),
        })
      },

      removeSlide: (id) => {
        set({ slides: get().slides.filter((s) => s.id !== id) })
      },

      reorderSlides: (idA, idB) => {
        const slides = get().slides
        const slideA = slides.find((s) => s.id === idA)
        const slideB = slides.find((s) => s.id === idB)
        if (!slideA || !slideB) return
        set({
          slides: slides.map((s) => {
            if (s.id === idA) return { ...s, order: slideB.order }
            if (s.id === idB) return { ...s, order: slideA.order }
            return s
          }),
        })
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ slides: state.slides }),
      onRehydrateStorage: () => (persistedState) => {
        const state = persistedState as { slides?: HeroSlide[] } | undefined
        if (!state?.slides?.length) {
          useHeroSlidesStore.setState({ slides: getDefaultHeroSlides() })
        }
      },
    }
  )
)

/** Retourne les slides actives triées par ordre (pour affichage hero). */
export function getActiveHeroSlides(): HeroSlide[] {
  return useHeroSlidesStore
    .getState()
    .slides.filter((s) => s.active)
    .sort((a, b) => a.order - b.order)
}
