"use client"

import { useState } from "react"
import Image from "next/image"
import { useCartActions, useNavigationStore, useUIStore } from "@/lib/store-context"
import { PAGES } from "@/lib/routes"
import type { Product } from "@/lib/types"
import { LAYOUT_CONSTANTS, ANIMATION_DELAYS } from "@/lib/constants"
import { PRODUCT_BADGE } from "@/lib/status-types"
import { Star, Truck, RotateCcw, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useCartToast } from "@/hooks/use-cart-toast"
import { ProductPurchaseBlock } from "./product-purchase-block"

interface ProductQuickViewProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductQuickView({ product, open, onOpenChange }: ProductQuickViewProps) {
  const { addToCart } = useCartActions()
  const { navigate, selectProduct } = useNavigationStore()
  const { toggleWishlist, isInWishlist } = useUIStore()
  const { showAddToCartToast } = useCartToast()
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  if (!product) return null

  const wishlisted = isInWishlist(product.id)

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    
    try {
      await new Promise((resolve) => setTimeout(resolve, ANIMATION_DELAYS.CART_ANIMATION_DELAY))
      
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] ?? "",
        color: product.colors[selectedColor]?.name,
        size: product.sizes[selectedSize],
        quantity,
      })
      
      showAddToCartToast(product.name)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleToggleWishlist = () => {
    toggleWishlist(product.id)
    // Le toast sera géré par le store si nécessaire
  }

  const handleViewDetails = () => {
    selectProduct(product.id)
    navigate(PAGES.store.product)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl">{product.name}</span>
            {product.badge && (
              <Badge className="text-xs" variant="secondary">
                {product.badge === PRODUCT_BADGE.PROMO ? "Promo" : product.badge === PRODUCT_BADGE.NEW ? "Nouveau" : product.badge === PRODUCT_BADGE.COUP_DE_COEUR ? "Coup de coeur" : "Stock limité"}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {product.brand}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {product.badge && (
                <Badge className="absolute top-3 left-3 bg-red-500 text-white hover:bg-red-500 z-10">
                  {product.badge === PRODUCT_BADGE.PROMO && product.originalPrice
                    ? `-${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%`
                    : product.badge === PRODUCT_BADGE.NEW ? "Nouveau" : product.badge === PRODUCT_BADGE.COUP_DE_COEUR ? "Coup de coeur" : "Stock limité"}
                </Badge>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative h-16 w-16 rounded-lg overflow-hidden border-2 transition-colors shrink-0 ${
                      i === selectedImage ? "border-accent" : "border-transparent"
                    }`}
                    aria-label={`Voir l'image ${i + 1} de ${product.name}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-4">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount} avis)
              </span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed text-sm">
              {product.shortDescription}
            </p>

            <ProductPurchaseBlock
              product={product}
              selectedColorIndex={selectedColor}
              selectedSizeIndex={selectedSize}
              quantity={quantity}
              wishlisted={wishlisted}
              isAddingToCart={isAddingToCart}
              onColorSelect={setSelectedColor}
              onSizeSelect={setSelectedSize}
              onQuantityChange={(delta) => setQuantity((q) => Math.max(1, Math.min(product.stock, q + delta)))}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              showShippingHint={false}
              compact
            />

            {/* Features */}
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>{LAYOUT_CONSTANTS.FREE_SHIPPING_THRESHOLD_LABEL}</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                <span>Retours gratuits sous 30 jours</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Paiement sécurisé</span>
              </div>
            </div>

            <Button
              onClick={handleViewDetails}
              variant="outline"
              className="w-full gap-2"
            >
              Voir les détails
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

