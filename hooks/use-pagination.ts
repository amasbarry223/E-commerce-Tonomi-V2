"use client"

import { useState, useMemo } from "react"

interface UsePaginationOptions {
  itemsPerPage?: number
  initialPage?: number
}

interface UsePaginationReturn<T> {
  paginatedData: T[]
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  canGoNext: boolean
  canGoPrev: boolean
  startIndex: number
  endIndex: number
}

/**
 * Hook réutilisable pour gérer la pagination de données
 * 
 * @param data - Tableau de données à paginer
 * @param options - Options de pagination (itemsPerPage, initialPage)
 * @returns Objet contenant les données paginées et les fonctions de navigation
 * 
 * @example
 * ```tsx
 * const { paginatedData, currentPage, totalPages, nextPage, prevPage } = usePagination(products, { itemsPerPage: 10 })
 * ```
 */
export function usePagination<T>(
  data: T[],
  options: UsePaginationOptions = {}
): UsePaginationReturn<T> {
  const { itemsPerPage = 10, initialPage = 1 } = options
  const [currentPage, setCurrentPage] = useState(initialPage)

  const totalItems = data.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))

  // S'assurer que la page actuelle est valide
  const validPage = Math.min(Math.max(1, currentPage), totalPages)
  if (validPage !== currentPage && totalPages > 0) {
    setCurrentPage(validPage)
  }

  const paginatedData = useMemo(() => {
    if (totalItems === 0) return []
    const startIndex = (validPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data.slice(startIndex, endIndex)
  }, [data, validPage, itemsPerPage, totalItems])

  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(newPage)
  }

  const nextPage = () => {
    if (validPage < totalPages) {
      setCurrentPage(validPage + 1)
    }
  }

  const prevPage = () => {
    if (validPage > 1) {
      setCurrentPage(validPage - 1)
    }
  }

  const canGoNext = validPage < totalPages
  const canGoPrev = validPage > 1
  const startIndex = totalItems === 0 ? 0 : (validPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(validPage * itemsPerPage, totalItems)

  return {
    paginatedData,
    currentPage: validPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
    startIndex,
    endIndex,
  }
}

