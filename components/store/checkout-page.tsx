"use client"

import { useState } from "react"
import Image from "next/image"
import { useStore } from "@/lib/store-context"
import { PAGES } from "@/lib/routes"
import type { CartItem } from "@/lib/store-context"
import { formatPrice } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Field, FieldError } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle2, CreditCard, Truck, ShieldCheck, MapPin, Package } from "lucide-react"
import { motion } from "framer-motion"
import { useCheckoutForm } from "@/hooks/use-checkout-form"
import { logger } from "@/lib/utils/logger"
import { toast } from "sonner"
import { LAYOUT_CONSTANTS, ANIMATION_DELAYS, ORDER_CONSTANTS } from "@/lib/constants"
import { paymentCardSchema, type CheckoutFormData } from "@/src/lib/utils/validation"

export function CheckoutPage() {
  const { cart, cartTotal, promoDiscount, clearCart, navigate } = useStore()
  const [step, setStep] = useState(1)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [shipping, setShipping] = useState("standard")
  const [card, setCard] = useState("")
  const [exp, setExp] = useState("")
  const [cvc, setCvc] = useState("")
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({})
  const [orderRecap, setOrderRecap] = useState<{
    data: CheckoutFormData
    shipping: string
    shippingCost: number
    total: number
    lines: CartItem[]
  } | null>(null)
  const shippingCost = shipping === "express" ? LAYOUT_CONSTANTS.EXPRESS_SHIPPING_COST : cartTotal >= LAYOUT_CONSTANTS.FREE_SHIPPING_THRESHOLD ? 0 : LAYOUT_CONSTANTS.STANDARD_SHIPPING_COST
  const total = cartTotal - promoDiscount + shippingCost

  const { form, handleSubmit, isSubmitting, errors, trigger } = useCheckoutForm({
    onSubmit: async (data) => {
      await new Promise(resolve => setTimeout(resolve, ANIMATION_DELAYS.CHECKOUT_PROCESSING_DELAY))
      const cost = shipping === "express" ? LAYOUT_CONSTANTS.EXPRESS_SHIPPING_COST : cartTotal >= LAYOUT_CONSTANTS.FREE_SHIPPING_THRESHOLD ? 0 : LAYOUT_CONSTANTS.STANDARD_SHIPPING_COST
      const orderTotal = cartTotal - promoDiscount + cost
      setOrderRecap({
        data: data,
        shipping: shipping === "express" ? "Express (1-2 jours)" : "Standard (3-5 jours)",
        shippingCost: cost,
        total: orderTotal,
        lines: [...cart],
      })
      setOrderPlaced(true)
      clearCart()
    },
    onError: (error) => {
      // Log l'erreur de manière centralisée
      logger.logError(error, "CheckoutPage", {
        step,
        cartTotal,
        promoDiscount,
      })
    },
  })

  const handlePlaceOrder = handleSubmit

  const handlePayClick = async () => {
    if (step !== 3) return
    setCardErrors({})
    const result = paymentCardSchema.safeParse({ card, exp, cvc })
    if (!result.success) {
      const errs: Record<string, string> = {}
      result.error.errors.forEach((e) => {
        const p = e.path[0] as string
        if (!errs[p]) errs[p] = e.message
      })
      setCardErrors(errs)
      const first = result.error.errors[0]
      if (first) {
        toast.error(first.message)
        logger.logError(new Error(first.message), "CheckoutPage", { step: 3 })
      }
      return
    }
    await handlePlaceOrder()
  }

  const handleNextStep = async () => {
    if (step === 1) {
      // Valider les champs de l'étape 1 avant de continuer
      const isValid = await trigger(["firstName", "lastName", "email", "phone", "address", "city", "zip"])
      if (isValid) {
        setStep(2)
      } else {
        // Scroll vers le premier champ en erreur
        const firstErrorField = Object.keys(errors)[0]
        if (firstErrorField) {
          const element = document.getElementById(firstErrorField)
          element?.scrollIntoView({ behavior: "smooth", block: "center" })
          element?.focus()
        }
      }
    } else if (step === 2) {
      setStep(3)
    }
  }

  if (orderPlaced) {
    const orderNumber = ORDER_CONSTANTS.ORDER_NUMBER_PREFIX + Date.now().toString(36).toUpperCase().slice(-6)
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="text-center mb-8">
          <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold mb-2">Commande confirmée !</h1>
          <p className="text-muted-foreground mb-2">Merci pour votre commande.</p>
          <p className="text-sm text-muted-foreground mb-2">Vous recevrez un email de confirmation avec les détails de suivi.</p>
          <p className="font-mono text-lg font-bold mb-6">Numéro de commande : {orderNumber}</p>
        </div>
        {orderRecap && (
          <div className="bg-card border border-border rounded-lg p-6 text-left space-y-4 mb-8">
            <h2 className="font-semibold text-lg">Récapitulatif</h2>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Adresse de livraison</p>
              <p className="text-sm">
                {orderRecap.data.firstName} {orderRecap.data.lastName}<br />
                {orderRecap.data.address}<br />
                {orderRecap.data.zip} {orderRecap.data.city}<br />
                {orderRecap.data.country}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Livraison</p>
              <p className="text-sm">{orderRecap.shipping} — {orderRecap.shippingCost === 0 ? "Offert" : formatPrice(orderRecap.shippingCost)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Articles</p>
              <ul className="space-y-2">
                {orderRecap.lines.map((item) => (
                  <li key={`${item.productId}-${item.color ?? ""}-${item.size ?? ""}`} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(orderRecap.total)}</span>
            </div>
          </div>
        )}
        <div className="text-center">
          <Button onClick={() => navigate(PAGES.store.home)} className="gap-2">
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Votre panier est vide</p>
        <Button onClick={() => navigate(PAGES.store.catalog)}>Voir le catalogue</Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-serif text-2xl md:text-3xl font-bold mb-8">Passer commande</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 md:gap-4 mb-8">
        {[
          { label: "Adresse", icon: MapPin },
          { label: "Livraison", icon: Package },
          { label: "Paiement", icon: CreditCard },
        ].map((stepInfo, i) => {
          const Icon = stepInfo.icon
          const stepNumber = i + 1
          const isCompleted = step > stepNumber
          const isActive = step === stepNumber

          return (
            <div key={stepInfo.label} className="flex items-center flex-1">
              <div className="flex items-center gap-2 flex-1">
                <motion.div
                  className={`relative h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : isActive
                      ? "bg-primary text-primary-foreground ring-2 ring-primary/20"
                      : "bg-secondary text-muted-foreground"
                  }`}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <>
                      <Icon className={`h-4 w-4 ${isActive ? "block" : "hidden md:block"}`} />
                      <span className={`${isActive ? "hidden" : "block md:hidden"}`}>{stepNumber}</span>
                    </>
                  )}
                </motion.div>
                <div className="flex-1 hidden md:block">
                  <p className={`text-xs text-muted-foreground mb-0.5 ${isActive ? "text-foreground" : ""}`}>
                    Étape {stepNumber}
                  </p>
                  <p className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {stepInfo.label}
                  </p>
                </div>
              </div>
              {i < 2 && (
                <div className="flex-1 mx-2 md:mx-4">
                  <div className="relative h-px bg-border overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-emerald-500"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isCompleted ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      style={{ transformOrigin: "left" }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handlePlaceOrder}>
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-semibold text-lg mb-1">Adresse de livraison</h2>
                <p className="text-sm text-muted-foreground mb-4">Étape 1/3 — Champs obligatoires <span className="text-destructive" aria-hidden="true">*</span></p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <Label htmlFor="firstName" className="text-sm">Prénom <span className="text-destructive" aria-hidden="true">*</span></Label>
                    <Input 
                      id="firstName" 
                      {...form.register("firstName")}
                      className="mt-1"
                      autoComplete="given-name"
                      aria-invalid={errors.firstName ? "true" : "false"}
                      aria-describedby={errors.firstName ? "firstName-error" : undefined}
                    />
                    {errors.firstName && (
                      <FieldError id="firstName-error" className="mt-1">
                        {errors.firstName.message}
                      </FieldError>
                    )}
                  </Field>

                  <Field>
                    <Label htmlFor="lastName" className="text-sm">Nom <span className="text-destructive" aria-hidden="true">*</span></Label>
                    <Input 
                      id="lastName" 
                      {...form.register("lastName")}
                      className="mt-1"
                      autoComplete="family-name"
                      aria-invalid={errors.lastName ? "true" : "false"}
                      aria-describedby={errors.lastName ? "lastName-error" : undefined}
                    />
                    {errors.lastName && (
                      <FieldError id="lastName-error" className="mt-1">
                        {errors.lastName.message}
                      </FieldError>
                    )}
                  </Field>

                  <Field className="md:col-span-2">
                    <Label htmlFor="email" className="text-sm">Email <span className="text-destructive" aria-hidden="true">*</span></Label>
                    <Input 
                      id="email" 
                      type="email" 
                      {...form.register("email")}
                      className="mt-1"
                      autoComplete="email"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                      <FieldError id="email-error" className="mt-1">
                        {errors.email.message}
                      </FieldError>
                    )}
                  </Field>

                  <Field className="md:col-span-2">
                    <Label htmlFor="address" className="text-sm">Adresse <span className="text-destructive" aria-hidden="true">*</span></Label>
                    <Input 
                      id="address" 
                      {...form.register("address")}
                      className="mt-1"
                      autoComplete="street-address"
                      aria-invalid={errors.address ? "true" : "false"}
                      aria-describedby={errors.address ? "address-error" : undefined}
                    />
                    {errors.address && (
                      <FieldError id="address-error" className="mt-1">
                        {errors.address.message}
                      </FieldError>
                    )}
                  </Field>

                  <Field>
                    <Label htmlFor="city" className="text-sm">Ville <span className="text-destructive" aria-hidden="true">*</span></Label>
                    <Input 
                      id="city" 
                      {...form.register("city")}
                      className="mt-1"
                      autoComplete="address-level2"
                      aria-invalid={errors.city ? "true" : "false"}
                      aria-describedby={errors.city ? "city-error" : undefined}
                    />
                    {errors.city && (
                      <FieldError id="city-error" className="mt-1">
                        {errors.city.message}
                      </FieldError>
                    )}
                  </Field>

                  <Field>
                    <Label htmlFor="zip" className="text-sm">Code postal <span className="text-destructive" aria-hidden="true">*</span></Label>
                    <Input 
                      id="zip" 
                      {...form.register("zip")}
                      className="mt-1"
                      maxLength={5}
                      autoComplete="postal-code"
                      aria-invalid={errors.zip ? "true" : "false"}
                      aria-describedby={errors.zip ? "zip-error" : undefined}
                    />
                    {errors.zip && (
                      <FieldError id="zip-error" className="mt-1">
                        {errors.zip.message}
                      </FieldError>
                    )}
                  </Field>

                  <Field>
                    <Label htmlFor="phone" className="text-sm">Téléphone <span className="text-destructive" aria-hidden="true">*</span></Label>
                    <Input 
                      id="phone" 
                      {...form.register("phone")}
                      className="mt-1"
                      placeholder="+33 6 12 34 56 78"
                      autoComplete="tel"
                      aria-invalid={errors.phone ? "true" : "false"}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                    />
                    {errors.phone && (
                      <FieldError id="phone-error" className="mt-1">
                        {errors.phone.message}
                      </FieldError>
                    )}
                  </Field>
                </div>
                <Button 
                  type="button" 
                  onClick={handleNextStep} 
                  className="mt-6"
                  aria-label="Continuer vers l'étape de livraison"
                >
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
                      <p className="text-xs text-muted-foreground">{cartTotal >= LAYOUT_CONSTANTS.FREE_SHIPPING_THRESHOLD ? LAYOUT_CONSTANTS.FREE_SHIPPING_LABEL : formatPrice(LAYOUT_CONSTANTS.STANDARD_SHIPPING_COST)}</p>
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
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    aria-label="Retour à l'étape précédente"
                  >
                    Retour
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleNextStep}
                    aria-label="Continuer vers l'étape de paiement"
                  >
                    Continuer
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-semibold text-lg mb-4">Paiement sécurisé</h2>
                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-700 dark:text-emerald-400 text-sm">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    Paiement 100% sécurisé par chiffrement SSL
                  </div>
                  <p className="text-xs text-muted-foreground">Retours gratuits sous 30 jours. Paiement sécurisé.</p>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <Label htmlFor="card" className="text-sm">Numéro de carte <span className="text-destructive" aria-hidden="true">*</span></Label>
                    <Input
                      id="card"
                      value={card}
                      onChange={(e) => setCard(e.target.value.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim())}
                      placeholder="4242 4242 4242 4242"
                      className="mt-1"
                      maxLength={19 + 4}
                      aria-invalid={!!cardErrors.card}
                      aria-describedby={cardErrors.card ? "card-error" : undefined}
                    />
                    {cardErrors.card && (
                      <p id="card-error" className="text-xs text-destructive mt-1">{cardErrors.card}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="exp" className="text-sm">Expiration <span className="text-destructive" aria-hidden="true">*</span></Label>
                      <Input
                        id="exp"
                        value={exp}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "")
                          if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2, 4)
                          setExp(v)
                        }}
                        placeholder="MM/AA"
                        className="mt-1"
                        maxLength={5}
                        aria-invalid={!!cardErrors.exp}
                        aria-describedby={cardErrors.exp ? "exp-error" : undefined}
                      />
                      {cardErrors.exp && (
                        <p id="exp-error" className="text-xs text-destructive mt-1">{cardErrors.exp}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="cvc" className="text-sm">CVC <span className="text-destructive" aria-hidden="true">*</span></Label>
                      <Input
                        id="cvc"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        className="mt-1"
                        maxLength={4}
                        aria-invalid={!!cardErrors.cvc}
                        aria-describedby={cardErrors.cvc ? "cvc-error" : undefined}
                      />
                      {cardErrors.cvc && (
                        <p id="cvc-error" className="text-xs text-destructive mt-1">{cardErrors.cvc}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    disabled={isSubmitting}
                  >
                    Retour
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 gap-2"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    aria-label={`Payer ${formatPrice(total)}`}
                    onClick={handlePayClick}
                  >
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
          <div className="bg-card border border-border rounded-lg p-6 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <h3 className="font-semibold mb-4">Votre commande</h3>
            <div className="flex flex-col gap-3 mb-4">
              {cart.map(item => (
                <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-3">
                  <div className="relative h-12 w-12 rounded overflow-hidden shrink-0">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
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
                <span>{shippingCost === 0 ? LAYOUT_CONSTANTS.FREE_SHIPPING_LABEL : formatPrice(shippingCost)}</span>
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
