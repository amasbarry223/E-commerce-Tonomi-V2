"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ProductCardSkeletonProps {
  className?: string
}

/**
 * Skeleton loader pour ProductCard
 * Utilisé pendant le chargement des produits pour améliorer la perception de performance
 */
export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div className={cn("bg-card rounded-lg overflow-hidden border border-border", className)}>
      {/* Image skeleton */}
      <Skeleton variant="image" className="aspect-square w-full" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        <Skeleton variant="text" className="h-3 w-1/4" />

        {/* Product name - 2 lines */}
        <div className="space-y-2">
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-3/4" />
        </div>

        {/* Rating skeleton */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-3 rounded-full" />
          ))}
          <Skeleton variant="text" className="h-3 w-8 ml-1" />
        </div>

        {/* Price skeleton */}
        <Skeleton variant="text" className="h-5 w-1/3" />

        {/* Colors skeleton */}
        <div className="flex gap-1 mt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-4 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Composant pour afficher plusieurs skeletons en grille
 * Utile pour les pages de catalogue
 */
export function ProductCardSkeletonGrid({ 
  count = 8, 
  className 
}: { 
  count?: number
  className?: string 
}) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

