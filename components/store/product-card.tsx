"use client"

import { useStore } from "@/lib/store-context"
import { type Product, formatPrice, getBadgeColor, getStatusLabel } from "@/lib/data"
import { Heart, ShoppingBag, Star, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cardVariants, getReducedMotionConfig, fastTransition } from "@/lib/animations"

const cardAnimationVariants = getReducedMotionConfig(cardVariants)

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, toggleWishlist, isInWishlist, navigate, selectProduct } = useStore()
  const wishlisted = isInWishlist(product.id)

  const handleView = () => {
    selectProduct(product.id)
    navigate("product")
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: product.colors[0]?.name,
      size: product.sizes[0],
      quantity: 1,
    })
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
      <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={handleView}>
        <motion.img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          crossOrigin="anonymous"
        />

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${getBadgeColor(product.badge)}`}>
            {getStatusLabel(product.badge)}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id) }}
          className={`absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center transition-all ${
            wishlisted ? "bg-red-500 text-white" : "bg-card/80 backdrop-blur-sm text-foreground hover:bg-card"
          }`}
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
          <Button onClick={handleAddToCart} size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-xs gap-1.5">
            <ShoppingBag className="h-3.5 w-3.5" />
            Ajouter
          </Button>
          <Button onClick={(e) => { e.stopPropagation(); handleView() }} size="sm" variant="secondary" className="gap-1.5 text-xs">
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        <h3 className="font-medium text-sm leading-tight mb-2 cursor-pointer hover:text-accent transition-colors line-clamp-2" onClick={handleView}>
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
    </motion.div>
  )
}
