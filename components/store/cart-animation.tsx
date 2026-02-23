"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface CartAnimationProps {
  imageUrl: string
  productName: string
  startPosition: { x: number; y: number }
  endPosition: { x: number; y: number }
  onComplete: () => void
}

/**
 * Animation d'ajout au panier
 * Affiche l'image du produit se déplaçant vers l'icône du panier
 */
export function CartAnimation({
  imageUrl,
  productName,
  startPosition,
  endPosition,
  onComplete,
}: CartAnimationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Deux timers : (1) masquer l’animation après 800 ms, (2) appeler onComplete 300 ms après.
  // Le cleanup annule les deux pour éviter les fuites mémoire.
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      completeTimerRef.current = setTimeout(onComplete, 300)
    }, 800)

    return () => {
      clearTimeout(timer)
      if (completeTimerRef.current !== null) {
        clearTimeout(completeTimerRef.current)
        completeTimerRef.current = null
      }
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed z-[9999] pointer-events-none"
          initial={{
            x: startPosition.x,
            y: startPosition.y,
            scale: 1,
            opacity: 1,
          }}
          animate={{
            x: endPosition.x,
            y: endPosition.y,
            scale: 0.3,
            opacity: 0.8,
          }}
          exit={{
            scale: 0,
            opacity: 0,
          }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{
            width: 80,
            height: 80,
          }}
        >
          <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg border-2 border-primary">
            <Image
              src={imageUrl}
              alt={productName}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Hook pour gérer l'animation d'ajout au panier
 */
export function useCartAnimation() {
  const [animation, setAnimation] = useState<{
    imageUrl: string
    productName: string
    startPosition: { x: number; y: number }
    endPosition: { x: number; y: number }
  } | null>(null)

  const triggerAnimation = (
    imageUrl: string,
    productName: string,
    startElement: HTMLElement | null,
    endElement: HTMLElement | null
  ) => {
    if (!startElement || !endElement) return

    const startRect = startElement.getBoundingClientRect()
    const endRect = endElement.getBoundingClientRect()

    const startPosition = {
      x: startRect.left + startRect.width / 2 - 40, // Centrer sur l'élément
      y: startRect.top + startRect.height / 2 - 40,
    }

    const endPosition = {
      x: endRect.left + endRect.width / 2 - 12, // Centrer sur l'icône
      y: endRect.top + endRect.height / 2 - 12,
    }

    setAnimation({
      imageUrl,
      productName,
      startPosition,
      endPosition,
    })
  }

  const clearAnimation = () => {
    setAnimation(null)
  }

  return {
    animation,
    triggerAnimation,
    clearAnimation,
  }
}


