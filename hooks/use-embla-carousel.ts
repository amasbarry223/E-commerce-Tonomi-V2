"use client"

import { useState, useEffect, useCallback } from "react"
import type { UseEmblaCarouselType } from "embla-carousel-react"

/**
 * Type pour l'API Embla (deuxième élément du tuple retourné par useEmblaCarousel)
 */
type EmblaCarouselApi = UseEmblaCarouselType[1]

/**
 * État et méthodes pour gérer un carrousel Embla
 */
export interface UseEmblaCarouselStateReturn {
  selectedIndex: number
  canScrollPrev: boolean
  canScrollNext: boolean
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: (index: number) => void
}

/**
 * Hook réutilisable pour gérer l'état d'un carrousel Embla
 * Encapsule la logique commune : état, callbacks, event listeners
 */
export function useEmblaCarouselState(
  emblaApi: EmblaCarouselApi
): UseEmblaCarouselStateReturn {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    queueMicrotask(onSelect)
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)

    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index)
    },
    [emblaApi]
  )

  return {
    selectedIndex,
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
    scrollTo,
  }
}

