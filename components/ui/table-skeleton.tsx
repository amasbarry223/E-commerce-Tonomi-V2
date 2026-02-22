'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

interface TableSkeletonProps {
  rowCount?: number
  columnCount?: number
}

/**
 * @component TableSkeleton
 * @description Skeleton de tableau affiché pendant le chargement des données (admin et listes).
 * @accessibility WCAG 2.1 AA (structure sémantique table)
 * @responsive mobile | tablet | desktop
 * @dependencies Table, Skeleton
 */
export function TableSkeleton({ rowCount = 5, columnCount = 5 }: TableSkeletonProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Array.from({ length: columnCount }).map((_, i) => (
            <TableHead key={i}>
              <Skeleton className="h-4 w-16" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from({ length: columnCount }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton className="h-4 w-full max-w-[120px]" variant="text" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
