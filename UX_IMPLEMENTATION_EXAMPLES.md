# 💻 Exemples d'implémentation - Améliorations UX

Ce document contient des exemples de code concrets pour implémenter les améliorations UX prioritaires.

---

## 1. 🔄 États de chargement - Skeleton Loaders

### Composant Skeleton pour ProductCard

```tsx
// components/store/product-card-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border">
      <Skeleton variant="image" className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" className="h-3 w-1/4" />
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-3/4" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-3 rounded-full" />
          ))}
        </div>
        <Skeleton variant="text" className="h-5 w-1/3" />
      </div>
    </div>
  )
}
```

### Utilisation dans CatalogPage

```tsx
// components/store/catalog-page.tsx
import { ProductCardSkeleton } from "./product-card-skeleton"
import { useState, useEffect } from "react"

export function CatalogPage() {
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Simuler chargement
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className={`${SECTION_CONTAINER} py-8`}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  // ... reste du code
}
```

---

## 2. 🎯 Toast notifications pour feedback utilisateur

### Hook personnalisé avec animations

```tsx
// hooks/use-cart-toast.ts
import { toast } from "sonner"
import { ShoppingBag } from "lucide-react"

export function useCartToast() {
  const showAddToCartToast = (productName: string) => {
    toast.success("Ajouté au panier", {
      description: productName,
      icon: <ShoppingBag className="h-4 w-4" />,
      duration: 3000,
      action: {
        label: "Voir le panier",
        onClick: () => navigate("cart"),
      },
    })
  }

  const showRemoveFromCartToast = (productName: string) => {
    toast.info("Retiré du panier", {
      description: productName,
      duration: 2000,
    })
  }

  return { showAddToCartToast, showRemoveFromCartToast }
}
```

### Utilisation dans ProductCard

```tsx
// components/store/product-card.tsx
import { useCartToast } from "@/hooks/use-cart-toast"

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore()
  const { showAddToCartToast } = useCartToast()

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
    showAddToCartToast(product.name)
  }

  // ... reste du code
}
```

---

## 3. 🚨 Error Boundary pour gestion d'erreurs

### Composant ErrorBoundary

```tsx
// components/ui/error-boundary.tsx
"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
    // Ici vous pouvez envoyer l'erreur à un service de logging
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="text-2xl font-bold">Une erreur s'est produite</h2>
          <p className="text-muted-foreground text-center max-w-md">
            {this.state.error?.message || "Une erreur inattendue s'est produite"}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Recharger la page
            </Button>
            <Button onClick={() => navigate("home")}>
              Retour à l'accueil
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

### Utilisation dans layout

```tsx
// app/layout.tsx
import { ErrorBoundary } from "@/components/ui/error-boundary"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ErrorBoundary>
          <StoreProvider>
            {children}
          </StoreProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
```

---

## 4. 🔍 Recherche avec autocomplete

### Composant SearchAutocomplete

```tsx
// components/store/search-autocomplete.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { useStore } from "@/lib/store-context"
import { products } from "@/lib/data"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, TrendingUp } from "lucide-react"
import { useDebounce } from "@/src/lib/hooks/use-debounce"

