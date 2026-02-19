"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useStore } from "@/lib/store-context"
import { products, categories, formatPrice } from "@/lib/data"
import { SECTION_CONTAINER } from "@/lib/layout"
import { ProductCard } from "./product-card"
import { ProductCardSkeletonGrid } from "./product-card-skeleton"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { SlidersHorizontal, X, Grid3X3, LayoutGrid, Search } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination"

const MATERIALS = ["Cuir véritable", "Cuir grainé", "Cuir saffiano", "Cuir d'agneau", "Canvas & Cuir", "Nylon imperméable", "Similicuir", "Toile & Cuir"] as const
const BRANDS = ["Maison Élégance", "Bohème Paris", "Cristal de Paris", "Urban Mode", "Riviera Mode", "Artisan Paris"] as const
const PRICE_RANGE_DEFAULT: [number, number] = [0, 300]
const PRODUCTS_PER_PAGE = 12

export function CatalogPage() {
  const { searchQuery, selectedCategorySlug, selectCategory, navigate } = useStore()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<number[]>([...PRICE_RANGE_DEFAULT])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>("popularity")
  const [gridCols, setGridCols] = useState<3 | 4>(4)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setSelectedCategory(selectedCategorySlug ?? "all")
    setCurrentPage(1) // Reset à la page 1 quand les filtres changent
  }, [selectedCategorySlug, searchQuery])

  // Simuler le chargement initial pour démontrer les skeleton loaders
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const toggleBrand = useCallback((brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }, [])

  const toggleMaterial = useCallback((material: string) => {
    setSelectedMaterials(prev =>
      prev.includes(material) ? prev.filter(m => m !== material) : [...prev, material]
    )
  }, [])

  const clearFilters = useCallback(() => {
    selectCategory(null)
    setSelectedCategory("all")
    setPriceRange([...PRICE_RANGE_DEFAULT])
    setSelectedBrands([])
    setSelectedMaterials([])
    setCurrentPage(1)
  }, [selectCategory])

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.status === "published")

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.brand.toLowerCase().includes(q)
      )
    }

    if (selectedCategory !== "all") {
      result = result.filter(p => p.category === selectedCategory)
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand))
    }

    if (selectedMaterials.length > 0) {
      result = result.filter(p => selectedMaterials.includes(p.material))
    }

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break
      case "price-desc": result.sort((a, b) => b.price - a.price); break
      case "newest": result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
      case "popularity": result.sort((a, b) => b.reviewCount - a.reviewCount); break
      case "rating": result.sort((a, b) => b.rating - a.rating); break
    }

    return result
  }, [searchQuery, selectedCategory, priceRange, selectedBrands, selectedMaterials, sortBy])

  // Calcul de la pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE)
  }, [filteredProducts, currentPage])

  // Scroll vers le haut lors du changement de page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentPage])

  const activeFilterCount = useMemo(
    () =>
      (selectedCategory !== "all" ? 1 : 0) +
      selectedBrands.length +
      selectedMaterials.length +
      (priceRange[0] > PRICE_RANGE_DEFAULT[0] || priceRange[1] < PRICE_RANGE_DEFAULT[1] ? 1 : 0),
    [selectedCategory, selectedBrands.length, selectedMaterials.length, priceRange]
  )

  const FilterContent = () => (
    <div className="flex flex-col gap-6">
      {/* Categories */}
      <div>
        <h4 className="font-semibold mb-3 text-sm">Catégories</h4>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`text-left text-sm py-1 transition-colors ${selectedCategory === "all" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            Toutes ({products.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-left text-sm py-1 transition-colors ${selectedCategory === cat.id ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              {cat.name} ({products.filter(p => p.category === cat.id).length})
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold mb-3 text-sm">Prix</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={300}
          step={10}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="font-semibold mb-3 text-sm">Marques</h4>
        <div className="flex flex-col gap-2">
          {BRANDS.map(brand => (
            <label key={brand} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <span className="text-muted-foreground">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Materials */}
      <div>
        <h4 className="font-semibold mb-3 text-sm">Matière</h4>
        <div className="flex flex-col gap-2">
          {MATERIALS.slice(0, 6).map(material => (
            <label key={material} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={selectedMaterials.includes(material)}
                onCheckedChange={() => toggleMaterial(material)}
              />
              <span className="text-muted-foreground">{material}</span>
            </label>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button variant="outline" onClick={clearFilters} size="sm" className="gap-2">
          <X className="h-3.5 w-3.5" /> Effacer les filtres
        </Button>
      )}
    </div>
  )

  return (
    <div className={`${SECTION_CONTAINER} py-8`}>
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-6">
        <button type="button" onClick={() => navigate("home")} className="hover:text-foreground">Accueil</button>
        <span className="mx-2">/</span>
        <span className="text-foreground">Catalogue</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold">
          {searchQuery ? `Résultats pour "${searchQuery}"` : "Tous nos articles"}
        </h1>
        <span className="text-sm text-muted-foreground">{filteredProducts.length} article{filteredProducts.length > 1 ? "s" : ""}</span>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterContent />
        </aside>

        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-2">
              {/* Mobile filter button */}
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filtres
                    {activeFilterCount > 0 && (
                      <span className="bg-accent text-accent-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 bg-background text-foreground overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filtres</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="hidden md:flex items-center gap-1">
                <button onClick={() => setGridCols(3)} className={`p-1.5 rounded ${gridCols === 3 ? "bg-secondary" : ""}`}>
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button onClick={() => setGridCols(4)} className={`p-1.5 rounded ${gridCols === 4 ? "bg-secondary" : ""}`}>
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularité</SelectItem>
                <SelectItem value="newest">Nouveautés</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="rating">Meilleures notes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <ProductCardSkeletonGrid count={8} />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="max-w-md mx-auto">
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-muted rounded-full blur-2xl opacity-50" />
                    <Search className="h-20 w-20 text-muted-foreground relative" />
                  </div>
                </div>
                <h2 className="font-serif text-2xl font-bold mb-2">Aucun produit trouvé</h2>
                <p className="text-muted-foreground mb-6">
                  {activeFilterCount > 0
                    ? "Essayez de modifier vos critères de recherche ou de réinitialiser les filtres pour voir plus de résultats."
                    : "Nous n'avons pas trouvé de produits correspondant à votre recherche. Essayez d'autres mots-clés."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {activeFilterCount > 0 && (
                    <Button onClick={clearFilters} className="gap-2">
                      <X className="h-4 w-4" />
                      Réinitialiser les filtres
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => navigate("catalog")} className="gap-2">
                    Voir tout le catalogue
                  </Button>
                </div>
                {searchQuery && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Recherche : <span className="font-medium text-foreground">"{searchQuery}"</span>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className={`grid grid-cols-2 ${gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-4 md:gap-6`}>
                {paginatedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Affichage de {(currentPage - 1) * PRODUCTS_PER_PAGE + 1} à {Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length)} sur {filteredProducts.length} produits
                  </p>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => {
                            if (currentPage > 1) setCurrentPage(currentPage - 1)
                          }}
                          disabled={currentPage === 1}
                          aria-label="Page précédente"
                        />
                      </PaginationItem>

                      {/* Pages */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Afficher la première page, la dernière, la page actuelle et quelques pages autour
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setCurrentPage(page)
                                }}
                                isActive={currentPage === page}
                                aria-label={`Page ${page}`}
                                aria-current={currentPage === page ? "page" : undefined}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )
                        }
                        return null
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => {
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                          }}
                          disabled={currentPage === totalPages}
                          aria-label="Page suivante"
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
