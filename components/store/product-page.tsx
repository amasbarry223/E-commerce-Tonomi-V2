"use client"

/**
 * @component ProductPage
 * @description Affiche la fiche détaillée d'un produit avec galerie, options, avis et produits similaires.
 * @accessibility WCAG 2.1 AA (breadcrumb sémantique, états vides avec Empty, labels)
 * @responsive mobile | tablet | desktop
 * @dependencies useStore, lib/data, Empty, Breadcrumb, ImageZoom, Tabs
 */

import { useState } from "react"
import Image from "next/image"
import { useCartStore, useNavigationStore, useUIStore } from "@/lib/store-context"
import { PAGES } from "@/lib/routes"
import { getProducts, getCategories } from "@/lib/services"
import { formatPrice, formatDate } from "@/lib/formatters"
import { useReviewsStore } from "@/lib/stores/reviews-store"
import { reviewSchema, getZodErrorMessage } from "@/lib/utils/validation"
import { toast } from "sonner"
import { LAYOUT_CONSTANTS } from "@/lib/constants"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, Star, Truck, RotateCcw, ShieldCheck, MessageSquare } from "lucide-react"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ImageZoom } from "./image-zoom"
import { CartAnimation, useCartAnimation } from "./cart-animation"
import { useCartToast } from "@/hooks/use-cart-toast"
import { useCartButtonRef } from "@/hooks/use-cart-button-ref"
import { REVIEW_STATUS, PRODUCT_BADGE } from "@/lib/status-types"
import { ProductPurchaseBlock } from "./product-purchase-block"

