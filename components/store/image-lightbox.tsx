"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface ImageLightboxProps {
  images: string[]
  initialIndex?: number
  productName: string
  isOpen: boolean
  onClose: () => void
}

/**
 * Lightbox pour afficher les images produits en grand format
 * Avec zoom et navigation entre les images
 */
export function ImageLightbox({
  images,
  initialIndex = 0,
  productName,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Réinitialiser l'index et le zoom quand la lightbox s'ouvre
  useEffect(() => {
    if (isOpen) {
      queueMicrotask(() => {
        setCurrentIndex(initialIndex)
        setZoom(1)
        setPosition({ x: 0, y: 0 })
      })
    }
  }, [isOpen, initialIndex])

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % images.length)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }, [images.length])

  // Navigation clavier (deps complètes pour éviter closure stale)
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          goToPrevious()
          break
        case "ArrowRight":
          e.preventDefault()
          goToNext()
          break
        case "Escape":
          e.preventDefault()
          onClose()
          break
        case "+":
        case "=":
          e.preventDefault()
          setZoom(prev => Math.min(prev + 0.25, 3))
          break
        case "-":
          e.preventDefault()
          setZoom(prev => Math.max(prev - 0.25, 0.5))
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, goToPrevious, goToNext, onClose])

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.5, 1)
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 })
      }
      return newZoom
    })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      setZoom(prev => {
        const newZoom = Math.max(0.5, Math.min(3, prev + delta))
        if (newZoom === 1) {
          setPosition({ x: 0, y: 0 })
        }
        return newZoom
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-none"
        onInteractOutside={(e) => {
          // Empêcher la fermeture si on est en train de zoomer/dragger
          if (zoom > 1) {
            e.preventDefault()
          }
        }}
      >
        <VisuallyHidden>
          <DialogTitle>Lightbox - {productName}</DialogTitle>
        </VisuallyHidden>
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Bouton fermer */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            aria-label="Fermer la lightbox"
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Navigation précédente */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-4 z-50 text-white hover:bg-white/20"
              aria-label="Image précédente"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}

          {/* Navigation suivante */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="absolute right-4 z-50 text-white hover:bg-white/20"
              aria-label="Image suivante"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}

          {/* Contrôles de zoom */}
          <div className="absolute top-4 left-4 z-50 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="text-white hover:bg-white/20"
              aria-label="Zoomer"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="text-white hover:bg-white/20"
              aria-label="Dézoomer"
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            {zoom > 1 && (
              <span className="flex items-center px-3 text-white text-sm">
                {Math.round(zoom * 100)}%
              </span>
            )}
          </div>

          {/* Image */}
          <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                }}
              >
                <Image
                  src={images[currentIndex]}
                  alt={`${productName} - Image ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicateur d'images */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    setZoom(1)
                    setPosition({ x: 0, y: 0 })
                  }}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    index === currentIndex
                      ? "w-8 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/75"
                  )}
                  aria-label={`Aller à l'image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Compteur d'images */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 z-50 text-white text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

