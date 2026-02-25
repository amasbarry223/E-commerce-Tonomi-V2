"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useNavigationStore, useUIStore } from "@/lib/store-context"
import { PAGES } from "@/lib/routes"
import { SECTION_CONTAINER } from "@/lib/layout"
import { LAYOUT_CONSTANTS } from "@/lib/constants"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Phone, Truck, ShieldCheck, RotateCcw, CreditCard } from "lucide-react"
import { toast } from "sonner"
import { emailFieldSchema } from "@/lib/utils/validation"

const INFO_LINKS = ["À propos", "Livraison", "Retours & Échanges", "Conditions Générales", "Politique de Confidentialité", "FAQ"] as const

const INFO_LINK_TO_PAGE: Record<(typeof INFO_LINKS)[number], string> = {
  "À propos": PAGES.store.about,
  "Livraison": PAGES.store.delivery,
  "Retours & Échanges": PAGES.store.returns,
  "Conditions Générales": PAGES.store.terms,
  "Politique de Confidentialité": PAGES.store.privacy,
  "FAQ": PAGES.store.faq,
}

export const StoreFooter = React.memo(function StoreFooter() {
  const { navigate, selectCategory } = useNavigationStore()
  const { subscribeNewsletter, newsletterSubscribed } = useUIStore()
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError("")
    const result = emailFieldSchema.safeParse(email.trim())
    if (!result.success) {
      const msg = result.error.issues[0]?.message ?? "Email invalide"
      setEmailError(msg)
      toast.error(msg)
      return
    }
    subscribeNewsletter()
    setEmail("")
    toast.success("Merci pour votre inscription à la newsletter !")
  }

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Trust badges */}
      <div className="border-b border-primary-foreground/10">
        <div className={`${SECTION_CONTAINER} py-8`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center gap-2">
              <Truck className="h-6 w-6 text-accent" />
              <p className="text-sm font-medium">{LAYOUT_CONSTANTS.FREE_SHIPPING_LABEL_LONG}</p>
              <p className="text-xs text-primary-foreground/60">Dès {LAYOUT_CONSTANTS.FREE_SHIPPING_THRESHOLD}€ d&apos;achat</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck className="h-6 w-6 text-accent" />
              <p className="text-sm font-medium">Paiement Sécurisé</p>
              <p className="text-xs text-primary-foreground/60">SSL 100% sécurisé</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RotateCcw className="h-6 w-6 text-accent" />
              <p className="text-sm font-medium">Retours Gratuits</p>
              <p className="text-xs text-primary-foreground/60">Sous 30 jours</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <CreditCard className="h-6 w-6 text-accent" />
              <p className="text-sm font-medium">Paiement en 3x</p>
              <p className="text-xs text-primary-foreground/60">Sans frais</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`${SECTION_CONTAINER} py-12`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Image 
              src="/images/logo.png" 
              alt="TONOMI ACCESSOIRES" 
              width={120}
              height={80}
              className="h-16 md:h-20 w-auto object-contain mb-4"
            />
            <p className="text-sm text-primary-foreground/70 leading-relaxed mb-4">
              Maroquinerie et accessoires de mode haut de gamme. Des produits soigneusement sélectionnés pour leur qualité et leur élégance.
            </p>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> 12 Rue du Faubourg, 75008 Paris</span>
              <span className="flex items-center gap-2"><Phone className="h-4 w-4" /><a href="tel:+33142685300" className="hover:text-primary-foreground transition-colors">+33 1 42 68 53 00</a></span>
              <span className="flex items-center gap-2"><Mail className="h-4 w-4" /><a href="mailto:contact@tonomi.com" className="hover:text-primary-foreground transition-colors">contact@tonomi.com</a></span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wider uppercase">Boutique</h4>
            <nav className="flex flex-col gap-2">
              {["Sacs à main", "Sacs à dos", "Portefeuilles", "Accessoires", "Nouveautés", "Promotions", "Mon compte"].map(item => (
                <button
                  key={item}
                  onClick={() => {
                    if (item === "Promotions") selectCategory("cat-6")
                    else if (item === "Mon compte") navigate(PAGES.store.account)
                    else {
                      selectCategory(null)
                      navigate(PAGES.store.catalog)
                    }
                  }}
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors text-left"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wider uppercase">Informations</h4>
            <nav className="flex flex-col gap-2">
              {INFO_LINKS.map(item => (
                <button
                  key={item}
                  onClick={() => navigate(INFO_LINK_TO_PAGE[item])}
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors text-left"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wider uppercase">Newsletter</h4>
            <p className="text-sm text-primary-foreground/70 mb-4">Inscrivez-vous pour recevoir nos offres exclusives et nouveautés.</p>
            {newsletterSubscribed ? (
              <p className="text-sm text-accent font-medium">Merci, vous êtes inscrit.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError("") }}
                    placeholder="votre@email.com"
                    type="email"
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 text-sm"
                    aria-label="Adresse email pour la newsletter"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "newsletter-email-error" : undefined}
                  />
                  <Button type="submit" variant="secondary" size="sm" className="shrink-0">
                    S&apos;inscrire
                  </Button>
                </div>
                {emailError && (
                  <p id="newsletter-email-error" className="text-xs text-accent">
                    {emailError}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className={`${SECTION_CONTAINER} py-4 text-center text-xs text-primary-foreground/50`}>
          &copy; 2026 Tonomi Accessoires. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
})
