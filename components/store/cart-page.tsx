"use client"

import { useState } from "react"
import { useStore } from "@/lib/store-context"
import { formatPrice } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react"

export function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, navigate, applyPromoCode, promoDiscount, appliedPromo } = useStore()
  const [promoCode, setPromoCode] = useState("")
  const [promoMessage, setPromoMessage] = useState("")
  const [promoSuccess, setPromoSuccess] = useState(false)

  const shipping = cartTotal >= 100 ? 0 : 5.99
  const total = cartTotal - promoDiscount + shipping

  const handlePromo = () => {
    const result = applyPromoCode(promoCode)
    setPromoMessage(result.message)
    setPromoSuccess(result.success)
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold mb-2">Votre panier est vide</h1>
        <p className="text-muted-foreground mb-6">Découvrez nos collections et trouvez votre bonheur</p>
        <Button onClick={() => navigate("catalog")} className="gap-2">
          Continuer mes achats <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-serif text-2xl md:text-3xl font-bold mb-8">Mon Panier ({cart.length} article{cart.length > 1 ? "s" : ""})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart.map((item) => (
            <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-4 p-4 bg-card border border-border rounded-lg">
              <img src={item.image} alt={item.name} className="h-24 w-24 rounded-lg object-cover shrink-0" crossOrigin="anonymous" />
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
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1, item.color, item.size)}
                      className="h-8 w-8 flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1, item.color, item.size)}
                      className="h-8 w-8 flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                    <button
                      onClick={() => removeFromCart(item.productId, item.color, item.size)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
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
              <label className="text-sm text-muted-foreground mb-2 block">Code promo</label>
              <div className="flex gap-2">
                <Input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="BIENVENUE10"
                  className="text-sm"
                />
                <Button variant="outline" size="sm" onClick={handlePromo} className="shrink-0">
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              {promoMessage && (
                <p className={`text-xs mt-1 ${promoSuccess ? "text-emerald-600" : "text-destructive"}`}>{promoMessage}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Réduction ({appliedPromo})</span>
                  <span>-{formatPrice(promoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Livraison</span>
                <span>{shipping === 0 ? "Gratuite" : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">Livraison gratuite dès 100&euro;</p>
              )}
              <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button onClick={() => navigate("checkout")} className="w-full mt-6 gap-2" size="lg">
              Commander <ArrowRight className="h-4 w-4" />
            </Button>
            <Button onClick={() => navigate("catalog")} variant="ghost" className="w-full mt-2 text-sm">
              Continuer mes achats
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
