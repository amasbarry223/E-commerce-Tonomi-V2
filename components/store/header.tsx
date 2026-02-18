"use client"

import { useState } from "react"
import { useStore } from "@/lib/store-context"
import { categories } from "@/lib/data"
import { Search, ShoppingBag, Heart, Sun, Moon, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function StoreHeader() {
  const { cartCount, wishlist, darkMode, toggleDarkMode, navigate, setCurrentView, setSearchQuery, searchQuery } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate("catalog")
      setSearchOpen(false)
    }
  }

  const mainCategories = categories.filter(c => !["cat-5", "cat-6"].includes(c.id))

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-center py-1.5 text-xs tracking-wider">
        Livraison gratuite pour toute commande de plus de 100&euro; | Code BIENVENUE10 = -10%
      </div>

      <div className="mx-auto max-w-7xl px-4">
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
              <nav className="flex flex-col gap-4 mt-8">
                <button onClick={() => { navigate("home"); setMobileMenuOpen(false) }} className="text-left text-lg font-medium hover:text-accent transition-colors">Accueil</button>
                {mainCategories.map(cat => (
                  <button key={cat.id} onClick={() => { navigate("category"); setMobileMenuOpen(false); }} className="text-left text-muted-foreground hover:text-foreground transition-colors">
                    {cat.name}
                  </button>
                ))}
                <button onClick={() => { navigate("catalog"); setMobileMenuOpen(false) }} className="text-left text-lg font-medium hover:text-accent transition-colors">Catalogue</button>
                <button onClick={() => { navigate("promotions"); setMobileMenuOpen(false) }} className="text-left text-lg font-medium text-red-500 hover:text-red-600 transition-colors">Promotions</button>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <button onClick={() => navigate("home")} className="flex items-center gap-2">
            <img 
              src="/images/logo.png" 
              alt="TONOMI ACCESSOIRES" 
              className="h-14 md:h-16 w-auto object-contain"
            />
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <button onClick={() => navigate("home")} className="text-sm tracking-wide hover:text-accent transition-colors">Accueil</button>
            <button onClick={() => navigate("catalog")} className="text-sm tracking-wide hover:text-accent transition-colors">Catalogue</button>
            {mainCategories.slice(0, 4).map(cat => (
              <button
                key={cat.id}
                onClick={() => { navigate("catalog"); }}
                className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors"
              >
                {cat.name}
              </button>
            ))}
            <button onClick={() => navigate("catalog")} className="text-sm tracking-wide text-red-500 font-medium hover:text-red-600 transition-colors">Promotions</button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-40 md:w-64 h-9 text-sm"
                  autoFocus
                />
                <Button variant="ghost" size="icon" type="button" onClick={() => setSearchOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </form>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Rechercher</span>
              </Button>
            )}

            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Theme</span>
            </Button>

            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("wishlist")}>
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
              <span className="sr-only">Favoris</span>
            </Button>

            <Button variant="ghost" size="icon" onClick={() => navigate("account")}>
              <User className="h-5 w-5" />
              <span className="sr-only">Compte</span>
            </Button>

            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("cart")}>
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Panier</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
