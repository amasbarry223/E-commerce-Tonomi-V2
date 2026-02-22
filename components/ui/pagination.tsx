"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Composants shadcn/ui standard pour la pagination
const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
      isActive && "bg-primary text-primary-foreground pointer-events-none",
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button
    aria-label="Page précédente"
    variant="outline"
    size="icon"
    className={cn("h-9 w-9", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
  </Button>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button
    aria-label="Page suivante"
    variant="outline"
    size="icon"
    className={cn("h-9 w-9", className)}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
  </Button>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  className?: string
  showInfo?: boolean
  itemLabel?: string
}

/**
 * Composant de pagination réutilisable (API simplifiée).
 * Structure cible : div.flex.items-center.justify-between.gap-4 > (p.text-sm.text-muted-foreground "Affichage de X à Y sur Z {itemLabel}") + nav[aria-label=pagination] > ul.flex.flex-row.items-center.gap-1 > li (Prev, 1…N, Next).
 */
export function PaginationSimple({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
  showInfo = true,
  itemLabel = "résultats",
}: PaginationProps) {
  // Ne rien afficher s'il n'y a aucun résultat
  if (totalItems === 0) return null

  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems)
  const showNav = totalPages > 1

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full",
        className
      )}
    >
      {showInfo && (
        <p className="text-sm text-muted-foreground order-2 sm:order-1 shrink-0">
          Affichage de {startIndex} à {endIndex} sur {totalItems} {itemLabel}
        </p>
      )}

      {showNav && (
        <Pagination className="order-1 sm:order-2 w-full sm:w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  if (currentPage > 1) onPageChange(currentPage - 1)
                }}
                disabled={currentPage === 1}
                aria-label="Page précédente"
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                const isActive = currentPage === page
                return (
                  <PaginationItem key={page}>
                    <button
                      type="button"
                      onClick={() => onPageChange(page)}
                      aria-label={`Page ${page}`}
                      aria-current={isActive ? "page" : undefined}
                      disabled={isActive}
                      className={cn(
                        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                        isActive &&
                          "bg-primary text-primary-foreground pointer-events-none"
                      )}
                    >
                      {page}
                    </button>
                  </PaginationItem>
                )
              }
              if (page === currentPage - 2 || page === currentPage + 2) {
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
                  if (currentPage < totalPages) onPageChange(currentPage + 1)
                }}
                disabled={currentPage === totalPages}
                aria-label="Page suivante"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

// Export des composants shadcn/ui standard
export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
}
