"use client"

import { useState } from "react"
import { useStore } from "@/lib/store-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Phone, Truck, ShieldCheck, RotateCcw, CreditCard } from "lucide-react"

export function StoreFooter() {
  const { navigate, subscribeNewsletter, newsletterSubscribed } = useStore()
  const [email, setEmail] = useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      subscribeNewsletter()
      setEmail("")
    }
  }

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Trust badges */}
      <div className="border-b border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center gap-2">
              <Truck className="h-6 w-6 text-accent" />
              <p className="text-sm font-medium">Livraison Gratuite</p>
              <p className="text-xs text-primary-foreground/60">{'Dès 100€ d\'achat'}</p>
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

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <img 
              src="/images/logo.png" 
              alt="TONOMI ACCESSOIRES" 
              className="h-16 md:h-20 w-auto object-contain mb-4"
            />
            <p className="text-sm text-primary-foreground/70 leading-relaxed mb-4">
              Maroquinerie et accessoires de mode haut de gamme. Des produits soigneusement sélectionnés pour leur qualité et leur élégance.
            </p>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> 12 Rue du Faubourg, 75008 Paris</span>
              <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> +33 1 42 68 53 00</span>
              <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> contact@luxe-paris.fr</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wider uppercase">Boutique</h4>
            <nav className="flex flex-col gap-2">
              {["Sacs à main", "Sacs à dos", "Portefeuilles", "Accessoires", "Nouveautés", "Promotions"].map(item => (
                <button key={item} onClick={() => navigate("catalog")} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors text-left">
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wider uppercase">Informations</h4>
            <nav className="flex flex-col gap-2">
              {["À propos", "Livraison", "Retours & Échanges", "Conditions Générales", "Politique de Confidentialité", "FAQ"].map(item => (
                <button key={item} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors text-left">
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
              <p className="text-sm text-accent font-medium">Merci pour votre inscription !</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  type="email"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 text-sm"
                />
                <Button type="submit" variant="secondary" size="sm" className="shrink-0">
                  OK
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-primary-foreground/50">
          &copy; 2026 LUXE Paris. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}
