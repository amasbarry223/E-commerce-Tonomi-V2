"use client"

import { useState, useMemo } from "react"
import { useStore } from "@/lib/store-context"
import { products, categories, formatPrice } from "@/lib/data"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { SlidersHorizontal, X, Grid3X3, LayoutGrid } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"

const materials = ["Cuir véritable", "Cuir grainé", "Cuir saffiano", "Cuir d'agneau", "Canvas & Cuir", "Nylon imperméable", "Similicuir", "Toile & Cuir"]
const brands = ["Maison Élégance", "Bohème Paris", "Cristal de Paris", "Urban Mode", "Riviera Mode", "Artisan Paris"]

export function CatalogPage() {
  const { searchQuery } = useStore()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<number[]>([0, 300])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>("popularity")
  const [gridCols, setGridCols] = useState<3 | 4>(4)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  const toggleMaterial = (material: string) => {
    setSelectedMaterials(prev =>
      prev.includes(material) ? prev.filter(m => m !== material) : [...prev, material]
    )
  }

  const clearFilters = () => {
    setSelectedCategory("all")
    setPriceRange([0, 300])
    setSelectedBrands([])
    setSelectedMaterials([])
  }

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

  const activeFilterCount = (selectedCategory !== "all" ? 1 : 0) + selectedBrands.length + selectedMaterials.length + (priceRange[0] > 0 || priceRange[1] < 300 ? 1 : 0)

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
          {brands.map(brand => (
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
          {materials.slice(0, 6).map(material => (
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
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-6">
        <button onClick={() => {}} className="hover:text-foreground">Accueil</button>
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
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-4">Aucun produit trouvé</p>
              <Button variant="outline" onClick={clearFilters}>Réinitialiser les filtres</Button>
            </div>
          ) : (
            <div className={`grid grid-cols-2 ${gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-4 md:gap-6`}>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