export function ProductPage() {
  const products = getProducts()
  const categories = getCategories()
  const { selectedProductId, navigate, selectCategory } = useNavigationStore()
  const { addToCart } = useCartStore()
  const { toggleWishlist, isInWishlist } = useUIStore()
  const product = products.find(p => p.id === selectedProductId)
  const { showAddToCartToast } = useCartToast()
  const { animation, triggerAnimation, clearAnimation } = useCartAnimation()

  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [reviewName, setReviewName] = useState("")
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewComment, setReviewComment] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  const reviews = useReviewsStore((s) => s.reviews)
  const addReview = useReviewsStore((s) => s.addReview)

  const cartButtonRef = useCartButtonRef()

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20">
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShoppingBag className="h-6 w-6" aria-hidden />
            </EmptyMedia>
            <EmptyTitle>Produit introuvable</EmptyTitle>
            <EmptyDescription>
              Ce produit n’existe pas ou a été déplacé. Vous pouvez continuer vos achats dans le catalogue.
            </EmptyDescription>
          </EmptyHeader>
          <Button onClick={() => navigate(PAGES.store.catalog)} size="lg">Retour au catalogue</Button>
        </Empty>
      </div>
    )
  }

  const productReviews = reviews.filter((r) => r.productId === product.id && r.status === REVIEW_STATUS.APPROVED)

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    const result = reviewSchema.safeParse({
      customerName: reviewName.trim(),
      rating: reviewRating,
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
    })
    if (!result.success) {
      const errs: Record<string, string> = {}
      result.error.issues.forEach((e) => {
        const p = e.path[0] as string
        if (!errs[p]) errs[p] = e.message
      })
      setFieldErrors(errs)
      toast.error("Veuillez corriger les erreurs du formulaire.")
      return
    }
    setFieldErrors({})
    setIsSubmittingReview(true)
    addReview({
      productId: product.id,
      customerId: "guest",
      customerName: result.data.customerName,
      rating: result.data.rating,
      title: result.data.title,
      comment: result.data.comment,
    })
    toast.success("Votre avis a bien été envoyé. Il sera visible après modération.")
    setReviewName("")
    setReviewRating(5)
    setReviewTitle("")
    setReviewComment("")
    setIsSubmittingReview(false)
  }
  const similar = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
  const wishlisted = isInWishlist(product.id)
  const category = categories.find(c => c.id === product.category)

  const handleAddToCart = () => {
    // Add to cart immediately for better responsiveness
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

    // Use cached cart button ref and find image element with null checks
    const cartButton = cartButtonRef.current
    const imageElement = document.querySelector(`[data-product-image="${product.id}"]`) as HTMLElement | null

    // Déclencher l'animation only if both elements exist
    if (imageElement && cartButton) {
      triggerAnimation(
        product.images[selectedImage],
        product.name,
        imageElement,
        cartButton
      )
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button type="button" onClick={() => navigate(PAGES.store.home)}>
                Accueil
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button type="button" onClick={() => navigate(PAGES.store.catalog)}>
                Catalogue
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {category && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <button
                    type="button"
                    onClick={() => {
                      selectCategory(category.id)
                      navigate(PAGES.store.catalog)
                    }}
                  >
                    {category.name}
                  </button>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate max-w-[200px] inline-block">
              {product.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
                {product.badge === PRODUCT_BADGE.PROMO && product.originalPrice
                  ? `-${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%`
                  : product.badge === PRODUCT_BADGE.NEW ? "Nouveau" : product.badge === PRODUCT_BADGE.COUP_DE_COEUR ? "Coup de coeur" : "Stock limité"}
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
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg"
                  }}
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

          <ProductPurchaseBlock
            product={product}
            selectedColorIndex={selectedColor}
            selectedSizeIndex={selectedSize}
            quantity={quantity}
            wishlisted={wishlisted}
            onColorSelect={setSelectedColor}
            onSizeSelect={setSelectedSize}
            onQuantityChange={(delta) => setQuantity((q) => Math.max(1, Math.min(product.stock, q + delta)))}
            onAddToCart={handleAddToCart}
            onToggleWishlist={() => toggleWishlist(product.id)}
            showShippingHint={true}
          />

          {/* Trust */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/50 rounded-lg">
            <div className="flex flex-col items-center text-center gap-1">
              <Truck className="h-5 w-5 text-accent" />
              <span className="text-xs">{LAYOUT_CONSTANTS.FREE_SHIPPING_LABEL_LONG}</span>
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
          <div className="flex flex-col gap-8 max-w-3xl">
            {productReviews.length === 0 ? (
              <Empty className="py-8 border-0">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <MessageSquare className="size-6" aria-hidden />
                  </EmptyMedia>
                  <EmptyTitle>Aucun avis pour le moment</EmptyTitle>
                  <EmptyDescription>Soyez le premier à laisser un avis sur ce produit.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="flex flex-col gap-6">
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

            <section className="border-t border-border pt-8" aria-labelledby="review-form-title">
              <h3 id="review-form-title" className="font-semibold text-lg mb-4">Laisser un avis</h3>
              <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="review-name">Votre nom <span className="text-destructive" aria-hidden="true">*</span></Label>
                  <Input
                    id="review-name"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="Ex. Marie D."
                    className="mt-1"
                    maxLength={80}
                    aria-invalid={!!fieldErrors.customerName}
                    aria-describedby={fieldErrors.customerName ? "review-name-error" : undefined}
                  />
                  {fieldErrors.customerName && (
                    <p id="review-name-error" className="text-xs text-destructive mt-1">{fieldErrors.customerName}</p>
                  )}
                </div>
                <div>
                  <Label>Note <span className="text-destructive" aria-hidden="true">*</span></Label>
                  <div className="flex items-center gap-1 mt-1" role="group" aria-label="Note de 1 à 5 étoiles">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setReviewRating(n)}
                        className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-ring"
                        aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
                        aria-pressed={reviewRating === n}
                      >
                        <Star className={`h-8 w-8 ${reviewRating >= n ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="review-title">Titre de l&apos;avis <span className="text-destructive" aria-hidden="true">*</span></Label>
                  <Input
                    id="review-title"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Ex. Magnifique !"
                    className="mt-1"
                    maxLength={120}
                    aria-invalid={!!fieldErrors.title}
                    aria-describedby={fieldErrors.title ? "review-title-error" : undefined}
                  />
                  {fieldErrors.title && (
                    <p id="review-title-error" className="text-xs text-destructive mt-1">{fieldErrors.title}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="review-comment">Commentaire <span className="text-destructive" aria-hidden="true">*</span></Label>
                  <Textarea
                    id="review-comment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Décrivez votre expérience avec ce produit..."
                    className="mt-1 min-h-[120px]"
                    maxLength={2000}
                    rows={4}
                    aria-invalid={!!fieldErrors.comment}
                    aria-describedby={fieldErrors.comment ? "review-comment-error" : undefined}
                  />
                  {fieldErrors.comment && (
                    <p id="review-comment-error" className="text-xs text-destructive mt-1">{fieldErrors.comment}</p>
                  )}
                </div>
                <Button type="submit" disabled={isSubmittingReview}>
                  {isSubmittingReview ? "Envoi..." : "Publier mon avis"}
                </Button>
              </form>
            </section>
          </div>
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
