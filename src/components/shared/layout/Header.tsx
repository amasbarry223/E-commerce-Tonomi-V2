/**
 * Header optimisé avec les nouveaux stores
 */
"use client"

import { useState, useCallback } from 'react'
import { useCartStore } from '../../../lib/stores/cart-store'
import { useWishlistStore } from '../../../lib/stores/wishlist-store'
import { useUIStore } from '../../../lib/stores/ui-store'
import { categories } from '@/lib/data'
import { Search, ShoppingBag, Heart, Sun, Moon, Menu, X, User, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function Header() {
  const cartCount = useCartStore((state) => state.getCount())
  const wishlistCount = useWishlistStore((state) => state.items.length)
  const { darkMode, toggleDarkMode, navigate, setCurrentView, searchQuery, setSearchQuery } = useUIStore()
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate('catalog')
      setSearchOpen(false)
    }
  }, [searchQuery, navigate, setSearchOpen])
  
  const mainCategories = categories.filter((c) => !['cat-5', 'cat-6'].includes(c.id))
  
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-center py-1.5 text-xs tracking-wider">
        Livraison gratuite pour toute commande de plus de 100€ | Code BIENVENUE10 = -10%
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
                <button 
                  onClick={() => { navigate('home'); setMobileMenuOpen(false) }} 
                  className="text-left text-lg font-medium hover:text-accent transition-colors"
                >
                  Accueil
                </button>
                {mainCategories.map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => { navigate('catalog'); setMobileMenuOpen(false) }} 
                    className="text-left text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
                <button 
                  onClick={() => { navigate('catalog'); setMobileMenuOpen(false) }} 
                  className="text-left text-lg font-medium hover:text-accent transition-colors"
                >
                  Catalogue
                </button>
                <div className="border-t border-border pt-4 mt-2">
                  <button 
                    onClick={() => { setCurrentView('admin'); setMobileMenuOpen(false) }} 
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Back-office
                  </button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          
          {/* Logo */}
          <button onClick={() => navigate('home')} className="flex items-center gap-2">
            <span className="font-serif text-2xl tracking-widest font-bold">LUXE</span>
          </button>
          
          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <button onClick={() => navigate('home')} className="text-sm tracking-wide hover:text-accent transition-colors">
              Accueil
            </button>
            <button onClick={() => navigate('catalog')} className="text-sm tracking-wide hover:text-accent transition-colors">
              Catalogue
            </button>
            {mainCategories.slice(0, 4).map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate('catalog')}
                className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors"
              >
                {cat.name}
              </button>
            ))}
            <button onClick={() => navigate('catalog')} className="text-sm tracking-wide text-red-500 font-medium hover:text-red-600 transition-colors">
              Promotions
            </button>
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
            
            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('wishlist')}>
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
              <span className="sr-only">Favoris</span>
            </Button>
            
            <Button variant="ghost" size="icon" onClick={() => navigate('account')}>
              <User className="h-5 w-5" />
              <span className="sr-only">Compte</span>
            </Button>
            
            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('cart')}>
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Panier</span>
            </Button>
            
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setCurrentView('admin')}>
              <LayoutDashboard className="h-5 w-5" />
              <span className="sr-only">Admin</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

