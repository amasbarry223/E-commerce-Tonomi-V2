"use client"

/**
 * @component CatalogPage
 * @description Page catalogue avec filtres (catégorie, prix, marques, matière), tri et pagination.
 * @accessibility WCAG 2.1 AA (breadcrumb sémantique, états vides Empty, filtres)
 * @responsive mobile | tablet | desktop
 * @dependencies useStore, lib/data, Empty, Breadcrumb, ProductCard, PaginationSimple
 */

import { useState, useMemo, useEffect, useCallback } from "react"
import { useStore } from "@/lib/store-context"
import { PAGES } from "@/lib/routes"
import { products, categories, formatPrice } from "@/lib/data"
import { SECTION_CONTAINER } from "@/lib/layout"
import { ProductCard } from "./product-card"
import { ProductCardSkeletonGrid } from "./product-card-skeleton"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { SlidersHorizontal, X, Grid3X3, LayoutGrid, Search } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { PaginationSimple } from "@/components/ui/pagination"

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
      case "price-asc": return [...result].sort((a, b) => a.price - b.price)
      case "price-desc": return [...result].sort((a, b) => b.price - a.price)
      case "newest": return [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case "popularity": return [...result].sort((a, b) => b.reviewCount - a.reviewCount)
      case "rating": return [...result].sort((a, b) => b.rating - a.rating)
      default: return result
    }
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
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button type="button" onClick={() => navigate(PAGES.store.home)}>
                Accueil
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Catalogue</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
            <Empty className="py-20 px-4 border-0">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Search className="size-6" aria-hidden />
                </EmptyMedia>
                <EmptyTitle>Aucun produit trouvé</EmptyTitle>
                <EmptyDescription>
                  {activeFilterCount > 0
                    ? "Essayez de modifier vos critères de recherche ou de réinitialiser les filtres pour voir plus de résultats."
                    : "Nous n'avons pas trouvé de produits correspondant à votre recherche. Essayez d'autres mots-clés."}
                  {searchQuery && (
                    <span className="block mt-2">
                      Recherche : <span className="font-medium text-foreground">"{searchQuery}"</span>
                    </span>
                  )}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {activeFilterCount > 0 && (
                    <Button onClick={clearFilters} className="gap-2">
                      <X className="h-4 w-4" />
                      Réinitialiser les filtres
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => navigate(PAGES.store.catalog)} className="gap-2">
                    Voir tout le catalogue
                  </Button>
                </div>
              </EmptyContent>
            </Empty>
          ) : (
            <>
              <div className={`grid grid-cols-2 ${gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-4 md:gap-6`}>
                {paginatedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <PaginationSimple
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredProducts.length}
                    itemsPerPage={PRODUCTS_PER_PAGE}
                    onPageChange={setCurrentPage}
                    itemLabel="produits"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
