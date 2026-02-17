/**
 * Composant DataTable générique réutilisable
 */
import React from 'react'
import { cn } from '../../lib/utils/cn'

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
  hidden?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string
  emptyMessage?: string
  emptyIcon?: React.ReactNode
  className?: string
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  keyExtractor,
  emptyMessage = 'Aucune donnée trouvée',
  emptyIcon,
  className,
}: DataTableProps<T>) {
  const visibleColumns = columns.filter((col) => !col.hidden)

  if (data.length === 0) {
    return (
      <div className={cn('py-12 text-center', className)}>
        {emptyIcon}
        <p className="text-muted-foreground mt-2">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn('bg-card border border-border rounded-lg overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {visibleColumns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'text-left py-3 px-4 font-medium text-muted-foreground',
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                {visibleColumns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={cn('py-3 px-4', column.className)}
                  >
                    {column.render
                      ? column.render(item)
                      : String(item[column.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

