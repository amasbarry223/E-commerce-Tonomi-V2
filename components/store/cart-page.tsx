"use client"

import { useState } from "react"
import Image from "next/image"
import { useCartStore, useNavigationStore } from "@/lib/store-context"
import { PAGES } from "@/lib/routes"
import { formatPrice, pluralize } from "@/lib/formatters"
import { OrderSummary } from "./order-summary"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react"
import { useCartToast } from "@/hooks/use-cart-toast"
import { useErrorHandler } from "@/hooks/use-error-handler"
import { LAYOUT_CONSTANTS, ANIMATION_DELAYS } from "@/lib/constants"

export function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, applyPromoCode, promoDiscount, appliedPromo } = useCartStore()
  const { navigate } = useNavigationStore()
  const { showRemoveFromCartToast, showUpdateCartToast, showPromoAppliedToast, showPromoErrorToast } = useCartToast()
  const { safeAsync } = useErrorHandler({ context: "CartPage" })
  const [promoCode, setPromoCode] = useState("")
  const [promoMessage, setPromoMessage] = useState("")
  const [promoSuccess, setPromoSuccess] = useState(false)
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  const shipping = cartTotal >= LAYOUT_CONSTANTS.FREE_SHIPPING_THRESHOLD ? 0 : LAYOUT_CONSTANTS.STANDARD_SHIPPING_COST
  const total = cartTotal - promoDiscount + shipping

  const handlePromo = async () => {
    if (!promoCode.trim()) return
    
    setIsApplyingPromo(true)
    await safeAsync(
      async () => {
        const promoResult = applyPromoCode(promoCode)
        setPromoMessage(promoResult.message)
        setPromoSuccess(promoResult.success)
        
        if (promoResult.success) {
          showPromoAppliedToast(promoCode, promoResult.discount)
          setPromoCode("")
        } else {
          showPromoErrorToast(promoResult.message)
        }
        return promoResult
      },
      { context: "CartPage.handlePromo", showToast: false }
    )
    setIsApplyingPromo(false)
  }

  const handleRemoveFromCart = (item: typeof cart[0]) => {
    removeFromCart(item.productId, item.color, item.size)
    showRemoveFromCartToast(item.name)
  }

  const handleUpdateQuantity = async (item: typeof cart[0], newQuantity: number) => {
    const itemKey = `${item.productId}-${item.color}-${item.size}`
    setUpdatingItems(prev => new Set(prev).add(itemKey))
    
    try {
      await new Promise(resolve => setTimeout(resolve, ANIMATION_DELAYS.QUANTITY_UPDATE_DELAY))
      updateCartQuantity(item.productId, newQuantity, item.color, item.size)
      showUpdateCartToast(item.name, newQuantity)
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev)
        next.delete(itemKey)
        return next
      })
    }
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold mb-2">Votre panier est vide</h1>
        <p className="text-muted-foreground mb-6">Découvrez nos collections et trouvez votre bonheur</p>
        <Button onClick={() => navigate(PAGES.store.catalog)} className="gap-2">
          Continuer mes achats <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-serif text-2xl md:text-3xl font-bold mb-8">Mon Panier ({cart.length} {pluralize(cart.length, "article")})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart.map((item) => (
            <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-4 p-4 bg-card border border-border rounded-lg">
              <div className="relative h-24 w-24 rounded-lg overflow-hidden shrink-0">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{item.name}</h3>
                <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                  {item.color && <span>Couleur: {item.color}</span>}
                  {item.size && <span>Taille: {item.size}</span>}
                </div>
                <p className="font-bold mt-2">{formatPrice(item.price)}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-md">
                    <button
                      onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updatingItems.has(`${item.productId}-${item.color}-${item.size}`)}
                      className="h-8 w-8 flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Diminuer la quantité"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                      disabled={updatingItems.has(`${item.productId}-${item.color}-${item.size}`)}
                      className="h-8 w-8 flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Augmenter la quantité"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                    <button
                      onClick={() => handleRemoveFromCart(item)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label={`Retirer ${item.name} du panier`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Récapitulatif</h2>

            {/* Promo Code */}
            <div className="mb-6">
              <Label htmlFor="cart-promo-code" className="text-sm text-muted-foreground mb-2 block">
                Code promo
              </Label>
              <div className="flex gap-2">
                <Input
                  id="cart-promo-code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="BIENVENUE10"
                  className="text-sm"
                  aria-describedby={promoMessage ? "cart-promo-message" : undefined}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePromo} 
                  className="shrink-0"
                  loading={isApplyingPromo}
                  disabled={isApplyingPromo || !promoCode.trim()}
                  aria-label={promoCode.trim() ? "Appliquer le code promo" : "Saisir un code promo"}
                  title={!promoCode.trim() ? "Saisir un code promo" : undefined}
                >
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              {promoMessage && (
                <p id="cart-promo-message" className={`text-xs mt-1 ${promoSuccess ? "text-emerald-600" : "text-destructive"}`} role="status">
                  {promoMessage}
                </p>
              )}
            </div>

            <OrderSummary
              cartTotal={cartTotal}
              promoDiscount={promoDiscount}
              appliedPromo={appliedPromo}
              shippingCost={shipping}
              total={total}
              title="Récapitulatif"
              showFreeShippingHint={shipping > 0}
            />

            <Button 
              onClick={() => navigate(PAGES.store.checkout)} 
              className="w-full mt-6 gap-2" 
              size="lg"
              aria-label="Passer la commande"
            >
              Commander <ArrowRight className="h-4 w-4" />
            </Button>
            <Button onClick={() => navigate(PAGES.store.catalog)} variant="ghost" className="w-full mt-2 text-sm">
              Continuer mes achats
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
