"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react"
import { formatPrice, getBadgeColor, getStatusLabel } from "@/lib/formatters"
import { LAYOUT_CONSTANTS } from "@/lib/constants"
import type { Product } from "@/lib/types"

export interface ProductPurchaseBlockProps {
  product: Product
  selectedColorIndex: number
  selectedSizeIndex: number
  quantity: number
  wishlisted: boolean
  isAddingToCart?: boolean
  onColorSelect: (index: number) => void
  onSizeSelect: (index: number) => void
  onQuantityChange: (delta: number) => void
  onAddToCart: () => void
  onToggleWishlist: () => void
  showShippingHint?: boolean
  compact?: boolean
}

/**
 * Bloc partagé : options (couleur, taille, quantité) + prix + actions panier / favoris.
 * Utilisé par ProductPage et ProductQuickView pour éviter la duplication.
 */
export function ProductPurchaseBlock({
  product,
  selectedColorIndex,
  selectedSizeIndex,
  quantity,
  wishlisted,
  isAddingToCart = false,
  onColorSelect,
  onSizeSelect,
  onQuantityChange,
  onAddToCart,
  onToggleWishlist,
  showShippingHint = true,
  compact = false,
}: ProductPurchaseBlockProps) {
  return (
    <>
      {product.badge && (
        <Badge className={`${getBadgeColor(product.badge)} text-xs mb-2`}>
          {getStatusLabel(product.badge)}
        </Badge>
      )}

      <div className={compact ? "mb-3" : "mb-6"}>
        <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
        {product.originalPrice && (
          <>
            <span className="text-xl text-muted-foreground line-through ml-2">{formatPrice(product.originalPrice)}</span>
            <Badge variant="destructive" className="ml-2">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </Badge>
          </>
        )}
      </div>

      <div className={compact ? "mb-3" : "mb-6"}>
        <p className="text-sm font-medium mb-2">
          Couleur : <span className="text-muted-foreground">{product.colors[selectedColorIndex]?.name}</span>
        </p>
        <div className="flex gap-2 flex-wrap" role="group" aria-label="Choisir la couleur">
          {product.colors.map((color, i) => (
            <button
              key={color.hex}
              onClick={() => onColorSelect(i)}
              className={`h-10 w-10 rounded-full border-2 transition-all ${i === selectedColorIndex ? "border-accent ring-2 ring-accent/20" : "border-border"}`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`Sélectionner couleur ${color.name}`}
              aria-pressed={i === selectedColorIndex}
            />
          ))}
        </div>
      </div>

      {product.sizes.length > 1 && (
        <div className={compact ? "mb-3" : "mb-6"} role="group" aria-label="Choisir la taille">
          <p className="text-sm font-medium mb-2">Taille</p>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((size, i) => (
              <button
                key={size}
                onClick={() => onSizeSelect(i)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${i === selectedSizeIndex ? "border-accent bg-accent/10 text-foreground" : "border-border text-muted-foreground hover:border-foreground"}`}
                aria-label={`Sélectionner taille ${size}`}
                aria-pressed={i === selectedSizeIndex}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={`flex flex-col sm:flex-row gap-3 ${compact ? "mt-4" : "mt-6"}`}>
        <div className="flex items-center border border-border rounded-lg w-fit">
          <button
            type="button"
            onClick={() => onQuantityChange(-1)}
            disabled={quantity <= 1}
            className="h-10 w-10 flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Diminuer la quantité"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <button
            type="button"
            onClick={() => onQuantityChange(1)}
            disabled={quantity >= product.stock}
            className="h-10 w-10 flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Augmenter la quantité"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex gap-2 flex-1 sm:flex-initial">
          <Button
            className="flex-1 gap-2"
            onClick={onAddToCart}
            disabled={product.stock < quantity || isAddingToCart}
            aria-label={`Ajouter au panier : ${product.name}`}
          >
            <ShoppingBag className="h-4 w-4" />
            Ajouter au panier
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleWishlist}
            aria-label={wishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
            className={wishlisted ? "text-destructive" : ""}
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>

      {showShippingHint && (
        <p className="text-xs text-muted-foreground mt-3">{LAYOUT_CONSTANTS.FREE_SHIPPING_LABEL_LONG}</p>
      )}
    </>
  )
}
