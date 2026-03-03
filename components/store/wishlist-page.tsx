"use client"

import { useNavigationStore, useUIStore } from "@/lib/store-context"
import { PAGES } from "@/lib/routes"
import { useProducts } from "@/hooks"
import { pluralize } from "@/lib/formatters"
import { SECTION_CONTAINER } from "@/lib/layout"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { PageEmptyState } from "@/components/ui/page-empty-state"

export function WishlistPage() {
  const { navigate } = useNavigationStore()
  const { wishlist } = useUIStore()
  const { products, isLoading } = useProducts()
  const wishlistProducts = products.filter((p) => wishlist.some((w) => w.productId === p.id))
  
  if (isLoading) {
    return <div className={`${SECTION_CONTAINER} py-8`}>Chargement...</div>
  }

  return (
    <div className={`${SECTION_CONTAINER} py-8`}>
      <h1 className="font-serif text-2xl md:text-3xl font-bold mb-6">Mes favoris</h1>
      {wishlistProducts.length === 0 ? (
        <PageEmptyState
          icon={Heart}
          title="Votre liste de favoris est vide"
          description="Ajoutez des articles depuis le catalogue pour les retrouver ici."
        >
          <Button onClick={() => navigate(PAGES.store.catalog)} variant="outline" size="lg">
            Découvrir le catalogue
          </Button>
        </PageEmptyState>
      ) : (
        <>
          <p className="text-muted-foreground mb-6">{wishlistProducts.length} {pluralize(wishlistProducts.length, "article")} en {pluralize(wishlistProducts.length, "favori", "favoris")}</p>
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
