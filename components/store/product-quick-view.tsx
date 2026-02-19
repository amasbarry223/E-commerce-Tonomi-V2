"use client"

import { useState } from "react"
import Image from "next/image"
import { useStore } from "@/lib/store-context"
import { type Product, formatPrice, getBadgeColor, getStatusLabel } from "@/lib/data"
import { Heart, ShoppingBag, Star, Minus, Plus, Truck, RotateCcw, ShieldCheck } from "lucide-react"
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

interface ProductQuickViewProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductQuickView({ product, open, onOpenChange }: ProductQuickViewProps) {
  const { addToCart, toggleWishlist, isInWishlist, navigate, selectProduct } = useStore()
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
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
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
    navigate("product")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl">{product.name}</span>
            {product.badge && (
              <Badge className={`${getBadgeColor(product.badge)} text-xs`}>
                {getStatusLabel(product.badge)}
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
                  {product.badge === "promo" && product.originalPrice
                    ? `-${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%`
                    : product.badge === "new" ? "Nouveau" : product.badge === "coup-de-coeur" ? "Coup de coeur" : "Stock limité"}
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

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <Badge variant="destructive">
                    -{Math.round(
                      ((product.originalPrice - product.price) / product.originalPrice) * 100
                    )}%
                  </Badge>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed text-sm">
              {product.shortDescription}
            </p>

            {/* Color Selection */}
            <div>
              <p className="text-sm font-medium mb-2">
                Couleur : <span className="text-muted-foreground">
                  {product.colors[selectedColor]?.name}
                </span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color, i) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(i)}
                    className={`h-10 w-10 rounded-full border-2 transition-all ${
                      i === selectedColor
                        ? "border-accent ring-2 ring-accent/20"
                        : "border-border"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={`Sélectionner la couleur ${color.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 1 && (
              <div>
                <p className="text-sm font-medium mb-2">Taille</p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size, i) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(i)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        i === selectedSize
                          ? "border-accent bg-accent/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-foreground"
                      }`}
                      aria-label={`Sélectionner la taille ${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-medium mb-2">Quantité</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                  aria-label="Diminuer la quantité"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                  aria-label="Augmenter la quantité"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Livraison gratuite dès 100€</span>
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

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-4">
              <Button
                onClick={handleAddToCart}
                className="w-full gap-2"
                size="lg"
                loading={isAddingToCart}
                disabled={isAddingToCart}
              >
                <ShoppingBag className="h-4 w-4" />
                Ajouter au panier
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={handleToggleWishlist}
                  variant="outline"
                  className="flex-1 gap-2"
                  aria-label={wishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  <Heart
                    className={`h-4 w-4 ${wishlisted ? "fill-red-500 text-red-500" : ""}`}
                  />
                  {wishlisted ? "Retiré" : "Favoris"}
                </Button>
                <Button
                  onClick={handleViewDetails}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  Voir les détails
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

