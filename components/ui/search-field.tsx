"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface SearchFieldProps extends Omit<React.ComponentProps<typeof Input>, "value" | "onChange"> {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  /** Si fourni, affiche un bouton pour effacer la recherche quand value est non vide */
  onClear?: () => void
  /** Accessibilité : label du champ (recommandé) */
  "aria-label"?: string
}

const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    {
      value,
      onChange,
      placeholder = "Rechercher…",
      onClear,
      className,
      "aria-label": ariaLabel,
      ...rest
    },
    ref
  ) => {
    const showClear = value.length > 0 && onClear != null

    return (
      <div className="relative flex-1 min-w-0">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
          aria-hidden
        />
        <Input
          ref={ref}
          type="search"
          role="searchbox"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn("pl-10", showClear && "pr-10", className)}
          aria-label={ariaLabel ?? "Recherche"}
          {...rest}
        />
        {showClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors rounded p-0.5"
            aria-label="Effacer la recherche"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)

SearchField.displayName = "SearchField"

export { SearchField }
