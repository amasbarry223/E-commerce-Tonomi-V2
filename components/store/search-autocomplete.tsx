"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { useStore } from "@/lib/store-context"
import { products, type Product } from "@/lib/data"
import { formatPrice } from "@/lib/data"
import { Search, X, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface SearchSuggestion {
  product: Product
  matchType: "name" | "brand" | "tag" | "category"
  matchText: string
}

/**
 * Composant de recherche avec autocomplétion
 * Affiche des suggestions de produits pendant la saisie
 */
export function SearchAutocomplete() {
  const { searchQuery, setSearchQuery, navigate, selectProduct } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filtrer les produits selon la recherche
  const suggestions = useMemo<SearchSuggestion[]>(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return []

    const query = searchQuery.toLowerCase().trim()
    const results: SearchSuggestion[] = []

    products
      .filter(p => p.status === "published")
      .forEach(product => {
        // Recherche dans le nom
        if (product.name.toLowerCase().includes(query)) {
          results.push({
            product,
            matchType: "name",
            matchText: product.name
          })
          return
        }

        // Recherche dans la marque
        if (product.brand.toLowerCase().includes(query)) {
          results.push({
            product,
            matchType: "brand",
            matchText: product.brand
          })
          return
        }

        // Recherche dans les tags
        const matchingTag = product.tags.find(tag => tag.toLowerCase().includes(query))
        if (matchingTag) {
          results.push({
            product,
            matchType: "tag",
            matchText: matchingTag
          })
          return
        }
      })

    // Limiter à 8 résultats pour la performance
    return results.slice(0, 8)
  }, [searchQuery])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setIsOpen(value.length >= 2)
    setHighlightedIndex(-1)
  }, [setSearchQuery])

  const handleSelectProduct = useCallback((product: Product) => {
    selectProduct(product.id)
    navigate("product")
    setIsOpen(false)
    setSearchQuery("")
    inputRef.current?.blur()
  }, [selectProduct, navigate, setSearchQuery])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate("catalog")
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }, [searchQuery, navigate])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Enter") {
        handleSubmit(e as any)
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case "Enter":
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelectProduct(suggestions[highlightedIndex].product)
        } else {
          handleSubmit(e as any)
        }
        break
      case "Escape":
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }, [isOpen, suggestions, highlightedIndex, handleSelectProduct, handleSubmit])

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const hasResults = suggestions.length > 0
  const showSuggestions = isOpen && searchQuery.length >= 2

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form 
        onSubmit={handleSubmit} 
        className="flex items-center gap-2" 
        role="search" 
        aria-label="Recherche de produits"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => searchQuery.length >= 2 && setIsOpen(true)}
            placeholder="Rechercher un produit..."
            className="pl-10 pr-10 h-9 text-sm"
            aria-label="Champ de recherche"
            aria-describedby="search-description"
            aria-expanded={showSuggestions}
            aria-controls="search-suggestions"
            aria-autocomplete="list"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("")
                setIsOpen(false)
                inputRef.current?.focus()
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Effacer la recherche"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span id="search-description" className="sr-only">
            Rechercher un produit par nom, marque ou mot-clé. Utilisez les flèches pour naviguer, Entrée pour sélectionner.
          </span>
        </div>
        <Button 
          type="submit" 
          size="sm"
          disabled={!searchQuery.trim()}
          aria-label="Lancer la recherche"
        >
          Rechercher
        </Button>
      </form>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            id="search-suggestions"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto"
            role="listbox"
            aria-label="Suggestions de recherche"
          >
            {hasResults ? (
              <div className="p-2">
                {suggestions.map((suggestion, index) => {
                  const { product } = suggestion
                  const isHighlighted = index === highlightedIndex
                  
                  return (
                    <motion.button
                      key={product.id}
                      type="button"
                      onClick={() => handleSelectProduct(product)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors",
                        "hover:bg-secondary focus:bg-secondary focus:outline-none",
                        isHighlighted && "bg-secondary"
                      )}
                      role="option"
                      aria-selected={isHighlighted}
                    >
                      <div className="relative h-12 w-12 rounded-md overflow-hidden shrink-0 bg-secondary">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{product.brand}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </motion.button>
                  )
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-muted-foreground">
                <p>Aucun produit trouvé pour "{searchQuery}"</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={handleSubmit as any}
                >
                  Voir tous les résultats
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

