"use client"

import { useCallback } from "react"
import { toast } from "sonner"
import { ShoppingBag, Trash2, CheckCircle2 } from "lucide-react"
import { useStore } from "@/lib/store-context"

/**
 * Hook personnalisé pour gérer les notifications toast liées au panier
 * Fournit des feedbacks visuels cohérents pour toutes les actions du panier
 * 
 * @returns Un objet contenant toutes les fonctions de notification toast pour le panier
 * 
 * @example
 * ```tsx
 * function ProductCard({ product }) {
 *   const { showAddToCartToast } = useCartToast()
 *   
 *   const handleAddToCart = () => {
 *     addToCart(product)
 *     showAddToCartToast(product.name)
 *   }
 * }
 * ```
 */
export function useCartToast() {
  const { navigate } = useStore()

  const showAddToCartToast = useCallback((productName: string) => {
    toast.success("Ajouté au panier", {
      description: productName,
      icon: <ShoppingBag className="h-4 w-4" />,
      duration: 3000,
      action: {
        label: "Voir le panier",
        onClick: () => navigate("cart"),
      },
    })
  }, [navigate])

  const showRemoveFromCartToast = useCallback((productName: string) => {
    toast.info("Retiré du panier", {
      description: productName,
      icon: <Trash2 className="h-4 w-4" />,
      duration: 2000,
    })
  }, [])

  const showUpdateCartToast = useCallback((productName: string, quantity: number) => {
    toast.success("Quantité mise à jour", {
      description: `${productName} : ${quantity} article${quantity > 1 ? "s" : ""}`,
      icon: <CheckCircle2 className="h-4 w-4" />,
      duration: 2000,
    })
  }, [])

  const showClearCartToast = useCallback(() => {
    toast.info("Panier vidé", {
      description: "Tous les articles ont été retirés",
      duration: 2000,
    })
  }, [])

  const showPromoAppliedToast = useCallback((code: string, discount: number) => {
    toast.success("Code promo appliqué", {
      description: `${code} : -${discount}€`,
      duration: 3000,
    })
  }, [])

  const showPromoErrorToast = useCallback((message: string) => {
    toast.error("Code promo invalide", {
      description: message,
      duration: 3000,
    })
  }, [])

  return {
    showAddToCartToast,
    showRemoveFromCartToast,
    showUpdateCartToast,
    showClearCartToast,
    showPromoAppliedToast,
    showPromoErrorToast,
  }
}
