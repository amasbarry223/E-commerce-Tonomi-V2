"use client"

import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useUIStore } from '@/src/lib/stores/ui-store'
import { useProducts } from '@/src/lib/hooks/use-products'
import { categories } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

// Lazy load ProductCard
const ProductCard = dynamic(() => import('@/components/store/product/ProductCard').then(m => ({ default: m.ProductCard })), {
  loading: () => <div className="aspect-square bg-muted animate-pulse rounded-lg" />,
})

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1400&h=600&fit=crop",
    title: "Collection Automne-Hiver",
    subtitle: "Découvrez nos nouveaux modèles en cuir véritable",
    cta: "Voir la collection",
  },
  {
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1400&h=600&fit=crop",
    title: "Soldes Exceptionnelles",
    subtitle: "Jusqu'à -30% sur une sélection d'articles",
    cta: "En profiter",
  },
  {
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1400&h=600&fit=crop",
    title: "Accessoires de Luxe",
    subtitle: "L'élégance au quotidien",
    cta: "Découvrir",
  },
] as const

export function HomePage() {
  const navigate = useUIStore((state) => state.navigate)
  const [currentSlide, setCurrentSlide] = useState(0)
  const { products: allProducts } = useProducts()
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])
  
  const featured = useMemo(() => {
    return [...allProducts]
      .filter((p) => p.featured)
      .sort((a, b) => a.id.localeCompare(b.id))
      .slice(0, 8)
  }, [allProducts])
  
  const newProducts = useMemo(() => {
    return [...allProducts]
      .filter((p) => p.badge === 'new')
      .sort((a, b) => a.id.localeCompare(b.id))
      .slice(0, 4)
  }, [allProducts])
  
  const bestSellers = useMemo(() => {
    return [...allProducts]
      .sort((a, b) => {
        const diff = b.reviewCount - a.reviewCount
        return diff !== 0 ? diff : a.id.localeCompare(b.id)
      })
      .slice(0, 4)
  }, [allProducts])
  
  const mainCategories = useMemo(() => {
    return categories.filter((c) => !['cat-5', 'cat-6'].includes(c.id))
  }, [])
  
  return (
    <div>
      {/* Hero Slider */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="h-full w-full object-cover" 
              crossOrigin="anonymous" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto max-w-7xl px-4 w-full">
                <div className="max-w-lg">
                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-4 text-balance leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg text-white/80 mb-6">{slide.subtitle}</p>
                  <Button 
                    onClick={() => navigate('catalog')} 
                    size="lg" 
                    className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
                  >
                    {slide.cta} <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          aria-label="Slide précédent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          aria-label="Slide suivant"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        
        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
              }`}
              aria-label={`Aller au slide ${i + 1}`}
            />
          ))}
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-16 mx-auto max-w-7xl px-4">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl font-bold mb-2">Nos Catégories</h2>
          <p className="text-muted-foreground">Trouvez le sac parfait pour chaque occasion</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mainCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate('catalog')}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden"
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                crossOrigin="anonymous" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-semibold text-lg">{cat.name}</h3>
                <p className="text-sm text-white/70">{cat.productCount} articles</p>
              </div>
            </button>
          ))}
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-2">Nos Coups de Coeur</h2>
              <p className="text-muted-foreground">Articles sélectionnés pour vous</p>
            </div>
            <Button variant="outline" onClick={() => navigate('catalog')} className="gap-2 hidden md:flex">
              Tout voir <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* New Arrivals */}
      <section className="py-16 mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl font-bold mb-2">Nouveautés</h2>
            <p className="text-muted-foreground">Les derniers arrivages</p>
          </div>
          <Button variant="outline" onClick={() => navigate('catalog')} className="gap-2 hidden md:flex">
            Tout voir <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      {/* Promo Banner */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Soldes Exceptionnelles</h2>
          <p className="text-primary-foreground/70 mb-6 max-w-xl mx-auto">
            Profitez de réductions allant jusqu'à -30% sur une sélection de nos plus beaux articles. Offre limitée !
          </p>
          <Button 
            onClick={() => navigate('catalog')} 
            size="lg" 
            className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
          >
            Voir les promotions <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
      
      {/* Best Sellers */}
      <section className="py-16 mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl font-bold mb-2">Best-Sellers</h2>
            <p className="text-muted-foreground">Les plus populaires</p>
          </div>
          <Button variant="outline" onClick={() => navigate('catalog')} className="gap-2 hidden md:flex">
            Tout voir <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
