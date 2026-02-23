"use client"

import type { LucideIcon } from "lucide-react"
import { Package } from "lucide-react"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty"
import { cn } from "@/lib/utils"

interface AdminEmptyStateProps {
  title: string
  description: string
  icon?: LucideIcon
  className?: string
  children?: React.ReactNode
}

export function AdminEmptyState({
  title,
  description,
  icon: Icon = Package,
  className,
  children,
}: AdminEmptyStateProps) {
  return (
    <Empty className={cn("py-12 border-0", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon className="size-6" aria-hidden />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {children != null ? <EmptyContent>{children}</EmptyContent> : null}
    </Empty>
  )
}
