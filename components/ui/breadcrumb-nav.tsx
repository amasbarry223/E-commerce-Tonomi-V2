"use client"

import * as React from "react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

export interface BreadcrumbNavItem {
  label: React.ReactNode
  href?: string
  onClick?: () => void
  current?: boolean
  className?: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbNavItem[]
  className?: string
}

/**
 * Fil d'Ariane générique à partir d'une liste d'items (lien, bouton ou page courante).
 * Utilisé par CatalogBreadcrumb, ProductBreadcrumb, AdminBreadcrumb.
 */
export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.current ? (
                <BreadcrumbPage className={item.className}>{item.label}</BreadcrumbPage>
              ) : item.href != null ? (
                <BreadcrumbLink href={item.href} className={item.className}>
                  {item.label}
                </BreadcrumbLink>
              ) : item.onClick != null ? (
                <BreadcrumbLink asChild>
                  <button type="button" onClick={item.onClick} className={cn("cursor-pointer", item.className)}>
                    {item.label}
                  </button>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className={item.className}>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export interface CatalogBreadcrumbProps {
  onHomeClick: () => void
  className?: string
}

/** Fil d'Ariane page Catalogue : Accueil → Catalogue (page courante). */
export function CatalogBreadcrumb({ onHomeClick, className }: CatalogBreadcrumbProps) {
  return (
    <BreadcrumbNav
      className={className}
      items={[
        { label: "Accueil", onClick: onHomeClick },
        { label: "Catalogue", current: true },
      ]}
    />
  )
}

export interface ProductBreadcrumbProps {
  onHomeClick: () => void
  onCatalogClick: () => void
  onCategoryClick?: () => void
  categoryLabel?: string
  productName: string
  className?: string
}

/** Fil d'Ariane page Produit : Accueil → Catalogue [→ Catégorie] → Produit (page courante). */
export function ProductBreadcrumb({
  onHomeClick,
  onCatalogClick,
  onCategoryClick,
  categoryLabel,
  productName,
  className,
}: ProductBreadcrumbProps) {
  const items: BreadcrumbNavItem[] = [
    { label: "Accueil", onClick: onHomeClick },
    { label: "Catalogue", onClick: onCatalogClick },
  ]
  if (categoryLabel != null && categoryLabel !== "" && onCategoryClick != null) {
    items.push({ label: categoryLabel, onClick: onCategoryClick })
  }
  items.push({
    label: productName,
    current: true,
    className: "truncate max-w-[200px] inline-block",
  })
  return <BreadcrumbNav className={className} items={items} />
}

export interface AdminBreadcrumbProps {
  dashboardHref: string
  currentLabel?: string
  isDashboard?: boolean
  className?: string
}

/** Fil d'Ariane admin : Tableau de bord [→ page courante]. */
export function AdminBreadcrumb({
  dashboardHref,
  currentLabel,
  isDashboard = false,
  className,
}: AdminBreadcrumbProps) {
  const items: BreadcrumbNavItem[] = [
    isDashboard
      ? { label: "Tableau de bord", current: true }
      : { label: "Tableau de bord", href: dashboardHref },
  ]
  if (currentLabel != null && currentLabel !== "" && !isDashboard) {
    items.push({ label: currentLabel, current: true })
  }
  return <BreadcrumbNav className={className} items={items} />
}
