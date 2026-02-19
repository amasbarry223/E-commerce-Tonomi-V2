"use client"

import { useState } from "react"
import Image from "next/image"
import { useStore } from "@/lib/store-context"
import { categories } from "@/lib/data"
import { SECTION_PADDING, EXCLUDED_CATEGORY_IDS } from "@/lib/layout"
import { Search, Heart, Sun, Moon, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { SearchAutocomplete } from "./search-autocomplete"
import { MiniCart } from "./mini-cart"

export function StoreHeader() {
  const { wishlist, darkMode, toggleDarkMode, navigate, selectCategory } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const mainCategories = categories.filter(c => !EXCLUDED_CATEGORY_IDS.includes(c.id))

  return (
    <header role="banner" className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-center py-1.5 text-xs tracking-wider" role="region" aria-label="Information promotionnelle">
        Livraison gratuite pour toute commande de plus de 100&euro; | Code BIENVENUE10 = -10%
      </div>

      <div className={`w-full ${SECTION_PADDING}`}>
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-background text-foreground">
              <VisuallyHidden>
                <SheetTitle>Menu de navigation</SheetTitle>
              </VisuallyHidden>
              <nav role="navigation" aria-label="Menu mobile" className="flex flex-col gap-4 mt-8">
                <button 
                  onClick={() => { navigate("home"); setMobileMenuOpen(false) }} 
                  className="text-left text-lg font-medium hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:rounded"
                  aria-label="Aller à la page d'accueil"
                >
                  Accueil
                </button>
                {mainCategories.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => { 
                      selectCategory(cat.id); 
                      navigate("catalog"); 
                      setMobileMenuOpen(false); 
                    }} 
                    className="text-left text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:rounded"
                    aria-label={`Voir les produits de la catégorie ${cat.name}`}
                  >
                    {cat.name}
                  </button>
                ))}
                <button 
                  onClick={() => { selectCategory(null); navigate("catalog"); setMobileMenuOpen(false) }} 
                  className="text-left text-lg font-medium hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:rounded"
                  aria-label="Voir le catalogue complet"
                >
                  Catalogue
                </button>
                <button 
                  onClick={() => { selectCategory(null); navigate("promotions"); setMobileMenuOpen(false) }} 
                  className="text-left text-lg font-medium text-red-500 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:rounded"
                  aria-label="Voir les promotions"
                >
                  Promotions
                </button>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <button 
            onClick={() => navigate("home")} 
            className="flex items-center gap-2"
            aria-label="Retour à l'accueil - TONOMI ACCESSOIRES"
          >
            <Image 
              src="/images/logo.png" 
              alt="TONOMI ACCESSOIRES" 
              width={120}
              height={64}
              className="h-14 md:h-16 w-auto object-contain"
              priority
            />
          </button>

          {/* Desktop nav */}
          <nav role="navigation" aria-label="Navigation principale" className="hidden lg:flex items-center gap-8">
            <button 
              onClick={() => navigate("home")} 
              className="text-sm tracking-wide hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:rounded"
              aria-label="Aller à la page d'accueil"
            >
              Accueil
            </button>
            <button 
              onClick={() => { selectCategory(null); navigate("catalog"); }} 
              className="text-sm tracking-wide hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:rounded"
              aria-label="Voir le catalogue complet"
            >
              Catalogue
            </button>
            {mainCategories.slice(0, 4).map(cat => (
              <button
                key={cat.id}
                onClick={() => { 
                  selectCategory(cat.id); 
                  navigate("catalog"); 
                }}
                className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:rounded"
                aria-label={`Voir les produits de la catégorie ${cat.name}`}
              >
                {cat.name}
              </button>
            ))}
            <button 
              onClick={() => { selectCategory(null); navigate("promotions"); }} 
              className="text-sm tracking-wide text-red-500 font-medium hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:rounded"
              aria-label="Voir les promotions"
            >
              Promotions
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Recherche avec autocomplétion */}
            <div className="hidden md:block">
              <SearchAutocomplete />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => navigate("catalog")}
              aria-label="Rechercher"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Rechercher</span>
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Changer le thème</span>
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="relative" 
              onClick={() => navigate("wishlist")}
              aria-label={`Voir mes favoris${wishlist.length > 0 ? ` (${wishlist.length} article${wishlist.length > 1 ? 's' : ''})` : ''}`}
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span 
                  className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold"
                  aria-hidden="true"
                >
                  {wishlist.length}
                </span>
              )}
              <span className="sr-only">Favoris</span>
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("account")}
              aria-label="Voir mon compte"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Compte</span>
            </Button>

            <MiniCart />
          </div>
        </div>
      </div>
    </header>
  )
}
