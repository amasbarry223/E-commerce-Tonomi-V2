/**
 * Composant ProductCard optimisé avec React.memo
 */
"use client"

import React, { useCallback, useMemo } from 'react'
import Image from 'next/image'
import { useCartStore } from '@/src/lib/stores/cart-store'
import { useWishlistStore } from '@/src/lib/stores/wishlist-store'
import { useUIStore } from '@/src/lib/stores/ui-store'
import { formatPrice, getBadgeColor, getStatusLabel } from '@/src/lib/utils'
import { cn } from '@/src/lib/utils/cn'
import type { Product } from '@/src/lib/types'
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProductCardProps {
  product: Product
}

export const ProductCard = React.memo<ProductCardProps>(({ product }) => {
  const addItem = useCartStore((state) => state.addItem)
  const toggleWishlist = useWishlistStore((state) => state.toggle)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist)
  const { navigate, selectProduct } = useUIStore()
  
  const wishlisted = useMemo(() => isInWishlist(product.id), [isInWishlist, product.id])
  
  const handleView = useCallback(() => {
    selectProduct(product.id)
    navigate('product')
  }, [product.id, selectProduct, navigate])
  
  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: product.colors[0]?.name,
      size: product.sizes[0],
      quantity: 1,
    })
  }, [product, addItem])
  
  const handleToggleWishlist = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    toggleWishlist(product.id)
  }, [product.id, toggleWishlist])
  
  const discountPercent = useMemo(() => {
    if (!product.originalPrice) return 0
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  }, [product.originalPrice, product.price])
  
  return (
    <div className="group relative bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={handleView}>
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        
        {/* Badge */}
        {product.badge && (
          <span className={cn(
            "absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold",
            getBadgeColor(product.badge)
          )}>
            {getStatusLabel(product.badge)}
          </span>
        )}
        
        {/* Wishlist */}
        <button
          onClick={handleToggleWishlist}
          className={cn(
            "absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center transition-all",
            wishlisted ? "bg-red-500 text-white" : "bg-card/80 backdrop-blur-sm text-foreground hover:bg-card"
          )}
          aria-label={wishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart className={cn("h-4 w-4", wishlisted && "fill-current")} />
        </button>
        
        {/* Quick actions overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button onClick={handleAddToCart} size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-xs gap-1.5">
            <ShoppingBag className="h-3.5 w-3.5" />
            Ajouter
          </Button>
          <Button onClick={(e) => { e.stopPropagation(); handleView() }} size="sm" variant="secondary" className="gap-1.5 text-xs">
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        <h3 
          className="font-medium text-sm leading-tight mb-2 cursor-pointer hover:text-accent transition-colors line-clamp-2" 
          onClick={handleView}
        >
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              className={cn(
                "h-3 w-3",
                i < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted"
              )} 
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
        </div>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-xs font-semibold text-red-500">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>
        
        {/* Colors */}
        <div className="flex gap-1 mt-2">
          {product.colors.slice(0, 4).map((color) => (
            <span
              key={color.hex}
              className="h-4 w-4 rounded-full border border-border"
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`Couleur ${color.name}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
})

ProductCard.displayName = 'ProductCard'

