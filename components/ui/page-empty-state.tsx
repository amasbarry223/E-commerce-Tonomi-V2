"use client"

import type { LucideIcon } from "lucide-react"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty"
import { cn } from "@/lib/utils"

export interface PageEmptyStateProps {
  /** Titre principal (ex. "Votre liste de favoris est vide") */
  title: string
  /** Description ou message secondaire */
  description: string
  /** Icône affichée au-dessus du titre */
  icon?: LucideIcon
  /** Contenu optionnel sous la description (boutons, liens) */
  children?: React.ReactNode
  className?: string
}

/**
 * État vide réutilisable pour les pages store et admin.
 * Encapsule le pattern Empty + EmptyHeader + EmptyMedia + EmptyTitle + EmptyDescription (+ EmptyContent si children).
 */
export function PageEmptyState({
  title,
  description,
  icon: Icon,
  children,
  className,
}: PageEmptyStateProps) {
  return (
    <Empty className={cn("py-16", className)}>
      <EmptyHeader>
        {Icon && (
          <EmptyMedia variant="icon">
            <Icon className="size-8" aria-hidden />
          </EmptyMedia>
        )}
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {children != null ? <EmptyContent>{children}</EmptyContent> : null}
    </Empty>
  )
}
