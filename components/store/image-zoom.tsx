"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ZoomIn, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

interface ImageZoomProps {
  src: string
  alt: string
  className?: string
  zoomLevel?: number
  enableHoverZoom?: boolean
  enableClickZoom?: boolean
}

/**
 * Composant de zoom d'image avec deux modes :
 * 1. Zoom au survol : loupe qui suit le curseur (comme les sites e-commerce)
 * 2. Zoom au clic : overlay fullscreen pour zoomer sans perturber le layout
 */
export function ImageZoom({
  src,
  alt,
  className,
  zoomLevel = 2.5,
  enableHoverZoom = true,
  enableClickZoom = true,
}: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const magnifierRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Calculer la position de la souris relative au conteneur
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isZoomed) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Limiter les valeurs entre 0 et 100
    const clampedX = Math.max(0, Math.min(100, x))
    const clampedY = Math.max(0, Math.min(100, y))

    setMousePosition({ x: clampedX, y: clampedY })
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  const toggleZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setIsZoomed((prev) => !prev)
    setIsHovering(false)
  }

  const closeZoom = () => {
    setIsZoomed(false)
  }

  // Réinitialiser le zoom au clic en dehors ou Échap
  useEffect(() => {
    if (!isZoomed) return

    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        closeZoom()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeZoom()
      }
    }

    // Empêcher le scroll du body quand le zoom est actif
    document.body.style.overflow = "hidden"

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isZoomed])

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "relative aspect-square rounded-lg overflow-hidden bg-secondary group",
          className
        )}
        onMouseMove={enableHoverZoom && !isZoomed ? handleMouseMove : undefined}
        onMouseLeave={enableHoverZoom && !isZoomed ? handleMouseLeave : undefined}
      >
        {/* Image principale */}
        <div
          className="relative w-full h-full cursor-zoom-in"
          onClick={enableClickZoom ? toggleZoom : undefined}
          role={enableClickZoom ? "button" : undefined}
          tabIndex={enableClickZoom ? 0 : undefined}
          onKeyDown={(e) => {
            if (enableClickZoom && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault()
              toggleZoom()
            }
          }}
          aria-label={enableClickZoom ? "Zoomer l'image" : undefined}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Loupe au survol (mode hover zoom) - Desktop uniquement */}
        {enableHoverZoom && isHovering && !isZoomed && (
          <div
            ref={magnifierRef}
            className="absolute pointer-events-none z-20 hidden md:block"
            style={{
              width: "300px",
              height: "300px",
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              border: "3px solid rgba(255, 255, 255, 0.8)",
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
              backgroundImage: `url(${src})`,
              backgroundSize: `${zoomLevel * 100}%`,
              backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
              backgroundRepeat: "no-repeat",
              clipPath: "circle(50%)",
              transition: "opacity 0.2s ease-out",
            }}
          />
        )}

        {/* Bouton de zoom toggle (mode click zoom) */}
        {enableClickZoom && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleZoom}
            className={cn(
              "absolute bottom-4 right-4 z-30 bg-background/90 backdrop-blur-sm hover:bg-background border border-border/50",
              "transition-opacity shadow-lg",
              "opacity-0 group-hover:opacity-100 md:opacity-100"
            )}
            aria-label="Zoomer l'image"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Overlay fullscreen pour le zoom au clic */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
            onClick={closeZoom}
          >
            {/* Conteneur de l'image zoomée */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-7xl w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full max-h-[90vh]">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Bouton fermer */}
              <Button
                variant="ghost"
                size="icon"
                onClick={closeZoom}
                className="absolute top-4 right-4 z-40 bg-background/90 backdrop-blur-sm hover:bg-background border border-border/50 text-foreground"
                aria-label="Fermer le zoom"
              >
                <X className="h-5 w-5" />
              </Button>

              {/* Indicateur */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-md text-sm font-medium border border-border/50 shadow-lg">
                Cliquez en dehors ou appuyez sur Échap pour fermer
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

