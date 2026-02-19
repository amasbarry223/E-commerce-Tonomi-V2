"use client"

import { useState } from "react"
import Image from "next/image"
import { useStore } from "@/lib/store-context"
import { products, reviews, formatPrice, formatDate, categories } from "@/lib/data"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ShoppingBag, Star, Minus, Plus, Truck, RotateCcw, ShieldCheck } from "lucide-react"
import { ImageZoom } from "./image-zoom"
import { CartAnimation, useCartAnimation } from "./cart-animation"
import { useCartToast } from "@/hooks/use-cart-toast"

export function ProductPage() {
  const { selectedProductId, addToCart, toggleWishlist, isInWishlist, navigate } = useStore()
  const product = products.find(p => p.id === selectedProductId)
  const { showAddToCartToast } = useCartToast()
  const { animation, triggerAnimation, clearAnimation } = useCartAnimation()

  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Produit non trouvé</p>
        <Button onClick={() => navigate("catalog")} className="mt-4">Retour au catalogue</Button>
      </div>
    )
  }

  const productReviews = reviews.filter(r => r.productId === product.id && r.status === "approved")
  const similar = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
  const wishlisted = isInWishlist(product.id)
  const category = categories.find(c => c.id === product.category)

  const handleAddToCart = () => {
    // Trouver l'élément du panier dans le header
    const cartButton = document.querySelector('[aria-label*="panier"]') as HTMLElement
    const imageElement = document.querySelector(`[data-product-image="${product.id}"]`) as HTMLElement
    
    // Déclencher l'animation
    if (imageElement && cartButton) {
      triggerAnimation(
        product.images[selectedImage],
        product.name,
        imageElement,
        cartButton
      )
    }
    
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
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <button onClick={() => navigate("home")} className="hover:text-foreground">Accueil</button>
        <span>/</span>
        <button onClick={() => navigate("catalog")} className="hover:text-foreground">Catalogue</button>
        <span>/</span>
        {category && (
          <>
            <button onClick={() => navigate("catalog")} className="hover:text-foreground">{category.name}</button>
            <span>/</span>
          </>
        )}
        <span className="text-foreground truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div>
          <div className="relative mb-4">
            <ImageZoom
              src={product.images[selectedImage]}
              alt={product.name}
              zoomLevel={2.5}
              enableHoverZoom={true}
              enableClickZoom={true}
            />
            {product.badge && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-white hover:bg-red-500 z-30 pointer-events-none">
                {product.badge === "promo" && product.originalPrice
                  ? `-${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%`
                  : product.badge === "new" ? "Nouveau" : product.badge === "coup-de-coeur" ? "Coup de coeur" : "Stock limité"}
              </Badge>
            )}
          </div>
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative h-20 w-20 rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImage ? "border-accent" : "border-transparent"}`}
                aria-label={`Voir l'image ${i + 1} de ${product.name}`}
              >
                <Image 
                  src={img} 
                  alt={`${product.name} ${i + 1}`} 
                  fill
                  className="object-cover"
                  sizes="80px"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
          <h1 className="font-serif text-2xl md:text-3xl font-bold mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.reviewCount} avis)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                <Badge variant="destructive">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </Badge>
              </>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">{product.shortDescription}</p>

          {/* Color Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Couleur : <span className="text-muted-foreground">{product.colors[selectedColor]?.name}</span></p>
            <div className="flex gap-2">
              {product.colors.map((color, i) => (
                <button
                  key={color.hex}
                  onClick={() => setSelectedColor(i)}
                  className={`h-10 w-10 rounded-full border-2 transition-all ${i === selectedColor ? "border-accent ring-2 ring-accent/20" : "border-border"}`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          {product.sizes.length > 1 && (
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Taille</p>
              <div className="flex gap-2">
                {product.sizes.map((size, i) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(i)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${i === selectedSize ? "border-accent bg-accent/10 text-foreground" : "border-border text-muted-foreground hover:border-foreground"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Quantité</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-10 w-10 flex items-center justify-center hover:bg-secondary transition-colors">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="h-10 w-10 flex items-center justify-center hover:bg-secondary transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">{product.stock} en stock</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <Button onClick={handleAddToCart} size="lg" className="flex-1 gap-2">
              <ShoppingBag className="h-5 w-5" />
              Ajouter au panier
            </Button>
            <Button
              onClick={() => toggleWishlist(product.id)}
              size="lg"
              variant="outline"
              className={wishlisted ? "text-red-500 border-red-500 hover:bg-red-50" : ""}
            >
              <Heart className={`h-5 w-5 ${wishlisted ? "fill-current" : ""}`} />
            </Button>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/50 rounded-lg">
            <div className="flex flex-col items-center text-center gap-1">
              <Truck className="h-5 w-5 text-accent" />
              <span className="text-xs">Livraison gratuite</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <RotateCcw className="h-5 w-5 text-accent" />
              <span className="text-xs">Retours 30j</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <span className="text-xs">Paiement sécurisé</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description + Reviews */}
      <Tabs defaultValue="description" className="mt-12">
        <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none p-0">
          <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3">
            Description
          </TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3">
            Avis ({productReviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="pt-6">
          <div className="max-w-3xl">
            <p className="text-muted-foreground leading-relaxed mb-4">{product.description}</p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Matière</span>
                <span className="text-sm font-medium">{product.material}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Marque</span>
                <span className="text-sm font-medium">{product.brand}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Référence</span>
                <span className="text-sm font-medium">{product.sku}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Catégorie</span>
                <span className="text-sm font-medium">{category?.name}</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="pt-6">
          {productReviews.length === 0 ? (
            <p className="text-muted-foreground">Aucun avis pour le moment.</p>
          ) : (
            <div className="flex flex-col gap-6 max-w-3xl">
              {productReviews.map(review => (
                <div key={review.id} className="border-b border-border pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                      ))}
                    </div>
                    <span className="font-medium text-sm">{review.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                  <p className="text-xs text-muted-foreground">{review.customerName} - {formatDate(review.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Similar Products */}
      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-bold mb-6">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {similar.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}


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
    </div>
  )
}
