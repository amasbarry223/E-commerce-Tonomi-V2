/**
 * Utilitaires pour la pagination
 */

export interface PaginationOptions {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * Pagine un tableau de données
 */
export function paginate<T>(
  data: T[],
  options: PaginationOptions
): PaginatedResult<T> {
  const { page, pageSize } = options
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedData = data.slice(start, end)
  const totalPages = Math.ceil(data.length / pageSize)
  
  return {
    data: paginatedData,
    total: data.length,
    page,
    pageSize,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}

