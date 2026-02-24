"use client"

import React, { useState, useRef } from "react"
import Image from "next/image"
import { useCartActions, useNavigationStore, useUIStore } from "@/lib/store-context"
import { PAGES } from "@/lib/routes"
import type { Product } from "@/lib/types"
import { formatPrice, getBadgeColor, getStatusLabel } from "@/lib/formatters"
import { Heart, ShoppingBag, Star, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cardVariants, getReducedMotionConfig, fastTransition } from "@/lib/animations"
import { useCartToast } from "@/hooks/use-cart-toast"
import { CartAnimation, useCartAnimation } from "./cart-animation"
import { ProductQuickView } from "./product-quick-view"
import { useCartButtonRef } from "@/hooks/use-cart-button-ref"

const cardAnimationVariants = getReducedMotionConfig(cardVariants)

export const ProductCard = React.memo(function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart } = useCartActions()
  const { navigate, selectProduct } = useNavigationStore()
  const { toggleWishlist, isInWishlist } = useUIStore()
  const { showAddToCartToast } = useCartToast()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const wishlisted = isInWishlist(product.id)
  const imageRef = useRef<HTMLDivElement>(null)
  const cartButtonRef = useCartButtonRef()
  const { animation, triggerAnimation, clearAnimation } = useCartAnimation()

  const handleView = () => {
    selectProduct(product.id)
    navigate(PAGES.store.product)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation()
    setQuickViewOpen(true)
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAddingToCart(true)

    // Add to cart immediately for better responsiveness
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      color: product.colors[0]?.name,
      size: product.sizes[0] ?? undefined,
      quantity: 1,
    })

    showAddToCartToast(product.name)

    try {
      const cartButton = cartButtonRef.current
      const firstImage = product.images[0]

      if (imageRef.current && cartButton && firstImage) {
        triggerAnimation(
          firstImage,
          product.name,
          imageRef.current,
          cartButton
        )
      }

      // Delay only the "loading" visual state if needed, but not the actual operation
      await new Promise((resolve) => setTimeout(resolve, 500))
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <motion.div
      className="group relative bg-card rounded-lg overflow-hidden border border-border"
      variants={cardAnimationVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{
        ...fastTransition,
        delay: index * 0.05,
      }}
      style={{ willChange: 'transform' }}
    >
      {/* Image */}
      <div
        ref={imageRef}
        className="relative aspect-square overflow-hidden cursor-pointer"
        onClick={handleView}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="h-full w-full"
        >
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg"
            }}
          />
        </motion.div>

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${getBadgeColor(product.badge)}`}>
            {getStatusLabel(product.badge)}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id) }}
          className={`absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center transition-all ${wishlisted ? "bg-red-500 text-white" : "bg-card/80 backdrop-blur-sm text-foreground hover:bg-card"
            }`}
          aria-label={wishlisted ? `Retirer ${product.name} des favoris` : `Ajouter ${product.name} aux favoris`}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Quick actions overlay */}
        <motion.div
          className="absolute inset-x-0 bottom-0 p-3 flex gap-2"
          initial={{ y: "100%" }}
          whileHover={{ y: 0 }}
          transition={fastTransition}
        >
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-xs gap-1.5"
            loading={isAddingToCart}
            disabled={isAddingToCart}
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Ajouter
          </Button>
          <Button
            onClick={handleQuickView}
            size="sm"
            variant="secondary"
            className="gap-1.5 text-xs"
            aria-label={`Voir rapidement ${product.name}`}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        <h3
          className="font-medium text-sm leading-tight mb-2 cursor-pointer hover:text-accent transition-colors line-clamp-2"
          onClick={handleView}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleView()
            }
          }}
          aria-label={`Voir les détails de ${product.name}`}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
          )}
          {product.originalPrice && (
            <span className="text-xs font-semibold text-red-500">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
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
            />
          ))}
        </div>
      </div>

      {/* Cart Animation */}
      {animation && (
        <CartAnimation
          imageUrl={animation.imageUrl}
          productName={animation.productName}
          startPosition={animation.startPosition}
          endPosition={animation.endPosition}
          onComplete={clearAnimation}
        />
      )}

      {/* Quick View Modal */}
      <ProductQuickView
        product={product}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </motion.div>
  )
})
