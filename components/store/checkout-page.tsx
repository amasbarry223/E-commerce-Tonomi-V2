"use client"

import { useState } from "react"
import { useStore } from "@/lib/store-context"
import { formatPrice } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle2, CreditCard, Truck, ShieldCheck } from "lucide-react"

export function CheckoutPage() {
  const { cart, cartTotal, promoDiscount, clearCart, navigate } = useStore()
  const [step, setStep] = useState(1)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [shipping, setShipping] = useState("standard")
  const shippingCost = shipping === "express" ? 9.99 : cartTotal >= 100 ? 0 : 5.99
  const total = cartTotal - promoDiscount + shippingCost

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()
    setOrderPlaced(true)
    clearCart()
  }

  if (orderPlaced) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold mb-2">Commande confirmée !</h1>
        <p className="text-muted-foreground mb-2">Merci pour votre commande.</p>
        <p className="text-sm text-muted-foreground mb-6">Vous recevrez un email de confirmation avec les détails de suivi.</p>
        <p className="font-mono text-lg font-bold mb-6">CMD-2026-{String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}</p>
        <Button onClick={() => navigate("home")} className="gap-2">
          {'Retour à l\'accueil'}
        </Button>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Votre panier est vide</p>
        <Button onClick={() => navigate("catalog")}>Voir le catalogue</Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-serif text-2xl md:text-3xl font-bold mb-8">Passer commande</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-4 mb-8">
        {["Adresse", "Livraison", "Paiement"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step > i + 1 ? "bg-emerald-500 text-white" : step === i + 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}>
              {step > i + 1 ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-sm hidden md:block ${step === i + 1 ? "font-medium" : "text-muted-foreground"}`}>{label}</span>
            {i < 2 && <div className="h-px w-8 md:w-16 bg-border" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handlePlaceOrder}>
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-semibold text-lg mb-4">Adresse de livraison</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm">Prénom</Label>
                    <Input id="firstName" defaultValue="Marie" className="mt-1" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm">Nom</Label>
                    <Input id="lastName" defaultValue="Dupont" className="mt-1" required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email" className="text-sm">Email</Label>
                    <Input id="email" type="email" defaultValue="marie.dupont@email.com" className="mt-1" required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="text-sm">Adresse</Label>
                    <Input id="address" defaultValue="12 Rue de Rivoli" className="mt-1" required />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-sm">Ville</Label>
                    <Input id="city" defaultValue="Paris" className="mt-1" required />
                  </div>
                  <div>
                    <Label htmlFor="zip" className="text-sm">Code postal</Label>
                    <Input id="zip" defaultValue="75001" className="mt-1" required />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm">Téléphone</Label>
                    <Input id="phone" defaultValue="+33 6 12 34 56 78" className="mt-1" required />
                  </div>
                </div>
                <Button type="button" onClick={() => setStep(2)} className="mt-6">
                  Continuer
                </Button>
              </div>
            )}

            {/* Step 2: Shipping */}
            {step === 2 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-semibold text-lg mb-4">Mode de livraison</h2>
                <RadioGroup value={shipping} onValueChange={setShipping} className="flex flex-col gap-3">
                  <label className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${shipping === "standard" ? "border-accent bg-accent/5" : "border-border"}`}>
                    <RadioGroupItem value="standard" />
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Standard (3-5 jours)</p>
                      <p className="text-xs text-muted-foreground">{cartTotal >= 100 ? "Gratuite" : "5,99 €"}</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${shipping === "express" ? "border-accent bg-accent/5" : "border-border"}`}>
                    <RadioGroupItem value="express" />
                    <Truck className="h-5 w-5 text-accent" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Express (1-2 jours)</p>
                      <p className="text-xs text-muted-foreground">9,99 &euro;</p>
                    </div>
                  </label>
                </RadioGroup>
                <div className="flex gap-3 mt-6">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>Retour</Button>
                  <Button type="button" onClick={() => setStep(3)}>Continuer</Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-semibold text-lg mb-4">Paiement sécurisé</h2>
                <div className="flex items-center gap-2 mb-6 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-700 dark:text-emerald-400 text-sm">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  Paiement 100% sécurisé par chiffrement SSL
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <Label htmlFor="card" className="text-sm">Numéro de carte</Label>
                    <Input id="card" placeholder="4242 4242 4242 4242" className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="exp" className="text-sm">Expiration</Label>
                      <Input id="exp" placeholder="MM/AA" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="cvc" className="text-sm">CVC</Label>
                      <Input id="cvc" placeholder="123" className="mt-1" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>Retour</Button>
                  <Button type="submit" className="flex-1 gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payer {formatPrice(total)}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
            <h3 className="font-semibold mb-4">Votre commande</h3>
            <div className="flex flex-col gap-3 mb-4">
              {cart.map(item => (
                <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-3">
                  <img src={item.image} alt={item.name} className="h-12 w-12 rounded object-cover" crossOrigin="anonymous" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Réduction</span>
                  <span>-{formatPrice(promoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Livraison</span>
                <span>{shippingCost === 0 ? "Gratuite" : formatPrice(shippingCost)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
