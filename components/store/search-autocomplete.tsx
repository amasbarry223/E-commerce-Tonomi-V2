"use client"

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { useNavigationStore } from "@/lib/store-context"
import { PAGES } from "@/lib/routes"
import { getProducts } from "@/lib/services"
import type { Product } from "@/lib/types"
import { formatPrice } from "@/lib/formatters"
import { Search, X, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useDebouncedValue } from "@/hooks/use-debounced-value"

interface SearchSuggestion {
  product: Product
  matchType: "name" | "brand" | "tag" | "category"
  matchText: string
}

interface SearchAutocompleteProps {
  /** Appelé après une navigation (sélection produit ou recherche catalogue). Utile pour fermer un Sheet mobile. */
  onAfterNavigate?: () => void
}

/**
 * Composant de recherche avec autocomplétion
 * Affiche des suggestions de produits pendant la saisie (debounce 250 ms pour limiter les recalculs)
 */
function SearchAutocompleteInner({ onAfterNavigate }: SearchAutocompleteProps = {}) {
  const { searchQuery, setSearchQuery, navigate, selectProduct } = useNavigationStore()
  const products = getProducts()
  const debouncedQuery = useDebouncedValue(searchQuery, 250)
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filtrer les produits selon la recherche (basé sur la valeur debounced)
  const suggestions = useMemo<SearchSuggestion[]>(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) return []

    const query = debouncedQuery.toLowerCase().trim()
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
  }, [debouncedQuery])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setIsOpen(value.length >= 2)
    setHighlightedIndex(-1)
  }, [setSearchQuery])

  const handleSelectProduct = useCallback((product: Product) => {
    selectProduct(product.id)
    navigate(PAGES.store.product)
    setIsOpen(false)
    setSearchQuery("")
    inputRef.current?.blur()
    onAfterNavigate?.()
  }, [selectProduct, navigate, setSearchQuery, onAfterNavigate])

  const performSearch = useCallback(() => {
    if (searchQuery.trim()) {
      navigate(PAGES.store.catalog)
      setIsOpen(false)
      inputRef.current?.blur()
      onAfterNavigate?.()
    }
  }, [searchQuery, navigate, onAfterNavigate])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    performSearch()
  }, [performSearch])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault()
        performSearch()
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
          performSearch()
        }
        break
      case "Escape":
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }, [isOpen, suggestions, highlightedIndex, handleSelectProduct, performSearch])

  // Fermer le dropdown si on clique en dehors
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, handleClickOutside])

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
          aria-label={searchQuery.trim() ? "Lancer la recherche" : "Saisir au moins un caractère pour rechercher"}
          title={!searchQuery.trim() ? "Saisir au moins un caractère pour rechercher" : undefined}
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
                          src={product.images[0] ?? "/placeholder.svg"}
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
                <p>Aucun produit trouvé pour &quot;{searchQuery}&quot;</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={performSearch}
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

export const SearchAutocomplete = React.memo(SearchAutocompleteInner)