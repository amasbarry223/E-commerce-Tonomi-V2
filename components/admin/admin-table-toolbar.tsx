"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

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
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-10"
          />
        </div>
      )}
      {children}
    </div>
  )
}
