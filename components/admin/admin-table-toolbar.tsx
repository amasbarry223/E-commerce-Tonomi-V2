"use client"

import { SearchField } from "@/components/ui/search-field"

interface AdminTableToolbarProps {
  /** Placeholder pour le champ recherche. Si absent, le champ recherche n'est pas affiché. */
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  /** Filtres (Select, boutons, etc.) affichés à droite de la recherche. */
  children?: React.ReactNode
}

export function AdminTableToolbar({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  children,
}: AdminTableToolbarProps) {
  const showSearch =
    searchPlaceholder != null && searchValue != null && onSearchChange != null

  return (
    <div className="flex flex-col md:flex-row gap-3">
      {showSearch && (
        <SearchField
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          aria-label="Recherche dans le tableau"
        />
      )}
      {children}
    </div>
  )
}
