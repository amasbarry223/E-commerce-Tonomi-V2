/**
 * Hook pour la pagination
 */
import { useState, useMemo } from 'react'
import { paginate, type PaginatedResult } from '../utils/pagination'

export function usePagination<T>(
  data: T[],
  initialPageSize: number = 12
) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  
  const paginated = useMemo<PaginatedResult<T>>(() => {
    return paginate(data, { page, pageSize })
  }, [data, page, pageSize])
  
  const nextPage = () => {
    if (paginated.hasNext) setPage((p) => p + 1)
  }
  
  const prevPage = () => {
    if (paginated.hasPrev) setPage((p) => p - 1)
  }
  
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginated.totalPages) {
      setPage(newPage)
    }
  }
  
  return {
    ...paginated,
    setPage: goToPage,
    nextPage,
    prevPage,
    setPageSize,
  }
}

