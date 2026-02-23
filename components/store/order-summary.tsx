"use client"

import { formatPrice } from "@/lib/formatters"
import { LAYOUT_CONSTANTS, ORDER_LABELS } from "@/lib/constants"

export interface OrderSummaryProps {
  /** Sous-total du panier (avant réduction et livraison) */
  cartTotal: number
  /** Montant de la réduction promo */
  promoDiscount: number
  /** Code promo appliqué (affiché à côté de "Réduction" si présent) */
  appliedPromo?: string | null
  /** Coût de livraison (0 = livraison gratuite) */
  shippingCost: number
  /** Total final */
  total: number
  /** Titre du bloc (optionnel) */
  title?: string
  /** Classe du conteneur (optionnel) */
  className?: string
  /** Afficher le rappel livraison gratuite sous la ligne livraison (optionnel) */
  showFreeShippingHint?: boolean
}

/**
 * Bloc récapitulatif panier/commande partagé (sous-total, réduction, livraison, total).
 * Utilisé par CartPage et CheckoutPage.
 */
export function OrderSummary({
  cartTotal,
  promoDiscount,
  appliedPromo = null,
  shippingCost,
  total,
  title,
  className = "",
  showFreeShippingHint = false,
}: OrderSummaryProps) {
  return (
    <div className={className}>
      {title && <h3 className="font-semibold mb-4">{title}</h3>}
      <div className="border-t border-border pt-3 flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Sous-total</span>
          <span>{formatPrice(cartTotal)}</span>
        </div>
        {promoDiscount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>{appliedPromo ? `${ORDER_LABELS.DISCOUNT} (${appliedPromo})` : ORDER_LABELS.DISCOUNT}</span>
            <span>-{formatPrice(promoDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Livraison</span>
          <span>{shippingCost === 0 ? LAYOUT_CONSTANTS.FREE_SHIPPING_LABEL : formatPrice(shippingCost)}</span>
        </div>
        {showFreeShippingHint && shippingCost > 0 && (
          <p className="text-xs text-muted-foreground">{LAYOUT_CONSTANTS.FREE_SHIPPING_THRESHOLD_LABEL}</p>
        )}
        <div className="border-t border-border pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}
