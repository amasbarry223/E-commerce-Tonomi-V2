"use client"

import { useState, useEffect, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useStore } from "@/lib/store-context"
import { products, categories } from "@/lib/data"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { defaultTransition } from "@/lib/animations"
import { SECTION_CONTAINER, SECTION_FULL, SECTION_PADDING, EXCLUDED_CATEGORY_IDS } from "@/lib/layout"

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
]

export function HomePage() {
  const { navigate } = useStore()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
      setDirection(1)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    if (newDirection === 1) {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    } else {
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    }
  }

  const featured = useMemo(() => {
    return [...products]
      .filter(p => p.featured)
      .sort((a, b) => a.id.localeCompare(b.id))
      .slice(0, 8)
  }, [])

  const newProducts = useMemo(() => {
    return [...products]
      .filter(p => p.badge === "new")
      .sort((a, b) => a.id.localeCompare(b.id))
      .slice(0, 4)
  }, [])

  const bestSellers = useMemo(() => {
    return [...products]
      .sort((a, b) => {
        const diff = b.reviewCount - a.reviewCount
        return diff !== 0 ? diff : a.id.localeCompare(b.id)
      })
      .slice(0, 4)
  }, [])

  const mainCategories = useMemo(
    () => categories.filter(c => !EXCLUDED_CATEGORY_IDS.includes(c.id)),
    []
  )

  return (
    <div className="w-full">
      {/* Hero Slider - plein écran */}
      <section className={`relative h-[60vh] md:h-[70vh] overflow-hidden ${SECTION_FULL}`}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={defaultTransition}
            className="absolute inset-0"
          >
            <motion.img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 5, ease: "easeOut" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full ${SECTION_PADDING}`}>
                <motion.div
                  className="max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, ...defaultTransition }}
                >
                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-4 text-balance leading-tight">
                    {heroSlides[currentSlide].title}
                  </h1>
                  <p className="text-lg text-white/80 mb-6">{heroSlides[currentSlide].subtitle}</p>
                  <Button onClick={() => navigate("catalog")} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                    {heroSlides[currentSlide].cta} <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slider controls */}
        <motion.button
          onClick={() => paginate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>
        <motion.button
          onClick={() => paginate(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => {
                setDirection(i > currentSlide ? 1 : -1)
                setCurrentSlide(i)
              }}
              className={`h-2 rounded-full ${i === currentSlide ? "bg-white" : "bg-white/50"}`}
              animate={{
                width: i === currentSlide ? 32 : 8,
              }}
              transition={defaultTransition}
            />
          ))}
        </div>
      </section>

      {/* Nos Catégories - plein écran */}
      <section className={`py-16 ${SECTION_CONTAINER}`}>
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl font-bold mb-2">Nos Catégories</h2>
          <p className="text-muted-foreground">Trouvez le sac parfait pour chaque occasion</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mainCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate("catalog")}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden"
            >
              <img src={cat.image} alt={cat.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" crossOrigin="anonymous" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-semibold text-lg">{cat.name}</h3>
                <p className="text-sm text-white/70">{cat.productCount} articles</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Nos Coups de Coeur - plein écran */}
      <section className={`py-16 bg-secondary/50 ${SECTION_FULL}`}>
        <div className={SECTION_CONTAINER}>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-2">Nos Coups de Coeur</h2>
              <p className="text-muted-foreground">Articles sélectionnés pour vous</p>
            </div>
            <Button variant="outline" onClick={() => navigate("catalog")} className="gap-2 hidden md:flex">
              Tout voir <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Nouveautés - plein écran */}
      <section className={`py-16 ${SECTION_CONTAINER}`}>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl font-bold mb-2">Nouveautés</h2>
            <p className="text-muted-foreground">Les derniers arrivages</p>
          </div>
          <Button variant="outline" onClick={() => navigate("catalog")} className="gap-2 hidden md:flex">
            Tout voir <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {newProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>

      {/* Bandeau promo - plein écran */}
      <section className={`py-16 bg-primary text-primary-foreground ${SECTION_FULL}`}>
        <div className={`${SECTION_CONTAINER} text-center`}>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Soldes Exceptionnelles</h2>
          <p className="text-primary-foreground/70 mb-6 max-w-xl mx-auto">
            {'Profitez de réductions allant jusqu\'à -30% sur une sélection de nos plus beaux articles. Offre limitée !'}
          </p>
          <Button onClick={() => navigate("catalog")} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
            Voir les promotions <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Best-Sellers - plein écran */}
      <section className={`py-16 ${SECTION_CONTAINER}`}>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl font-bold mb-2">Best-Sellers</h2>
            <p className="text-muted-foreground">Les plus populaires</p>
          </div>
          <Button variant="outline" onClick={() => navigate("catalog")} className="gap-2 hidden md:flex">
            Tout voir <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>
    </div>
  )
}