export function SearchAutocomplete() {
  const { setSearchQuery, navigate } = useStore()
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const debouncedValue = useDebounce(inputValue, 300)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestions = products
    .filter(p => 
      debouncedValue &&
      (p.name.toLowerCase().includes(debouncedValue.toLowerCase()) ||
       p.brand.toLowerCase().includes(debouncedValue.toLowerCase()))
    )
    .slice(0, 5)

  const handleSelect = (productId: string) => {
    setSearchQuery("")
    navigate("product")
    setOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setSearchQuery(inputValue)
      navigate("catalog")
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setOpen(e.target.value.length > 0)
            }}
            onFocus={() => setOpen(inputValue.length > 0)}
            placeholder="Rechercher un produit..."
            className="pl-9 w-64"
          />
        </form>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandList>
            {suggestions.length === 0 ? (
              <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
            ) : (
              <CommandGroup heading="Suggestions">
                {suggestions.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.name}
                    onSelect={() => handleSelect(product.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                      </div>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

---

## 5. 🖼️ Zoom et Lightbox pour images produit

### Composant ImageZoom

```tsx
// components/store/image-zoom.tsx
"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X, ZoomIn } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ImageZoomProps {
  images: string[]
  currentIndex?: number
  onClose: () => void
}

export function ImageZoom({ images, currentIndex = 0, onClose }: ImageZoomProps) {
  const [selectedIndex, setSelectedIndex] = useState(currentIndex)

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full p-0 bg-black/95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors"
          aria-label="Fermer"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="relative h-[90vh] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedIndex}
              src={images[selectedIndex]}
              alt={`Image ${selectedIndex + 1}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="max-h-full max-w-full object-contain"
            />
          </AnimatePresence>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white transition-colors"
                aria-label="Image précédente"
              >
                ←
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white transition-colors"
                aria-label="Image suivante"
              >
                →
              </button>
            </>
          )}
        </div>

        {/* Miniatures */}
        {images.length > 1 && (
          <div className="flex gap-2 p-4 overflow-x-auto bg-black/50">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`shrink-0 h-16 w-16 rounded overflow-hidden border-2 transition-all ${
                  i === selectedIndex ? "border-white" : "border-transparent opacity-50"
                }`}
              >
                <img src={img} alt={`Miniature ${i + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
```

### Utilisation dans ProductPage

```tsx
// components/store/product-page.tsx
import { ImageZoom } from "./image-zoom"
import { useState } from "react"

export function ProductPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  return (
    <>
      {/* Image principale avec zoom */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary mb-4 group">
        <img
          src={product.images[selectedImageIndex]}
          alt={product.name}
          className="h-full w-full object-cover cursor-zoom-in"
          onClick={() => {
            setSelectedImageIndex(selectedImageIndex)
            setLightboxOpen(true)
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <ZoomIn className="h-8 w-8 text-white" />
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageZoom
          images={product.images}
          currentIndex={selectedImageIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}
```

---

## 6. 🛒 Mini panier dans le header

### Composant MiniCart

```tsx
// components/store/mini-cart.tsx
"use client"

import { useStore } from "@/lib/store-context"
import { formatPrice } from "@/lib/data"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function MiniCart() {
  const { cart, cartCount, cartTotal, removeFromCart, navigate } = useStore()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {cartCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {cartCount}
            </Badge>
          )}
          <span className="sr-only">Panier</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle>Mon Panier ({cartCount} article{cartCount > 1 ? "s" : ""})</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-80px)]">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground">Votre panier est vide</p>
              <Button onClick={() => navigate("catalog")} variant="outline">
                Continuer mes achats
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.color && `Couleur: ${item.color}`}
                        {item.size && ` • Taille: ${item.size}`}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFromCart(item.productId, item.color, item.size)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <Button onClick={() => navigate("cart")} className="w-full" size="lg">
                  Voir le panier <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button
                  onClick={() => navigate("checkout")}
                  variant="outline"
                  className="w-full"
                >
                  Commander
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

---

## 7. 📱 Bouton panier flottant mobile

### Composant FloatingCartButton

```tsx
// components/store/floating-cart-button.tsx
"use client"

import { useStore } from "@/lib/store-context"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/use-mobile"

export function FloatingCartButton() {
  const { cartCount, navigate } = useStore()
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (!isMobile || cartCount === 0) return null

  return (
    <AnimatePresence>
      <motion.button
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        onClick={() => navigate("cart")}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        aria-label="Voir le panier"
      >
        <ShoppingBag className="h-6 w-6" />
        {cartCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 text-xs">
            {cartCount}
          </Badge>
        )}
      </motion.button>
    </AnimatePresence>
  )
}
```

---

## 8. ✅ Validation de formulaire avec feedback

### Hook useCheckoutForm

```tsx
// hooks/use-checkout-form.ts
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

const checkoutSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  address: z.string().min(5, "Adresse invalide"),
  city: z.string().min(2, "Ville invalide"),
  zip: z.string().regex(/^\d{5}$/, "Code postal invalide (5 chiffres)"),
  phone: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, "Numéro de téléphone invalide"),
})

export function useCheckoutForm() {
  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      zip: "",
      phone: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof checkoutSchema>) => {
    try {
      // Simulation appel API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Commande validée !")
      return data
    } catch (error) {
      toast.error("Erreur lors de la validation de la commande")
      throw error
    }
  }

  return { form, onSubmit }
}
```

---

## 9. 🔄 Pagination pour le catalogue

### Composant Pagination

```tsx
// components/store/catalog-pagination.tsx
"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CatalogPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function CatalogPagination({
  currentPage,
  totalPages,
  onPageChange,
}: CatalogPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visiblePages = pages.filter(
    (p) =>
      p === 1 ||
      p === totalPages ||
      (p >= currentPage - 1 && p <= currentPage + 1)
  )

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {visiblePages.map((page, i) => (
        <div key={page} className="flex items-center gap-2">
          {i > 0 && visiblePages[i - 1] !== page - 1 && (
            <span className="px-2">...</span>
          )}
          <Button
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        </div>
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
```

---

## 10. 🎨 Animation d'ajout au panier

### Composant CartAnimation

```tsx
// components/ui/cart-animation.tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag } from "lucide-react"
import { useEffect, useState } from "react"

interface CartAnimationProps {
  trigger: boolean
  fromElement?: HTMLElement | null
  toElement?: HTMLElement | null
}

export function CartAnimation({ trigger, fromElement, toElement }: CartAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (trigger && fromElement && toElement) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [trigger, fromElement, toElement])

  if (!isAnimating || !fromElement || !toElement) return null

  const fromRect = fromElement.getBoundingClientRect()
  const toRect = toElement.getBoundingClientRect()

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          x: fromRect.left + fromRect.width / 2,
          y: fromRect.top + fromRect.height / 2,
          scale: 1,
        }}
        animate={{
          x: toRect.left + toRect.width / 2,
          y: toRect.top + toRect.height / 2,
          scale: 0.3,
        }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed z-50 pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <ShoppingBag className="h-8 w-8 text-primary" />
      </motion.div>
    </AnimatePresence>
  )
}
```

---

Ces exemples peuvent être adaptés et intégrés progressivement dans votre projet. Commencez par les priorités hautes pour un impact immédiat sur l'expérience utilisateur.

