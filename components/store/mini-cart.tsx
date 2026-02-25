"use client"

import React, { useState } from "react"
import { useCartStore, useNavigationStore } from "@/lib/store-context"
import { PAGES } from "@/lib/routes"
import { formatPrice, pluralize } from "@/lib/formatters"
import { LAYOUT_CONSTANTS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Image from "next/image"
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCartToast } from "@/hooks/use-cart-toast"

/**
 * Mini panier affiché dans le header
 * Affiche un aperçu rapide du panier avec les articles et le total
 */
export const MiniCart = React.memo(function MiniCart() {
  const [open, setOpen] = useState(false)
  const { cart, cartCount, cartTotal, removeFromCart, promoDiscount, appliedPromo, isRestoringCart } = useCartStore()
  const { navigate } = useNavigationStore()
  const { showRemoveFromCartToast } = useCartToast()

  const handleRemove = (item: typeof cart[0]) => {
    removeFromCart(item.productId, item.color, item.size)
    showRemoveFromCartToast(item.name)
  }

  const shipping = cartTotal >= LAYOUT_CONSTANTS.FREE_SHIPPING_THRESHOLD ? 0 : LAYOUT_CONSTANTS.STANDARD_SHIPPING_COST
  const total = cartTotal - promoDiscount + shipping

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          aria-label={`Voir mon panier${cartCount > 0 ? ` (${cartCount} ${pluralize(cartCount, "article")})` : ' (vide)'}`}
        >
          <ShoppingBag className="h-5 w-5" />
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold"
              aria-hidden="true"
            >
              {cartCount}
            </motion.span>
          )}
          <span className="sr-only">Panier</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 md:w-96 p-0" 
        align="end"
        sideOffset={8}
      >
        <div className="flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Mon Panier</h3>
              {cartCount > 0 && (
                <span className="text-sm text-muted-foreground">
                  {cartCount} {pluralize(cartCount, "article")}
                </span>
              )}
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {isRestoringCart ? (
                <div className="p-6 text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Chargement du panier...</p>
                </div>
              ) : cart.length === 0 ? (
                <div className="p-6 text-center space-y-4">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto" aria-hidden />
                  <p className="text-muted-foreground text-sm">Votre panier est vide</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => {
                      setOpen(false)
                      navigate(PAGES.store.catalog)
                    }}
                  >
                    Continuer mes achats
                  </Button>
                </div>
              ) : (
                <div className="p-2">
                  {cart.map((item) => (
                    <motion.div
                      key={`${item.productId}-${item.color}-${item.size}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group"
                    >
                      <div className="relative h-16 w-16 rounded-md overflow-hidden shrink-0 bg-secondary">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          {item.color && <span>Couleur: {item.color}</span>}
                          {item.size && <span>Taille: {item.size}</span>}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            x{item.quantity}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(item)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0 p-1"
                        aria-label={`Retirer ${item.name} du panier`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-medium">{formatPrice(cartTotal)}</span>
              </div>
              {appliedPromo && promoDiscount > 0 && (
                <div className="flex items-center justify-between text-sm text-emerald-600">
                  <span>Code promo ({appliedPromo})</span>
                  <span className="font-medium">-{formatPrice(promoDiscount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Livraison</span>
                <span className="font-medium">
                  {shipping === 0 ? LAYOUT_CONSTANTS.FREE_SHIPPING_LABEL : formatPrice(shipping)}
                </span>
              </div>
              {cartTotal < LAYOUT_CONSTANTS.FREE_SHIPPING_THRESHOLD && (
                <p className="text-xs text-muted-foreground">
                  Ajoutez {formatPrice(LAYOUT_CONSTANTS.FREE_SHIPPING_THRESHOLD - cartTotal)} pour {LAYOUT_CONSTANTS.FREE_SHIPPING_LABEL_LONG.toLowerCase()}
                </p>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg">{formatPrice(total)}</span>
              </div>
              <Button
                onClick={() => {
                  setOpen(false)
                  navigate(PAGES.store.cart)
                }}
                className="w-full gap-2"
                size="lg"
              >
                Voir le panier <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
})


