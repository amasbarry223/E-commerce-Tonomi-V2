"use client"

import { useStore } from "@/lib/store-context"
import { PAGES } from "@/lib/routes"
import { products } from "@/lib/data"
import { SECTION_CONTAINER } from "@/lib/layout"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"

export function WishlistPage() {
  const { wishlist, navigate } = useStore()
  const wishlistProducts = products.filter((p) => wishlist.some((w) => w.productId === p.id))

  return (
    <div className={`${SECTION_CONTAINER} py-8`}>
      <h1 className="font-serif text-2xl md:text-3xl font-bold mb-6">Mes favoris</h1>
      {wishlistProducts.length === 0 ? (
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Heart className="size-8" />
            </EmptyMedia>
            <EmptyTitle>Votre liste de favoris est vide</EmptyTitle>
            <EmptyDescription>Ajoutez des articles depuis le catalogue pour les retrouver ici.</EmptyDescription>
          </EmptyHeader>
          <Button onClick={() => navigate(PAGES.store.catalog)} variant="outline" size="lg">
            Découvrir le catalogue
          </Button>
        </Empty>
      ) : (
        <>
          <p className="text-muted-foreground mb-6">{wishlistProducts.length} article{wishlistProducts.length > 1 ? "s" : ""} en favori{wishlistProducts.length > 1 ? "s" : ""}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
